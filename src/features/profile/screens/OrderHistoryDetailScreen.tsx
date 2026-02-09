import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { RouteProp, useNavigation, useRoute, useFocusEffect } from '@react-navigation/native'
import { ProfileStackNavigationProp, ProfileStackParamList } from '../../../types/navigation/navigation'
import { useOrderDetailQuery, useOrderDeliveriesQuery, useCancelOrder } from '../../order/hooks/useOrder.hook'
import { useUserBankingQuery } from '../../refund/hooks/useBanking.hook'
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader'
import CancelOrderModal from '../components/CancelOrderModal'
import { Colors } from '../../../assets/styles/colorStyles'
import { ifTablet } from '../../../utils/responsives/responsive'
import { OrderStatus, OrderType } from '../../order/types/order.enum'
import { OrderDeliveriesStatus } from '../../order/types/orderDeliveries.enum'
import { CancelOrderRequest } from '../../order/types/order.type'

const OrderHistoryDetailScreen = () => {
    const navigation = useNavigation<ProfileStackNavigationProp>();
    const route = useRoute<RouteProp<ProfileStackParamList, 'OrderHistoryDetailScreen'>>();
    const orderId = route.params.id;

    // Icons
    const arrowIcon = require('../../../assets/icons/icons8-forward-48.png');
    const downIcon = require('../../../assets/icons/icons8-down-48.png');

    const qrCode = require('../../../assets/icons/icons8-qr-code-48.png');
    const inTransitIcon = require('../../../assets/icons/icons8-in-transit-48.png');
    const trackingIcon = require('../../../assets/icons/icons8-tracking-48.png');
    const createDateIcon = require('../../../assets/icons/icons8-schedule-48.png');

    const { data: orderDetail, isLoading: isLoadingOrderDetail, isError: isErrorOrderDetail } = useOrderDetailQuery({ id: orderId });
    const { data: orderDeliveries, isLoading: isLoadingDeliveries, isError: isErrorDeliveries } = useOrderDeliveriesQuery({ id: orderId });

    const { mutate: cancelOrder, isPending } = useCancelOrder();
    const { data: bankingData } = useUserBankingQuery();

    // State để track status nào đang được mở
    const [expandedStatus, setExpandedStatus] = useState<string | null>(null);

    // Cancel order modal states
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [selectedBankingId, setSelectedBankingId] = useState<string | null>(null);
    const [showBankingDropdown, setShowBankingDropdown] = useState(false);

    // Track if we navigated to add banking from modal
    const shouldReopenModal = useRef(false);

    // Lấy thông tin trạng thái mới nhất (phần tử đầu tiên trong array)
    const latestDelivery = orderDeliveries && Array.isArray(orderDeliveries) && orderDeliveries.length > 0 ? orderDeliveries[0] : null;

    // Handle returned banking selection
    useEffect(() => {
        if (route.params?.selectedBankingId) {
            setSelectedBankingId(route.params.selectedBankingId);
        }
    }, [route.params?.selectedBankingId]);

    // Reopen modal after returning from add banking screen
    useFocusEffect(
        React.useCallback(() => {
            if (shouldReopenModal.current) {
                setShowCancelModal(true);
                setShowBankingDropdown(false);
                shouldReopenModal.current = false;
            }
        }, [])
    );

    const selectedBanking = bankingData?.find(b => b.id === selectedBankingId);

    // Tìm thông tin chi tiết cho một status cụ thể
    const getDeliveryDataForStatus = (status: string) => {
        if (!orderDeliveries || !Array.isArray(orderDeliveries)) return null;
        return orderDeliveries.find(delivery => delivery.status === status);
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    const handleReviewPress = () => {
        if (!orderDetail) return;
        navigation.navigate('CreateReviewScreen', { productVariantId: orderDetail.items[0].productVariantId });
    }

    const handleProductItemPress = () => {
        const parentNavigation = navigation.getParent();
        if (parentNavigation) {
            parentNavigation.navigate('Mua Sắm', { screen: 'ProductDetailScreen', params: { id: orderDetail?.items.map(item => item.productId) } });
        }
    }
    const getOrderDeliveryStatusColor = (status: string) => {
        switch (status) {
            case 'Created': return '#3b82f6'
            case 'Accepted': return '#10b981'
            case 'Picking': return '#f59e0b'
            case 'Delivering': return '#f59e0b'
            case 'Delivered': return '#10b981'
            case 'Settled': return '#10b981'
            case 'Returned': return '#ef4444'
            case 'Failed': return '#ef4444'
            case 'Cancelled': return '#ef4444'
            default: return '#6b7280'
        }
    }

    const getOrderDeliveryStatusLabel = (status: string) => {
        switch (status) {
            case 'Created': return OrderDeliveriesStatus.Created
            case 'Accepted': return OrderDeliveriesStatus.Accepted
            case 'Picking': return OrderDeliveriesStatus.Picking
            case 'Delivering': return OrderDeliveriesStatus.Delivering
            case 'Delivered': return OrderDeliveriesStatus.Delivered
            case 'Settled': return OrderDeliveriesStatus.Settled
            case 'Returned': return OrderDeliveriesStatus.Returned
            case 'Failed': return OrderDeliveriesStatus.Failed
            case 'Cancelled': return OrderDeliveriesStatus.Cancelled
            default: return status
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return Colors.warning
            case 'Confirmed': return Colors.info
            case 'Delivered': return Colors.success
            case 'Cancelled': return Colors.error
            case 'Completed': return Colors.primary
            default: return Colors.textGray
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'Pending': return OrderStatus.Pending
            case 'Confirmed': return OrderStatus.Confirmed
            case 'Delivered': return OrderStatus.Delivered
            case 'Cancelled': return OrderStatus.Cancelled
            case 'Completed': return OrderStatus.Completed
            default: return status
        }
    };

    const getOrderTypeLabel = (type: string) => {
        switch (type) {
            case 'Cod': return OrderType.Cod
            case 'Online': return OrderType.Online
            default: return type
        }
    };

    const getOrderTypeColor = (type: string) => {
        switch (type) {
            case 'Cod': return '#f59e0b'
            case 'Online': return '#10b981'
            default: return Colors.textGray
        }
    };

    const getOrderTypeBackgroundColor = (type: string) => {
        switch (type) {
            case 'Cod': return '#fef3c7'
            case 'Online': return '#d1fae5'
            default: return Colors.gray + '20'
        }
    };

    const formatCurrency = (amount: number) => {
        if (amount === undefined || amount === null || isNaN(amount)) {
            return '0 ₫';
        }
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear()
        return `${hours}:${minutes} - ${day}/${month}/${year}`
    };

    if (isLoadingOrderDetail || isLoadingDeliveries) {
        return (
            <View style={styles.container}>
                <PrimaryHeader title="Chi Tiết Đơn Hàng" onBackPress={handleBackPress} />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            </View>
        );
    }

    if (isErrorOrderDetail || isErrorDeliveries || !orderDetail) {
        return (
            <View style={styles.container}>
                <PrimaryHeader title="Chi Tiết Đơn Hàng" onBackPress={handleBackPress} />
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Không tìm thấy thông tin đơn hàng</Text>
                </View>
            </View>
        );
    }

    const handleRefundPress = () => {
        // Xử lý yêu cầu hoàn tiền & trả hàng
        navigation.navigate('CreateRefundRequestScreen', { orderId: orderDetail.id });
    }

    const handleCancelOrderPress = () => {
        if (!orderDetail) return
        setShowCancelModal(true)
    }

    const handleToggleBankingDropdown = () => {
        setShowBankingDropdown(!showBankingDropdown);
    }

    const handleSelectBankingItem = (id: string) => {
        setSelectedBankingId(id);
        setShowBankingDropdown(false);
    }

    const handleAddNewBanking = () => {
        shouldReopenModal.current = true;
        setShowCancelModal(false);
        navigation.navigate('AddUserBankingScreen');
    }

    const handleSubmitCancel = () => {
        if (!cancelReason.trim()) {
            Alert.alert('Thông báo', 'Vui lòng nhập lý do hủy đơn');
            return;
        }

        setShowCancelModal(false);

        // Show final confirmation
        Alert.alert(
            'Xác nhận hủy đơn',
            'Bạn có chắc chắn muốn hủy đơn hàng này?',
            [
                {
                    text: 'Không',
                    style: 'cancel',
                    onPress: () => {
                        // Show modal again if user cancels
                        setShowCancelModal(true);
                    }
                },
                {
                    text: 'Xác nhận',
                    style: 'destructive',
                    onPress: () => {
                        const cancelData: CancelOrderRequest = {
                            id: orderDetail.id,
                            reason: cancelReason,
                        };

                        if (selectedBankingId) {
                            cancelData.userBankingId = selectedBankingId;
                        }

                        cancelOrder(cancelData, {
                            onSuccess: () => {
                                setCancelReason('');
                                setSelectedBankingId(null);
                                navigation.goBack();
                            }
                        });
                    }
                }
            ]
        );
    }


    return (
        <View style={styles.container}>
            <PrimaryHeader
                title="Chi Tiết Đơn Hàng"
                onBackPress={handleBackPress}
                moreButton
                modalTitle="Tùy chọn"
                modalButtons={[
                    // { text: 'Hỗ trợ đơn hàng', onPress: () => { } },
                    { text: 'Yêu cầu hoàn tiền & trả hàng', onPress: handleRefundPress },
                    { text: 'Hủy đơn hàng', onPress: handleCancelOrderPress }
                ]}

            />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Order Header Card */}
                <View style={styles.headerCard}>
                    <View style={styles.headerTop}>
                        <View style={styles.headerLeft}>
                            <Text style={styles.orderIdLabel}>Mã đơn hàng</Text>
                            <Text style={styles.orderId}>#{orderDetail.id.substring(0, 8).toUpperCase()}</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(orderDetail.status) + '20', borderColor: getStatusColor(orderDetail.status) }]}>
                            <Text style={[styles.statusText, { color: getStatusColor(orderDetail.status) }]}>
                                {getStatusLabel(orderDetail.status)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.headerInfo}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoItemLabel}>Loại thanh toán</Text>
                            <View style={[styles.typeBadge, { backgroundColor: getOrderTypeBackgroundColor(orderDetail.type) }]}>
                                <Text style={[styles.typeText, { color: getOrderTypeColor(orderDetail.type) }]}>
                                    {getOrderTypeLabel(orderDetail.type)}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoItemLabel}>Thời gian đặt</Text>
                            <Text style={styles.infoItemValue}>{formatDate(orderDetail.createdDate)}</Text>
                        </View>
                    </View>

                    {/* Nút đánh giá sản phẩm */}
                    {/* {
                        orderDetail.status === OrderStatus.Completed && (
                            <TouchableOpacity style={styles.reviewButton} onPress={handleReviewPress} activeOpacity={0.7}>
                                <Text style={styles.reviewButtonText}>Đánh giá sản phẩm</Text>
                            </TouchableOpacity>
                        )
                    } */}
                    <TouchableOpacity style={styles.reviewButton} onPress={handleReviewPress} activeOpacity={0.7}>
                        <Text style={styles.reviewButtonText}>Đánh giá sản phẩm</Text>
                    </TouchableOpacity>
                </View>

                {/* Recipient Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Thông Tin Người Nhận</Text>
                    <View style={styles.cardContent}>
                        <View style={styles.recipientRow}>
                            <View style={styles.recipientItem}>
                                <Text style={styles.recipientLabel}>Họ và tên</Text>
                                <Text style={styles.recipientValue}>{orderDetail.fullName}</Text>
                            </View>
                            <View style={styles.recipientItem}>
                                <Text style={styles.recipientLabel}>Số điện thoại</Text>
                                <Text style={styles.recipientValue}>{orderDetail.phoneNumber}</Text>
                            </View>
                        </View>
                        <View style={styles.addressContainer}>
                            <Text style={styles.recipientLabel}>Địa chỉ giao hàng</Text>
                            <Text style={styles.addressText}>
                                {orderDetail.address}, {orderDetail.ward}, {orderDetail.district}, {orderDetail.province}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Order Delivery Card */}
                {latestDelivery && (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Thông Tin Vận Chuyển</Text>
                        <View style={styles.cardContent}>
                            {/* Delivery Info - Hiển thị thông tin trạng thái mới nhất */}
                            <View style={styles.deliveryInfoContainer}>
                                <View style={styles.deliveryInfoHeader}>
                                    <Text style={styles.deliveryInfoTitle}>Trạng thái mới nhất</Text>
                                    <View style={[styles.deliveryStatusBadge, { backgroundColor: getOrderDeliveryStatusColor(latestDelivery.status) + '20' }]}>
                                        <Text style={[styles.deliveryStatusBadgeText, { color: getOrderDeliveryStatusColor(latestDelivery.status) }]}>
                                            {getOrderDeliveryStatusLabel(latestDelivery.status)}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.deliveryInfoItem}>
                                    <Text style={styles.deliveryInfoLabel}>Mã vận đơn</Text>
                                    <Text style={styles.deliveryInfoValue}>{latestDelivery.deliveryCode}</Text>
                                </View>
                                <View style={styles.deliveryInfoItem}>
                                    <Text style={styles.deliveryInfoLabel}>Đơn vị vận chuyển</Text>
                                    <Text style={styles.deliveryInfoValue}>{latestDelivery.shippingPartner}</Text>
                                </View>
                                <View style={styles.deliveryInfoItem}>
                                    <Text style={styles.deliveryInfoLabel}>Số theo dõi</Text>
                                    <Text style={styles.deliveryInfoValue}>{latestDelivery.trackingNumber}</Text>
                                </View>
                                <View style={styles.deliveryInfoItem}>
                                    <Text style={styles.deliveryInfoLabel}>Thời gian cập nhật</Text>
                                    <Text style={styles.deliveryInfoValue}>{formatDate(latestDelivery.createdDate)}</Text>
                                </View>
                            </View>

                            {/* Delivery Timeline */}
                            <View style={styles.timelineContainer}>
                                <Text style={styles.timelineTitle}>Lịch Sử Trạng Thái</Text>
                                <Text style={styles.timelineSubtitle}>Nhấn vào trạng thái để xem chi tiết</Text>

                                {/* Main 5 statuses */}
                                {['Created', 'Accepted', 'Picking', 'Delivering', 'Delivered'].map((status, index) => {
                                    const currentStatusIndex = ['Created', 'Accepted', 'Picking', 'Delivering', 'Delivered'].indexOf(latestDelivery.status);
                                    const isPassed = index <= currentStatusIndex;
                                    const isCurrentLatest = latestDelivery.status === status;
                                    const isExpanded = expandedStatus === status;
                                    const statusData = getDeliveryDataForStatus(status);
                                    const hasData = !!statusData;

                                    // Màu sắc cho status - chỉ dùng primary
                                    const statusColor = isPassed ? Colors.primary : '#9ca3af';

                                    return (
                                        <View key={status} style={styles.timelineItem}>
                                            <View style={styles.timelineLeft}>
                                                <View style={[
                                                    styles.timelineDot,
                                                    isPassed && styles.timelineDotActive,
                                                    isCurrentLatest && styles.timelineDotCurrent
                                                ]}>
                                                    {isPassed && (
                                                        <View style={styles.timelineDotInner} />
                                                    )}
                                                </View>
                                                {index < 4 && (
                                                    <View style={[
                                                        styles.timelineLine,
                                                        isPassed && index < currentStatusIndex && styles.timelineLineActive
                                                    ]} />
                                                )}
                                            </View>
                                            <TouchableOpacity
                                                style={styles.timelineRight}
                                                onPress={() => setExpandedStatus(isExpanded ? null : status)}
                                                activeOpacity={0.7}
                                            >
                                                <View style={styles.timelineStatusRow}>
                                                    <Text style={[
                                                        styles.timelineStatus,
                                                        { color: statusColor },
                                                        isCurrentLatest && styles.timelineStatusCurrent
                                                    ]}>
                                                        {getOrderDeliveryStatusLabel(status)}
                                                    </Text>
                                                    {hasData && (
                                                        <Image
                                                            source={isExpanded ? downIcon : arrowIcon}
                                                            style={[
                                                                styles.timelineExpandIcon,
                                                                { tintColor: statusColor }
                                                            ]}
                                                        />
                                                    )}
                                                </View>
                                                {isExpanded && (
                                                    hasData ? (
                                                        <View style={[
                                                            styles.timelineDetails,
                                                            isCurrentLatest && styles.timelineDetailsCurrent
                                                        ]}>
                                                            <View style={styles.timelineDetailRow}>
                                                                <Image source={qrCode} style={styles.timelineDetailIcon} />
                                                                <Text style={styles.timelineDetailText}>
                                                                    {statusData.deliveryCode}
                                                                </Text>
                                                            </View>
                                                            <View style={styles.timelineDetailRow}>
                                                                <Image source={inTransitIcon} style={styles.timelineDetailIcon} />
                                                                <Text style={styles.timelineDetailText}>
                                                                    {statusData.shippingPartner}
                                                                </Text>
                                                            </View>
                                                            <View style={styles.timelineDetailRow}>
                                                                <Image source={trackingIcon} style={styles.timelineDetailIcon} />
                                                                <Text style={styles.timelineDetailText}>
                                                                    {statusData.trackingNumber}
                                                                </Text>
                                                            </View>
                                                            <View style={styles.timelineDetailRow}>
                                                                <Image source={createDateIcon} style={styles.timelineDetailIcon} />
                                                                <Text style={styles.timelineDetailText}>
                                                                    {formatDate(statusData.createdDate)}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    ) : (
                                                        <View style={styles.timelineDetailsEmpty}>
                                                            <Text style={styles.timelineDetailEmptyText}>
                                                                Chưa có thông tin chi tiết
                                                            </Text>
                                                        </View>
                                                    )
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                    );
                                })}

                                {/* Special statuses (only show if they are the current status) */}
                                {['Settled', 'Returned', 'Failed', 'Cancelled'].includes(latestDelivery.status) && (
                                    <View style={styles.timelineItem}>
                                        <View style={styles.timelineLeft}>
                                            <View style={[
                                                styles.timelineDot,
                                                styles.timelineDotSpecial,
                                                { borderColor: getOrderDeliveryStatusColor(latestDelivery.status) }
                                            ]}>
                                                <View style={[
                                                    styles.timelineDotInner,
                                                    { backgroundColor: getOrderDeliveryStatusColor(latestDelivery.status) }
                                                ]} />
                                            </View>
                                        </View>
                                        <TouchableOpacity
                                            style={styles.timelineRight}
                                            onPress={() => setExpandedStatus(expandedStatus === latestDelivery.status ? null : latestDelivery.status)}
                                            activeOpacity={0.7}
                                        >
                                            <View style={styles.timelineStatusRow}>
                                                <Text style={[
                                                    styles.timelineStatus,
                                                    styles.timelineStatusCurrent,
                                                    { color: getOrderDeliveryStatusColor(latestDelivery.status) }
                                                ]}>
                                                    {getOrderDeliveryStatusLabel(latestDelivery.status)}
                                                </Text>
                                                <Image
                                                    source={expandedStatus === latestDelivery.status ? downIcon : arrowIcon}
                                                    style={[
                                                        styles.timelineExpandIcon,
                                                        { tintColor: getOrderDeliveryStatusColor(latestDelivery.status) }
                                                    ]}
                                                />
                                            </View>
                                            {expandedStatus === latestDelivery.status && (
                                                <View style={styles.timelineDetails}>
                                                    <View style={styles.timelineDetailRow}>
                                                        <Image
                                                            source={qrCode}
                                                            style={styles.timelineDetailIcon}
                                                        />
                                                        <Text style={styles.timelineDetailText}>
                                                            {latestDelivery.deliveryCode}
                                                        </Text>
                                                    </View>
                                                    <View style={styles.timelineDetailRow}>
                                                        <Image
                                                            source={inTransitIcon}
                                                            style={styles.timelineDetailIcon}
                                                        />
                                                        <Text style={styles.timelineDetailText}>
                                                            {latestDelivery.shippingPartner}
                                                        </Text>
                                                    </View>
                                                    <View style={styles.timelineDetailRow}>
                                                        <Image
                                                            source={trackingIcon}
                                                            style={styles.timelineDetailIcon}
                                                        />
                                                        <Text style={styles.timelineDetailText}>
                                                            {latestDelivery.trackingNumber}
                                                        </Text>
                                                    </View>
                                                    <View style={styles.timelineDetailRow}>
                                                        <Image
                                                            source={createDateIcon}
                                                            style={styles.timelineDetailIcon}
                                                        />
                                                        <Text style={styles.timelineDetailText}>
                                                            {formatDate(latestDelivery.createdDate)}
                                                        </Text>
                                                    </View>
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>
                )}

                {/* Products Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Sản Phẩm ({orderDetail.items.length})</Text>
                    <View style={styles.cardContent}>
                        {orderDetail.items.map((item, index) => (
                            <View key={item.id}>
                                <TouchableOpacity style={styles.productItem} onPress={handleProductItemPress} activeOpacity={0.7}>
                                    <Image
                                        source={{ uri: item.imageUrl }}
                                        style={styles.productImage}
                                    />
                                    <View style={styles.productDetails}>
                                        <Text style={styles.productName} numberOfLines={2}>
                                            {item.productVariantName}
                                        </Text>
                                        {item.optionName && item.optionValue && (
                                            <View style={styles.optionBadge}>
                                                <Text style={styles.optionText}>
                                                    {item.optionName}: {item.optionValue}
                                                </Text>
                                            </View>
                                        )}
                                        <Text style={styles.productSku}>SKU: {item.sku}</Text>
                                        <View style={styles.productBottom}>
                                            <Text style={styles.productQuantity}>SL: {item.quantity}</Text>
                                            <Text style={styles.productPrice}>{formatCurrency(item.unitPrice)}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                {index < orderDetail.items.length - 1 && <View style={styles.productDivider} />}
                            </View>
                        ))}
                    </View>
                </View>

                {/* Price Summary Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Thông Tin Thanh Toán</Text>
                    <View style={styles.cardContent}>
                        <View style={styles.priceItem}>
                            <Text style={styles.priceLabel}>Tạm tính</Text>
                            <Text style={styles.priceValue}>{formatCurrency(orderDetail.totalOrderAmount)}</Text>
                        </View>

                        {orderDetail.totalOrderAmountDiscount > 0 && (
                            <View style={styles.priceItem}>
                                <Text style={styles.priceLabel}>Giảm giá đơn hàng</Text>
                                <Text style={styles.discountValue}>-{formatCurrency(orderDetail.totalOrderAmountDiscount)}</Text>
                            </View>
                        )}

                        <View style={styles.priceItem}>
                            <Text style={styles.priceLabel}>Phí vận chuyển</Text>
                            <Text style={styles.priceValue}>{formatCurrency(orderDetail.shippingAmount)}</Text>
                        </View>

                        {orderDetail.shippingAmountDiscount > 0 && (
                            <View style={styles.priceItem}>
                                <Text style={styles.priceLabel}>Giảm giá vận chuyển</Text>
                                <Text style={styles.discountValue}>-{formatCurrency(orderDetail.shippingAmountDiscount)}</Text>
                            </View>
                        )}

                        <View style={styles.totalDivider} />

                        <View style={styles.totalContainer}>
                            <Text style={styles.totalLabel}>Tổng thanh toán</Text>
                            <Text style={styles.totalValue}>{formatCurrency(orderDetail.totalAmount)}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <CancelOrderModal
                visible={showCancelModal}
                onClose={() => {
                    setShowCancelModal(false);
                    setCancelReason('');
                }}
                cancelReason={cancelReason}
                onChangeCancelReason={setCancelReason}
                bankingData={bankingData}
                selectedBankingId={selectedBankingId}
                selectedBanking={selectedBanking}
                showBankingDropdown={showBankingDropdown}
                onToggleDropdown={handleToggleBankingDropdown}
                onSelectBankingItem={handleSelectBankingItem}
                onAddNewBanking={handleAddNewBanking}
                onSubmit={handleSubmitCancel}
                isPending={isPending}
            />
        </View>
    )
}

export default OrderHistoryDetailScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: ifTablet(24, 20),
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: ifTablet(32, 24),
    },
    errorText: {
        fontSize: ifTablet(16, 14),
        fontFamily: 'Sora-Regular',
        color: Colors.error,
        textAlign: 'center',
    },

    // Header Card Styles
    headerCard: {
        backgroundColor: Colors.textWhite,
        marginHorizontal: ifTablet(16, 12),
        marginTop: ifTablet(16, 12),
        borderRadius: ifTablet(16, 12),
        padding: ifTablet(20, 16),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: ifTablet(20, 16),
    },
    headerLeft: {
        flex: 1,
    },
    orderIdLabel: {
        fontSize: ifTablet(13, 12),
        fontFamily: 'Sora-Regular',
        color: Colors.textGray,
        marginBottom: ifTablet(6, 4),
    },
    orderId: {
        fontSize: ifTablet(24, 20),
        fontFamily: 'Sora-Bold',
        color: Colors.textDark,
    },
    statusBadge: {
        paddingHorizontal: ifTablet(14, 12),
        paddingVertical: ifTablet(8, 6),
        borderRadius: ifTablet(20, 16),
        borderWidth: 1.5,
    },
    statusText: {
        fontSize: ifTablet(13, 12),
        // fontFamily: 'Sora-SemiBold',
        fontWeight: '600',
    },
    headerInfo: {
        flexDirection: 'row',
        gap: ifTablet(16, 12),
    },
    infoItem: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: ifTablet(12, 10),
        borderRadius: ifTablet(10, 8),
    },
    infoItemLabel: {
        fontSize: ifTablet(12, 11),
        fontFamily: 'Sora-Regular',
        color: Colors.textGray,
        marginBottom: ifTablet(6, 4),
    },
    infoItemValue: {
        fontSize: ifTablet(13, 12),
        fontFamily: 'Sora-Medium',
        color: Colors.textDark,
    },
    reviewButton: {
        marginTop: ifTablet(16, 12),
        paddingVertical: ifTablet(12, 10),
        backgroundColor: Colors.primary,
        borderRadius: ifTablet(10, 8),
        justifyContent: 'center',
        alignItems: 'center',
    },
    reviewButtonText: {
        fontSize: ifTablet(15, 14),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textWhite,
    },
    typeBadge: {
        paddingHorizontal: ifTablet(10, 8),
        paddingVertical: ifTablet(6, 5),
        borderRadius: ifTablet(8, 6),
        alignSelf: 'flex-start',
    },
    typeText: {
        fontSize: ifTablet(12, 11),
        // fontFamily: 'Sora-SemiBold',
        fontWeight: '600',
    },

    // Card Styles
    card: {
        backgroundColor: Colors.textWhite,
        marginHorizontal: ifTablet(16, 12),
        marginTop: ifTablet(16, 12),
        borderRadius: ifTablet(16, 12),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        overflow: 'hidden',
    },
    cardTitle: {
        fontSize: ifTablet(17, 16),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
        paddingHorizontal: ifTablet(20, 16),
        paddingTop: ifTablet(20, 16),
        paddingBottom: ifTablet(16, 12),
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    cardContent: {
        padding: ifTablet(20, 16),
    },

    // Recipient Styles
    recipientRow: {
        flexDirection: 'row',
        gap: ifTablet(16, 12),
        marginBottom: ifTablet(16, 12),
    },
    recipientItem: {
        flex: 1,
    },
    recipientLabel: {
        fontSize: ifTablet(13, 12),
        fontFamily: 'Sora-Regular',
        color: Colors.textGray,
        marginBottom: ifTablet(6, 4),
    },
    recipientValue: {
        fontSize: ifTablet(15, 14),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
    },
    addressContainer: {
        backgroundColor: '#f8f9fa',
        padding: ifTablet(14, 12),
        borderRadius: ifTablet(10, 8),
    },
    addressText: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-Medium',
        color: Colors.textDark,
        lineHeight: ifTablet(22, 20),
        marginTop: ifTablet(4, 3),
    },

    // Product Styles
    productItem: {
        flexDirection: 'row',
        gap: ifTablet(14, 12),
    },
    productImage: {
        width: ifTablet(100, 80),
        height: ifTablet(100, 80),
        borderRadius: ifTablet(12, 10),
        backgroundColor: '#f8f9fa',
    },
    productDetails: {
        flex: 1,
        justifyContent: 'space-between',
    },
    productName: {
        fontSize: ifTablet(15, 14),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
        lineHeight: ifTablet(22, 20),
        marginBottom: ifTablet(6, 4),
    },
    optionBadge: {
        backgroundColor: '#e8f4f8',
        paddingHorizontal: ifTablet(10, 8),
        paddingVertical: ifTablet(4, 3),
        borderRadius: ifTablet(6, 5),
        alignSelf: 'flex-start',
        marginBottom: ifTablet(6, 4),
    },
    optionText: {
        fontSize: ifTablet(12, 11),
        fontFamily: 'Sora-Medium',
        color: '#0891b2',
    },
    productSku: {
        fontSize: ifTablet(12, 11),
        fontFamily: 'Sora-Regular',
        color: Colors.textGray,
        marginBottom: ifTablet(8, 6),
    },
    productBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    productQuantity: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-Medium',
        color: Colors.textGray,
    },
    productPrice: {
        fontSize: ifTablet(16, 15),
        fontFamily: 'Sora-Bold',
        color: Colors.primary,
    },
    productDivider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginVertical: ifTablet(16, 12),
    },

    // Price Styles
    priceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: ifTablet(14, 12),
    },
    priceLabel: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-Regular',
        color: Colors.textGray,
    },
    priceValue: {
        fontSize: ifTablet(15, 14),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
    },
    discountValue: {
        fontSize: ifTablet(15, 14),
        fontFamily: 'Sora-Bold',
        color: '#ef4444',
    },
    totalDivider: {
        height: 2,
        backgroundColor: '#f0f0f0',
        marginVertical: ifTablet(16, 12),
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: ifTablet(16, 14),
        borderRadius: ifTablet(12, 10),
    },
    totalLabel: {
        fontSize: ifTablet(17, 16),
        fontFamily: 'Sora-Bold',
        color: Colors.textDark,
    },
    totalValue: {
        fontSize: ifTablet(22, 20),
        fontFamily: 'Sora-Bold',
        color: Colors.primary,
    },

    // Delivery Styles
    deliveryInfoContainer: {
        backgroundColor: '#f8f9fa',
        padding: ifTablet(16, 14),
        borderRadius: ifTablet(10, 8),
        marginBottom: ifTablet(20, 16),
        gap: ifTablet(10, 8),
    },
    deliveryInfoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: ifTablet(12, 10),
        paddingBottom: ifTablet(10, 8),
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    deliveryInfoTitle: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
    },
    deliveryStatusBadge: {
        paddingHorizontal: ifTablet(10, 8),
        paddingVertical: ifTablet(4, 3),
        borderRadius: ifTablet(6, 5),
    },
    deliveryStatusBadgeText: {
        fontSize: ifTablet(12, 11),
        // fontFamily: 'Sora-SemiBold',
        fontWeight: '600',
    },
    deliveryInfoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    deliveryInfoLabel: {
        fontSize: ifTablet(13, 12),
        fontFamily: 'Sora-Regular',
        color: Colors.textGray,
    },
    deliveryInfoValue: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
        textAlign: 'right',
        flex: 1,
        marginLeft: ifTablet(10, 8),
    },

    // Timeline Styles
    timelineContainer: {
        paddingTop: ifTablet(8, 6),
    },
    timelineTitle: {
        fontSize: ifTablet(15, 14),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
        marginBottom: ifTablet(4, 3),
    },
    timelineSubtitle: {
        fontSize: ifTablet(12, 11),
        fontFamily: 'Sora-Regular',
        color: Colors.textGray,
        marginBottom: ifTablet(16, 14),
        fontStyle: 'italic',
    },
    timelineStatusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    timelineExpandIcon: {
        width: ifTablet(18, 16),
        height: ifTablet(18, 16),
        marginLeft: ifTablet(8, 6),
        resizeMode: 'contain',
    },
    timelineItem: {
        flexDirection: 'row',
        minHeight: ifTablet(70, 60),
    },
    timelineLeft: {
        width: ifTablet(40, 35),
        alignItems: 'center',
        position: 'relative',
    },
    timelineDot: {
        width: ifTablet(24, 20),
        height: ifTablet(24, 20),
        borderRadius: ifTablet(12, 10),
        borderWidth: 2,
        borderColor: '#d1d5db',
        backgroundColor: Colors.textWhite,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    timelineDotActive: {
        borderColor: Colors.primary,
    },
    timelineDotCurrent: {
        borderColor: Colors.primary,
        borderWidth: 2,
    },
    timelineDotSpecial: {
        borderWidth: 2,
    },
    timelineDotInner: {
        width: ifTablet(10, 8),
        height: ifTablet(10, 8),
        borderRadius: ifTablet(5, 4),
        backgroundColor: Colors.primary,
    },
    timelineLine: {
        width: 2,
        flex: 1,
        backgroundColor: '#e5e7eb',
        position: 'absolute',
        top: ifTablet(24, 20),
        bottom: 0,
        zIndex: 1,
    },
    timelineLineActive: {
        backgroundColor: Colors.primary,
    },
    timelineRight: {
        flex: 1,
        paddingLeft: ifTablet(14, 12),
        paddingBottom: ifTablet(12, 10),
    },
    timelineStatus: {
        fontSize: ifTablet(15, 14),
        fontFamily: 'Sora-Medium',
        color: '#9ca3af',
        marginBottom: ifTablet(4, 3),
    },
    timelineStatusActive: {
        color: Colors.primary,
    },
    timelineStatusCurrent: {
        fontSize: ifTablet(16, 15),
        fontFamily: 'Sora-SemiBold',
        color: Colors.primary,
    },
    timelineDetails: {
        marginTop: ifTablet(8, 6),
        backgroundColor: '#f8f9fa',
        padding: ifTablet(12, 10),
        borderRadius: ifTablet(8, 6),
        borderLeftWidth: 2,
        borderLeftColor: '#6b7280',
        gap: ifTablet(6, 5),
    },
    timelineDetailsCurrent: {
        backgroundColor: '#f8f9fa',
        borderLeftColor: '#6b7280',
        borderLeftWidth: 2,
    },
    timelineDetailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ifTablet(10, 8),
    },
    timelineDetailIcon: {
        width: ifTablet(20, 18),
        height: ifTablet(20, 18),
        tintColor: Colors.textGray,
        resizeMode: 'contain',
    },
    timelineDetailText: {
        fontSize: ifTablet(13, 12),
        fontFamily: 'Sora-Regular',
        color: Colors.textDark,
        lineHeight: ifTablet(20, 18),
        flex: 1,

    },
    timelineDetailsEmpty: {
        marginTop: ifTablet(8, 6),
        backgroundColor: '#f8f9fa',
        padding: ifTablet(12, 10),
        borderRadius: ifTablet(8, 6),
        borderLeftWidth: 2,
        borderLeftColor: '#6b7280',
    },
    timelineDetailEmptyText: {
        fontSize: ifTablet(13, 12),
        fontFamily: 'Sora-Regular',
        color: Colors.textGray,
        fontStyle: 'italic',
        textAlign: 'center',
    },
})