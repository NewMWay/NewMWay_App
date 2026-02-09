import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Colors } from '../../../assets/styles/colorStyles'
import { ifTablet } from '../../../utils/responsives/responsive'
import { OrderStatus, OrderType } from '../../order/types/order.enum'
import { useNavigation } from '@react-navigation/native'
import { ProfileStackNavigationProp } from '../../../types/navigation/navigation'

interface OrdersTabProps {
    orders: any[]
    isLoading: boolean
    isFetchingNextPage: boolean
    totalCount: number
}

const OrdersTab = ({ orders, isLoading, isFetchingNextPage, totalCount }: OrdersTabProps) => {
    const navigation = useNavigation<ProfileStackNavigationProp>();

    if (isLoading && orders.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
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
    }

    const getStatusLabel = (status: string) => {
        // Return Vietnamese label from OrderStatus enum
        switch (status) {
            case 'Pending': return OrderStatus.Pending
            case 'Confirmed': return OrderStatus.Confirmed
            case 'Delivered': return OrderStatus.Delivered
            case 'Cancelled': return OrderStatus.Cancelled
            case 'Completed': return OrderStatus.Completed
            default: return status
        }
    }

    const getOrderTypeLabel = (type: string) => {
        switch (type) {
            case 'Cod': return OrderType.Cod
            case 'Online': return OrderType.Online
            default: return type
        }
    }

    const getOrderTypeColor = (type: string) => {
        switch (type) {
            case 'Cod': return '#f59e0b'
            case 'Online': return '#10b981'
            default: return Colors.textGray
        }
    }

    const getOrderTypeBackgroundColor = (type: string) => {
        switch (type) {
            case 'Cod': return '#fef3c7'
            case 'Online': return '#d1fae5'
            default: return Colors.gray + '20'
        }
    }

    const formatCurrency = (amount: any) => {
        const value = Number(amount);
        if (isNaN(value)) return '0 ₫';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear()
        return `${hours}:${minutes} - ${day}/${month}/${year}`
    }

    const formatAddress = (order: any) => {
        return [order.address, order.ward, order.district, order.province]
            .filter(Boolean)
            .join(', ')
    }

    if (orders.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Bạn chưa có đơn hàng nào.</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đơn Hàng Của Tôi ({totalCount})</Text>

            {orders.map((order) => (
                <TouchableOpacity
                    key={order.id}
                    style={styles.orderCard}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('OrderHistoryDetailScreen', { id: order.id })}
                >
                    <View style={styles.orderHeader}>
                        <View style={styles.orderHeaderLeft}>
                            <Text style={styles.orderId}>#{order.id.substring(0, 8).toUpperCase()}</Text>
                            <View style={[styles.typeBadge, { backgroundColor: getOrderTypeBackgroundColor(order.type) }]}>
                                <Text style={[styles.typeText, { color: getOrderTypeColor(order.type) }]}>
                                    {getOrderTypeLabel(order.type)}
                                </Text>
                            </View>
                        </View>
                        <Text style={[styles.status, { color: getStatusColor(order.status) }]}>
                            {getStatusLabel(order.status)}
                        </Text>
                    </View>

                    <View style={styles.orderContent}>
                        <Image
                            source={require('../../../assets/images/logo/LOGO-NEW-WAY-TEAK-WOOD-02.png')}
                            style={styles.productImage}
                            resizeMode="contain"
                        />
                        <View style={styles.productInfo}>
                            <View>
                                <Text style={styles.productName} numberOfLines={1}>
                                    Đơn hàng ngày {formatDate(order.createdDate).split(' - ')[1]}
                                </Text>
                                <Text style={styles.timeText}>
                                    Đặt lúc: {formatDate(order.createdDate)}
                                </Text>
                            </View>
                            <Text style={styles.price}>{formatCurrency(order.totalAmount)}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.orderFooter}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Người nhận:</Text>
                            <Text style={styles.infoValue}>
                                {order.fullName} - {order.phoneNumber}
                            </Text>
                        </View>

                        <View style={[styles.infoRow]}>
                            <Text style={styles.infoLabel}>Giao đến:</Text>
                            <Text style={styles.infoValue} numberOfLines={2}>
                                {formatAddress(order)}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}

            {isFetchingNextPage && (
                <View style={styles.footerLoader}>
                    <ActivityIndicator size="small" color={Colors.primary} />
                    <Text style={styles.footerText}>Đang tải thêm...</Text>
                </View>
            )}
        </View>
    )
}

export default OrdersTab

const styles = StyleSheet.create({
    container: {
        padding: ifTablet(24, 16),

    },
    loadingContainer: {
        padding: ifTablet(40, 32),
        alignItems: 'center',
    },
    emptyContainer: {
        padding: ifTablet(40, 32),
        alignItems: 'center',
    },
    emptyText: {
        fontFamily: 'Sora-Regular',
        color: Colors.textGray,
        fontSize: ifTablet(16, 14),
    },
    title: {
        fontSize: ifTablet(20, 18),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
        marginBottom: ifTablet(20, 16),
    },
    orderCard: {
        backgroundColor: Colors.textWhite,
        borderRadius: ifTablet(12, 10),
        padding: ifTablet(16, 14),
        marginBottom: ifTablet(16, 12),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 3,
        borderWidth: 1,
        borderColor: Colors.gray + '10',
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: ifTablet(12, 10),
        paddingBottom: ifTablet(12, 10),
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray + '20',
    },
    orderHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ifTablet(8, 6),
    },
    orderId: {
        fontSize: ifTablet(16, 14),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
    },
    typeBadge: {
        paddingHorizontal: ifTablet(8, 6),
        paddingVertical: ifTablet(3, 2),
        borderRadius: ifTablet(4, 3),
    },
    typeText: {
        fontSize: ifTablet(10, 9),
        fontFamily: 'Sora-Bold',
        fontWeight: '700',
    },
    status: {
        fontSize: ifTablet(14, 12),
        fontFamily: 'Sora-Medium',
    },
    orderContent: {
        flexDirection: 'row',
        gap: ifTablet(12, 10),
        marginBottom: ifTablet(12, 10),
    },
    productImage: {
        width: ifTablet(70, 60),
        height: ifTablet(70, 60),
        borderRadius: ifTablet(8, 6),
        backgroundColor: Colors.gray + '10',
    },
    productInfo: {
        flex: 1,
        justifyContent: 'space-between',
    },
    productName: {
        fontSize: ifTablet(15, 14),
        fontFamily: 'Sora-Medium',
        color: Colors.textDark,
    },
    timeText: {
        fontSize: ifTablet(13, 12),
        fontFamily: 'Sora-Regular',
        color: Colors.textGray,
        marginTop: 2,
    },
    price: {
        fontSize: ifTablet(16, 14),
        fontFamily: 'Sora-SemiBold',
        color: Colors.primary,
        alignSelf: 'flex-end',
    },
    divider: {
        height: 1,
        backgroundColor: Colors.gray + '20',
        marginBottom: ifTablet(12, 10),
    },
    orderFooter: {
        // Phần thông tin thêm
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 6,
        marginTop: 4,
    },
    infoLabel: {
        fontSize: ifTablet(13, 12),
        fontFamily: 'Sora-Medium',
        color: Colors.textGray,
        width: ifTablet(90, 80),
    },
    infoValue: {
        flex: 1,
        fontSize: ifTablet(13, 12),
        fontFamily: 'Sora-Regular',
        color: Colors.textDark,
        lineHeight: ifTablet(20, 18),
    },
    footerLoader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        gap: 8,
    },
    footerText: {
        fontSize: 12,
        color: Colors.textGray,
        fontFamily: 'Sora-Regular',
    }
})
