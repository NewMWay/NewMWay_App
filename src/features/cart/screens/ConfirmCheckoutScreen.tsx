import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader'
import { useNavigation, useRoute, RouteProp, useFocusEffect, useIsFocused } from '@react-navigation/native'
import { CartStackNavigationProp, CartStackParamList } from '../../../types/navigation/navigation'
import LoadingOverlay from '../../auth/components/Loading/LoadingOverlay'
import { Colors } from '../../../assets/styles/colorStyles'
import ButtonAction from '../../auth/components/Button/ButtonAction'
import { ifTablet } from '../../../utils/responsives/responsive'
import CheckoutRecipientInfo from '../components/CheckoutRecipientInfo'
import CartConfirm from '../components/CartConfirm'
import PriceInfo from '../components/PriceInfo'
import { getSelectedAddressForCheckout, setSelectedAddressForCheckout } from '../stores/addressSelectionStore'
import { usePromotionQuery } from '../../promotion/hooks/usePromotionQuery.hook'
import { PromotionItem } from '../../promotion/types/promotion.type'
import { PromotionType } from '../../promotion/types/promotion.enum'
import { useCalculateFee } from '../../fee/hooks/useCalculateFee.hook'
import { useUserAddressQuery } from '../../address/hooks/useAddress.hook'
import { useCreateOrder } from '../../order/hooks/useOrder.hook'
import { useCreatePayment } from '../../order/hooks/usePayment.hook'
import { PaymentMethod } from '../../order/types/payment.enum'
import { useToast } from '../../../utils/toasts/useToast'
import { useDeleteCartItem } from '../hooks/useCart.hook'


type ConfirmCheckoutScreenRouteProp = RouteProp<CartStackParamList, 'ConfirmCheckoutScreen'>;

const ConfirmCheckoutScreen = () => {
    const navigation = useNavigation<CartStackNavigationProp>();
    const route = useRoute<ConfirmCheckoutScreenRouteProp>();
    const isFocused = useIsFocused();
    const isMountedRef = useRef(true);
    const { data: promotions } = usePromotionQuery({});
    const { data: userAddresses } = useUserAddressQuery();

    const { mutate: calculateFee, isPending: isFeeCalculating } = useCalculateFee();
    const { mutate: createOrder, isPending: isOrderCreating } = useCreateOrder();
    const { mutate: createPayment, isPending: isPaymentCreating } = useCreatePayment();
    const { mutate: deleteCartItem, isPending: isDeletingCartItem } = useDeleteCartItem();

    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(() => {
        if (route.params && route.params.selectedAddressId) {
            return route.params.selectedAddressId;
        }
        const fromStore = getSelectedAddressForCheckout();
        return fromStore;
    });

    // Cleanup on unmount
    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    React.useEffect(() => {
        if (!selectedAddressId && userAddresses && userAddresses.length > 0) {
            const defaultAddress = userAddresses.find(addr => addr.isDefault);
            if (defaultAddress) {
                setSelectedAddressId(defaultAddress.id);
                setSelectedAddressForCheckout(defaultAddress.id);
            }
        }
    }, [userAddresses, selectedAddressId]);

    React.useEffect(() => {
        if (selectedAddressId) {
            setSelectedAddressForCheckout(selectedAddressId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            const addressFromStore = getSelectedAddressForCheckout();
            if (addressFromStore && addressFromStore !== selectedAddressId) {
                setSelectedAddressId(addressFromStore);
            }
        }, [selectedAddressId])
    );

    const [orderNote, setOrderNote] = useState('');
    const [selectedOrderPromotion, setSelectedOrderPromotion] = useState<PromotionItem | null>(null);
    const [selectedShippingPromotion, setSelectedShippingPromotion] = useState<PromotionItem | null>(null);
    const [showVoucherList, setShowVoucherList] = useState(false);
    const [shippingFee, setShippingFee] = useState(0);
    const [shipFeeOnly, setShipFeeOnly] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
    const { showError } = useToast();

    const cartItems = route.params?.selectedItems || [];
    console.log('🛒 Selected Cart Items for Checkout:', cartItems);

    const availablePromotions = promotions?.pages[0]?.items?.filter(item => item.isActive) || [];

    const calculateDiscount = (promotion: PromotionItem, orderTotal: number, shipOnly: number): number => {
        if (!promotion) return 0;

        // Field validation
        if (!promotion.id || typeof promotion.id !== 'string' || promotion.id.trim() === '') return 0;
        if (typeof promotion.discountValue !== 'number' || promotion.discountValue <= 0 || promotion.discountValue > 100) return 0;
        if (typeof promotion.minOrderValue !== 'number' || promotion.minOrderValue < 0) return 0;
        if (typeof promotion.maxDiscountValue !== 'number' || promotion.maxDiscountValue <= 0) return 0;

        // Temporal & status checks
        const now = new Date();
        const start = new Date(promotion.startDate);
        const end = new Date(promotion.endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
        if (start >= end) return 0;
        if (now < start || now > end) return 0;
        if (!promotion.isActive) return 0;
        if (typeof promotion.quantity !== 'number' || promotion.quantity <= 0) return 0;

        // Check minimum order value
        if (orderTotal < promotion.minOrderValue) return 0;

        let discountBase = 0;
        if (promotion.type === PromotionType.Shipping) {
            // Shipping voucher: apply to ship_fee_only
            discountBase = (shipOnly * promotion.discountValue) / 100;
            discountBase = Math.min(discountBase, shipOnly); // Cannot exceed shipping fee
        } else {
            // Order voucher: apply to orderTotal
            discountBase = (orderTotal * promotion.discountValue) / 100;
        }

        // Apply max discount cap
        return Math.min(discountBase, promotion.maxDiscountValue);
    };

    const currentOrderTotal = cartItems.reduce((sum, item) => {
        return sum + (item.totalPrice || (item.price * item.quantity));
    }, 0);

    const orderVoucherDiscount = selectedOrderPromotion
        ? calculateDiscount(selectedOrderPromotion, currentOrderTotal, shipFeeOnly)
        : 0;
    const shippingVoucherDiscount = selectedShippingPromotion
        ? calculateDiscount(selectedShippingPromotion, currentOrderTotal, shipFeeOnly)
        : 0;
    const voucherDiscount = orderVoucherDiscount + shippingVoucherDiscount;

    React.useEffect(() => {
        if (userAddresses && currentOrderTotal > 0) {
            const selectedAddress = selectedAddressId
                ? userAddresses.find(addr => addr.id === selectedAddressId)
                : userAddresses.find(addr => addr.isDefault);

            if (selectedAddress) {
                calculateFee(
                    {
                        province: selectedAddress.province,
                        district: selectedAddress.district,
                        weight: 1000, // Hardcoded weight
                        value: currentOrderTotal
                    },
                    {
                        onSuccess: (data) => {
                            setShippingFee(data.fee || 0);
                            setShipFeeOnly(data.ship_fee_only || data.fee || 0);
                        },
                        onError: () => {
                            setShippingFee(30000); // Default fallback fee
                            setShipFeeOnly(30000);
                        }
                    }
                );
            }
        }
    }, [selectedAddressId, userAddresses, currentOrderTotal, calculateFee]);

    const handleBackPress = () => {
        if (!isMountedRef.current || !isFocused) return;
        navigation.goBack();
    }

    const deleteSelectedCartItems = () => {
        console.log('🗑️ Deleting selected cart items:', cartItems.length);
        cartItems.forEach((item) => {
            deleteCartItem({ id: item.id }, {
                onSuccess: () => {
                    console.log('✅ Deleted cart item:', item.id);
                },
                onError: (error) => {
                    console.error('❌ Failed to delete cart item:', item.id, error);
                }
            });
        });
    };

    const validatePromotion = (promotion: PromotionItem | null, orderTotal: number): { valid: boolean; reason?: string } => {
        if (!promotion) return { valid: false, reason: 'Không có mã giảm giá' };
        if (!promotion.id || typeof promotion.id !== 'string' || promotion.id.trim() === '') {
            return { valid: false, reason: 'Mã giảm giá không hợp lệ' };
        }
        if (!Object.values(PromotionType).includes(promotion.type as PromotionType)) {
            return { valid: false, reason: 'Loại mã giảm giá không hợp lệ' };
        }
        if (typeof promotion.quantity !== 'number' || promotion.quantity <= 0) {
            return { valid: false, reason: 'Voucher đã hết số lượng' };
        }
        if (typeof promotion.discountValue !== 'number' || promotion.discountValue <= 0 || promotion.discountValue > 100) {
            return { valid: false, reason: 'Giá trị giảm không hợp lệ' };
        }
        if (typeof promotion.minOrderValue !== 'number' || promotion.minOrderValue < 0) {
            return { valid: false, reason: 'Giá trị đơn tối thiểu không hợp lệ' };
        }
        if (typeof promotion.maxDiscountValue !== 'number' || promotion.maxDiscountValue <= 0) {
            return { valid: false, reason: 'Giá trị giảm tối đa không hợp lệ' };
        }

        const now = new Date();
        const start = new Date(promotion.startDate);
        const end = new Date(promotion.endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return { valid: false, reason: 'Ngày áp dụng không hợp lệ' };
        }
        if (start >= end) {
            return { valid: false, reason: 'Ngày bắt đầu phải trước ngày kết thúc' };
        }
        if (now < start) {
            return { valid: false, reason: 'Voucher chưa đến ngày áp dụng' };
        }
        if (now > end) {
            return { valid: false, reason: 'Voucher đã hết hạn' };
        }
        if (!promotion.isActive) {
            return { valid: false, reason: 'Voucher không hoạt động' };
        }
        if (orderTotal < promotion.minOrderValue) {
            return { valid: false, reason: 'Không đủ giá trị đơn hàng tối thiểu' };
        }

        return { valid: true };
    };

    const handleConfirmPress = () => {
        if (!isMountedRef.current || !isFocused) return;
        // Validate selected address
        if (!selectedAddressId) {
            showError('Vui lòng chọn địa chỉ nhận hàng!');
            return;
        }

        // Validate cart items
        if (cartItems.length === 0) {
            showError('Giỏ hàng trống!');
            return;
        }

        // Validate selected promotions
        if (selectedOrderPromotion) {
            const { valid, reason } = validatePromotion(selectedOrderPromotion, currentOrderTotal);
            if (!valid) {
                showError(reason || 'Voucher Order không hợp lệ');
                return;
            }
        }
        if (selectedShippingPromotion) {
            const { valid, reason } = validatePromotion(selectedShippingPromotion, currentOrderTotal);
            if (!valid) {
                showError(reason || 'Voucher Shipping không hợp lệ');
                return;
            }
        }

        // Calculate final discounts
        const finalOrderDiscount = selectedOrderPromotion
            ? Math.min((currentOrderTotal * selectedOrderPromotion.discountValue) / 100, selectedOrderPromotion.maxDiscountValue)
            : 0;
        let finalShippingDiscount = selectedShippingPromotion
            ? Math.min((shipFeeOnly * selectedShippingPromotion.discountValue) / 100, selectedShippingPromotion.maxDiscountValue)
            : 0;
        finalShippingDiscount = Math.min(finalShippingDiscount, shipFeeOnly);

        const finalTotal = currentOrderTotal - finalOrderDiscount + shippingFee - finalShippingDiscount;
        if (finalTotal < 0) {
            showError('Tổng tiền sau khi áp dụng mã giảm không được âm');
            return;
        }

        const productVariantOptionValueStocks = cartItems.map(item => ({
            productVariantOptionValueStockId: item.productVariantOptionValueStockId,
            quantity: item.quantity
        }));

        const shippingAmount = shippingFee;

        const selectedPromotionIds = [
            ...(selectedOrderPromotion ? [selectedOrderPromotion.id] : []),
            ...(selectedShippingPromotion ? [selectedShippingPromotion.id] : [])
        ];

        console.log('📦 Order Request Data:', {
            userAddressId: selectedAddressId,
            productVariantOptionValueStocks,
            promotions: selectedPromotionIds,
            note: orderNote
        });

        const orderRequest = {
            userAddressId: selectedAddressId,
            productVariantOptionValueStocks,
            shippingAmount,
            promotions: selectedPromotionIds,
            ...(orderNote && { note: orderNote })
        };

        createOrder(orderRequest, {
            onSuccess: (orderResponse) => {
                console.log('✅ Tạo đơn hàng thành công!');
                const paymentRequest = {
                    id: orderResponse.id,
                    type: paymentMethod === 'cod' ? PaymentMethod.CASH_ON_DELIVERY : PaymentMethod.ONLINE_PAYMENT
                };

                createPayment(paymentRequest, {
                    onSuccess: (paymentResponse) => {
                        if (paymentMethod === 'online') {
                            navigation.navigate('PaymentWebViewScreen', { checkoutUrl: paymentResponse.checkoutUrl, cartItems });
                        } else {
                            deleteSelectedCartItems();
                            const parentNavigation = navigation.getParent();
                            if (parentNavigation) {
                                parentNavigation.reset({
                                    index: 0,
                                    routes: [{
                                        name: 'Cá Nhân',
                                        params: {
                                            screen: 'ProfileScreen',
                                            params: { activeTab: 1 }
                                        }
                                    }],
                                });
                            }
                        }
                    },
                    onError: (error) => {
                        console.error('❌ Lỗi tạo thanh toán:', error);
                        navigation.navigate('PaymentFailedScreen', { status: 'failed' });
                    }
                });
            },
            onError: (error) => {
                console.error('❌ Lỗi tạo đơn hàng:', error);
                navigation.navigate('PaymentFailedScreen', { status: 'failed' });
            }
        });
    }

    const handleVoucherPress = () => {
        setShowVoucherList(!showVoucherList);
    }

    const handleSelectVoucher = (promotion: PromotionItem) => {
        // Validate before selecting
        const { valid, reason } = validatePromotion(promotion, currentOrderTotal);
        if (!valid) {
            showError(reason || 'Mã giảm giá không hợp lệ');
            return;
        }

        if (promotion.type === PromotionType.Order) {
            setSelectedOrderPromotion(promotion);
        } else if (promotion.type === PromotionType.Shipping) {
            setSelectedShippingPromotion(promotion);
        }
        setShowVoucherList(false);
    }

    const handleRemoveVoucher = (type?: PromotionType) => {
        if (!type) {
            // Remove all
            setSelectedOrderPromotion(null);
            setSelectedShippingPromotion(null);
            return;
        }
        if (type === PromotionType.Order) {
            setSelectedOrderPromotion(null);
        } else if (type === PromotionType.Shipping) {
            setSelectedShippingPromotion(null);
        }
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
            <PrimaryHeader
                title="Đặt hàng"
                onBackPress={handleBackPress}
            />
            <ScrollView style={styles.scrollContent}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.mainContent}>

                    <CheckoutRecipientInfo
                        navigation={navigation}
                        selectedAddressId={selectedAddressId}
                        orderNote={orderNote}
                        onNoteChange={setOrderNote}
                    />

                    {cartItems.length > 0 ? (
                        cartItems.map(item => (
                            <CartConfirm
                                key={item.id}
                                id={item.id}
                                name={item.name}
                                price={item.price}
                                originalPrice={item.originalPrice}
                                image={item.image}
                                quantity={item.quantity}
                                supplier={item.supplier}
                                variant={item.variant}
                                totalPrice={item.totalPrice}
                            />
                        ))
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Không có sản phẩm</Text>
                        </View>
                    )}

                    <PriceInfo
                        subtotal={currentOrderTotal}
                        shippingFee={shippingFee}
                        discount={voucherDiscount}
                        total={currentOrderTotal + shippingFee - voucherDiscount}
                        onVoucherPress={handleVoucherPress}
                        onRemoveVoucher={handleRemoveVoucher}
                        selectedOrderPromotion={selectedOrderPromotion}
                        selectedShippingPromotion={selectedShippingPromotion}
                        showVoucherList={showVoucherList}
                        availablePromotions={availablePromotions}
                        onSelectVoucher={handleSelectVoucher}
                        currentOrderTotal={currentOrderTotal}
                        shipFeeOnly={shipFeeOnly}
                        onPaymentMethodChange={setPaymentMethod}
                    />


                </View>
                <View style={styles.applyButtonContainer}>
                    <ButtonAction
                        title="Xác nhận"
                        onPress={handleConfirmPress}
                        backgroundColor={Colors.primary}
                        color={Colors.textWhite}
                    />
                </View>
            </ScrollView>
            <LoadingOverlay visible={isFeeCalculating || isOrderCreating || isPaymentCreating || isDeletingCartItem} />
        </KeyboardAvoidingView>
    )
}


export default ConfirmCheckoutScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.textWhite,
    },
    scrollContent: {
        flexGrow: 1,
    },
    mainContent: {
        flex: 1,
        padding: 16,
    },
    applyButtonContainer: {
        padding: 16,
        alignItems: 'center',
        marginBottom: ifTablet(20, 30),
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: ifTablet(60, 40),
    },
    emptyText: {
        fontSize: ifTablet(16, 14),
        color: '#9ca3af',
        fontFamily: 'Sora-Regular',
    }
})