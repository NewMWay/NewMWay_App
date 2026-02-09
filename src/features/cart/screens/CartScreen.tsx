import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, KeyboardAvoidingView } from 'react-native'
import React, { useState, useEffect, useMemo, useRef } from 'react'
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader'
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { CartStackNavigationProp } from '../../../types/navigation/navigation';
import { ifTablet } from '../../../utils/responsives/responsive';
import { Colors } from '../../../assets/styles/colorStyles';
import PriceVoucher from '../components/PriceVoucher';
import CartItem from '../components/CartItem';
import { useClearCart, useDeleteCartItem, useGetCart, useUpdateCartItem } from '../hooks/useCart.hook';
import { useToast } from '../../../utils/toasts/useToast';
import VariantSelectionModal from '../components/VariantSelectionModal';
import { CartItem as CartItemType } from '../types/cart.type';

const CartScreen = () => {
  const navigation = useNavigation<CartStackNavigationProp>();
  const isFocused = useIsFocused();
  const isMountedRef = useRef(true);
  const { data: cartData, isLoading: isCartLoading, isError: isGetCartError } = useGetCart({ enabled: isFocused });
  const { mutate: clearCart, isPending: isClearPending, isError: isClearError } = useClearCart();
  const { mutate: updateCartItem, isPending: isUpdatePending, isError: isUpdateError } = useUpdateCartItem();
  const { mutate: deleteCartItem, isPending: isDeletingCartItem, isError: isDeleteError } = useDeleteCartItem();

  const checkboxIcon = require('../../../assets/icons/icons8-checkbox-48.png')
  const checkboxCheckedIcon = require('../../../assets/icons/icons8-checked-checkbox-48.png')
  const { showError } = useToast();

  if (isGetCartError) {
    showError('Lấy thông tin giỏ hàng thất bại. Vui lòng thử lại sau.');
  }

  if (isClearError) {
    showError('Xóa giỏ hàng thất bại. Vui lòng thử lại sau.');
  }

  if (isUpdateError) {
    showError('Cập nhật giỏ hàng thất bại. Vui lòng thử lại sau.');
  }

  if (isDeleteError) {
    showError('Xóa sản phẩm khỏi giỏ hàng thất bại. Vui lòng thử lại.');
  }


  // Transform API data to UI format
  const transformedCartItems = useMemo(() => {
    if (!cartData?.cartItems) return [];

    return cartData.cartItems.map(item => {
      // Find selected variant and option
      const selectedVariant = item.variants.find(v =>
        v.productOptionValueStocks.some(opt => opt.isSelected)
      );

      if (!selectedVariant) return null;

      // Build variant text from selected options
      let variantText = selectedVariant.productVariantName;

      // If has options with optionValueId, add selected option names
      const selectedOptions = selectedVariant.productOptionValueStocks
        .filter(opt => opt.isSelected && opt.optionValueId)
        .map(opt => `${opt.optionName}: ${opt.optionValueName}`)
        .join(', ');

      if (selectedOptions) {
        variantText = `${selectedVariant.productVariantName} - ${selectedOptions}`;
      }

      // Get selected option for productVariantOptionValueStockId
      const selectedOption = selectedVariant.productOptionValueStocks.find(opt => opt.isSelected);

      return {
        id: item.id,
        name: item.productName,
        price: selectedVariant.unitPrice,
        originalPrice: selectedVariant.oldPrice,
        image: selectedVariant.productImageUrl,
        quantity: item.quantity,
        isSelected: false,
        supplier: item.supplierName,
        variant: variantText,
        // Additional fields for order creation (same as updateCartItem)
        productVariantId: selectedVariant.productVariantId,
        productVariantOptionValueStockId: selectedOption?.productVariantOptionValueStockId || '',
        productVariantName: selectedVariant.productVariantName,
        optionValueId: selectedOption?.optionValueId || null,
        optionValueName: selectedOption?.optionValueName || null,
        optionId: selectedOption?.optionId || null,
        optionName: selectedOption?.optionName || null,
      };
    }).filter(item => item !== null);
  }, [cartData]);

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [variantModalVisible, setVariantModalVisible] = useState(false);
  const [selectedCartItem, setSelectedCartItem] = useState<CartItemType | null>(null);

  useEffect(() => {
    setCartItems(transformedCartItems);
  }, [transformedCartItems]);

  const [isAllSelected, setIsAllSelected] = useState(false);
  const selectedItems = cartItems.filter(item => item.isSelected);
  const totalPrice = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const selectedCount = selectedItems.length;

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isMountedRef.current) return;
    setIsAllSelected(cartItems.length > 0 && cartItems.every(item => item.isSelected));
  }, [cartItems]);

  const handleItemSelect = (id: string) => {
    if (!isMountedRef.current || !isFocused) return;
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, isSelected: !item.isSelected } : item
      )
    );
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    if (!isMountedRef.current || !isFocused) return;
    const cartItem = cartData?.cartItems.find(item => item.id === id);
    if (!cartItem) return;

    const selectedVariant = cartItem.variants.find(v =>
      v.productOptionValueStocks.some(opt => opt.isSelected)
    );
    if (!selectedVariant) return;

    const selectedOption = selectedVariant.productOptionValueStocks.find(opt => opt.isSelected);
    if (!selectedOption) return;


    updateCartItem({
      id: cartItem.id,
      quantity,
      productVariantId: selectedVariant.productVariantId,
      productVariantOptionValueStockId: selectedOption.productVariantOptionValueStockId,
      productVariantName: selectedVariant.productVariantName,
      unitPrice: selectedVariant.unitPrice,
      optionValueId: selectedOption.optionValueId,
      optionValueName: selectedOption.optionValueName,
      optionId: selectedOption.optionId,
      optionName: selectedOption.optionName,
    });
  };

  const handleVariantPress = (itemId: string) => {
    if (!isMountedRef.current || !isFocused) return;

    const cartItem = cartData?.cartItems.find(item => item.id === itemId);
    if (cartItem) {
      setSelectedCartItem(cartItem);
      setVariantModalVisible(true);
    }
  };

  const handleVariantConfirm = (selectedVariantId: string, selectedOptionStockId: string) => {
    if (!isMountedRef.current || !isFocused) return;
    if (!selectedCartItem) return;

    const selectedVariant = selectedCartItem.variants.find(v => v.productVariantId === selectedVariantId);
    if (!selectedVariant) return;

    const selectedOption = selectedVariant.productOptionValueStocks.find(
      opt => opt.productVariantOptionValueStockId === selectedOptionStockId
    );
    if (!selectedOption) return;

    updateCartItem({
      id: selectedCartItem.id,
      quantity: selectedCartItem.quantity,
      productVariantId: selectedVariant.productVariantId,
      productVariantOptionValueStockId: selectedOption.productVariantOptionValueStockId,
      productVariantName: selectedVariant.productVariantName,
      unitPrice: selectedVariant.unitPrice,
      optionValueId: selectedOption.optionValueId,
      optionValueName: selectedOption.optionValueName,
      optionId: selectedOption.optionId,
      optionName: selectedOption.optionName,
    });
  };

  const handleSelectAll = () => {
    if (!isMountedRef.current || !isFocused) return;
    const newSelectState = !isAllSelected;
    setCartItems(items =>
      items.map(item => ({ ...item, isSelected: newSelectState }))
    );
  };

  const handleOrderPress = () => {
    if (!isMountedRef.current || !isFocused) return;
    const selectedCartItems = cartItems.filter(item => item.isSelected);

    if (selectedCartItems.length === 0) {
      showError('Vui lòng chọn ít nhất một sản phẩm để đặt hàng');
      return;
    }

    navigation.navigate('ConfirmCheckoutScreen', {
      selectedItems: selectedCartItems
    });
  }

  const handleDeleteSingleItem = (itemId: string) => {
    if (!isMountedRef.current || !isFocused) return;
    deleteCartItem({ id: itemId });
  };

  const removeSelectedItems = () => {
    if (!isMountedRef.current || !isFocused) return;
    const selectedCartItems = cartItems.filter(item => item.isSelected);

    if (selectedCartItems.length === 0) {
      showError('Vui lòng chọn sản phẩm cần xóa');
      return;
    }

    const isAllItemsSelected = selectedCartItems.length === cartItems.length;
    const confirmMessage = isAllItemsSelected
      ? 'Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?'
      : `Bạn có chắc chắn muốn xóa ${selectedCartItems.length} sản phẩm đã chọn?`;

    const confirmButtonText = isAllItemsSelected ? 'Xóa tất cả' : 'Xóa';

    Alert.alert(
      'Xác nhận xóa',
      confirmMessage,
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: confirmButtonText,
          style: 'destructive',
          onPress: () => {
            if (isAllItemsSelected) {
              clearCart();
            } else {
              // Delete each selected item
              selectedCartItems.forEach(item => {
                deleteCartItem({ id: item.id });
              });
            }
          },
        },
      ]
    );
  };

  const handleGoBack = () => {
    // navigation.pop();
    navigation.goBack();
  };

  const deleteButtonText = selectedCount === cartItems.length && cartItems.length > 0
    ? 'Xóa tất cả'
    : selectedCount > 0
      ? `Xóa (${selectedCount})`
      : '';

  return (
    <KeyboardAvoidingView
      behavior='padding'
      style={styles.container}>
      <PrimaryHeader
        title="Giỏ Hàng"
        onBackPress={handleGoBack}
        deleteButton={selectedCount > 0}
        deleteButtonText={deleteButtonText}
        onDeleteButtonPress={removeSelectedItems}
      />
      {isCartLoading && !cartData ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Đang tải giỏ hàng...</Text>
        </View>
      ) : (
        <>
          <ScrollView
            contentContainerStyle={[styles.scrollView, { paddingBottom: ifTablet(120, 105) }]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.contentContainer}>
              {/* Cart Items */}
              {cartItems.length > 0 ? (
                cartItems.map(item => (
                  <CartItem
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    price={item.price}
                    originalPrice={item.originalPrice}
                    image={item.image}
                    quantity={item.quantity}
                    isSelected={item.isSelected}
                    supplier={item.supplier}
                    variant={item.variant}
                    onSelect={handleItemSelect}
                    onQuantityChange={handleQuantityChange}
                    onVariantPress={handleVariantPress}
                    onDelete={handleDeleteSingleItem}
                    maxQuantity={10}
                  />
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Giỏ hàng trống</Text>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Bottom Action Container */}
          <View style={styles.bottomContainer}>
            <PriceVoucher
              subtotalAmount={cartData?.subtotalAmount || 0}
              finalTotalAmount={cartData?.finalTotalAmount || 0}
              totalPrice={totalPrice}
              selectedItemsCount={selectedCount}
            />

            <View style={styles.buttonContainer}>
              {/* Info */}
              <TouchableOpacity style={styles.checkAllContainer} onPress={handleSelectAll}>
                {/* Icon tất cả */}
                <Image
                  source={isAllSelected ? checkboxCheckedIcon : checkboxIcon}
                  style={[
                    styles.checkAllIcon,
                    isAllSelected && styles.checkAllIconSelected
                  ]}
                />
                <Text style={styles.checkAllText}>Tất cả</Text>

                {/* Số lượng */}
                <Text style={styles.countAllText}> ({cartItems.length} sản phẩm)</Text>
              </TouchableOpacity>

              {/* Order Button */}
              <TouchableOpacity
                style={[styles.orderButton, (isClearPending || isUpdatePending || isDeletingCartItem) && styles.orderButtonDisabled]}
                onPress={handleOrderPress}
                disabled={isClearPending || isUpdatePending || isDeletingCartItem}
              >
                {(isClearPending || isUpdatePending || isDeletingCartItem) ? (
                  <ActivityIndicator size="small" color={Colors.textWhite} />
                ) : (
                  <Text style={styles.orderButtonText}>Đặt hàng</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}

      {/* Variant Selection Modal */}
      <VariantSelectionModal
        visible={variantModalVisible}
        onClose={() => setVariantModalVisible(false)}
        cartItem={selectedCartItem}
        onConfirm={handleVariantConfirm}
      />
    </KeyboardAvoidingView>
  )
}

export default CartScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
  contentContainer: {
    marginHorizontal: ifTablet(32, 8),
    paddingVertical: ifTablet(24, 8),
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingTop: ifTablet(16, 12),
    paddingHorizontal: ifTablet(16, 12),
    paddingBottom: ifTablet(20, 16),
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: ifTablet(16, 12),
    paddingHorizontal: ifTablet(8, 4),
  },
  orderButton: {
    backgroundColor: Colors.primary,
    width: '35%',
    paddingHorizontal: ifTablet(16, 12),
    paddingVertical: ifTablet(16, 12),
    borderRadius: ifTablet(12, 8),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  orderButtonText: {
    color: 'white',
    fontSize: ifTablet(18, 16),
    fontWeight: '600',
  },
  checkAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkAllIcon: {
    width: ifTablet(24, 20),
    height: ifTablet(24, 20),
    tintColor: Colors.primary,
  },
  checkAllText: {
    fontSize: ifTablet(16, 14),
    color: Colors.textDark,
    marginLeft: ifTablet(8, 6),
  },
  countAllText: {
    fontSize: ifTablet(16, 12),
    color: '#6b7280',
    fontWeight: '400',
    fontFamily: 'Sora-Regular',
    marginLeft: ifTablet(12, 2),
  },
  checkAllIconSelected: {
    tintColor: Colors.primary,
    backgroundColor: 'transparent'
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: ifTablet(120, 100),
  },
  loadingText: {
    fontSize: ifTablet(16, 14),
    fontFamily: 'Sora-Regular',
    color: Colors.textGray,
    marginTop: ifTablet(16, 12),
  },
  orderButtonDisabled: {
    opacity: 0.6,
  },
})