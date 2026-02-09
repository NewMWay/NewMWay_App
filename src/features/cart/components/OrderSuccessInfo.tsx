import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from '../../../assets/styles/colorStyles'
import { ifTablet } from '../../../utils/responsives/responsive'
import { OrderStatus } from '../../order/types/order.enum'

interface OrderItem {
    id: string
    quantity: number
    unitPrice: number
    productVariantOptionValueStockId: string
    optionName: string | null
    optionValue: string | null
    productVariantName: string
    imageUrl: string
    sku: string
    productVariantDescription: string
}

interface OrderSuccessInfoProps {
    id: string
    totalPrice: number
    fullName: string
    phoneNumber: string
    province: string
    district: string
    ward: string
    address: string
    status: OrderStatus
    createdDate: string
    items: OrderItem[]
}

const OrderSuccessInfo = ({
    id,
    totalPrice,
    fullName,
    phoneNumber,
    province,
    district,
    ward,
    address,
    status,
    createdDate,
    items
}: OrderSuccessInfoProps) => {

    const formatPrice = (price: number) => {
        if (price === undefined || price === null || isNaN(price)) {
            return '0đ'
        }
        return price.toLocaleString('vi-VN') + 'đ'
    }

    const formatDate = (date: string) => {
        const d = new Date(date)
        return d.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getStatusText = (statusValue: OrderStatus) => {
        const statusMap: { [key in OrderStatus]: string } = {
            ['Pending' as OrderStatus.Pending]: 'Chờ xử lý',
            ['Confirmed' as OrderStatus.Confirmed]: 'Đang giao',
            ['Delivered' as OrderStatus.Delivered]: 'Đã giao',
            ['Cancelled' as OrderStatus.Cancelled]: 'Đã hủy',
            ['Completed' as OrderStatus.Completed]: 'Hoàn thành'
        }
        return statusMap[statusValue] || statusValue
    }

    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Thông Tin Đơn Hàng</Text>

                <View style={styles.infoRow}>
                    <Text style={styles.label}>Mã đơn hàng:</Text>
                    <Text style={styles.value} numberOfLines={1}>#{id.slice(0, 8).toUpperCase()}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.label}>Trạng thái:</Text>
                    <Text style={[styles.value, styles.statusText]}>{getStatusText(status)}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.label}>Ngày đặt:</Text>
                    <Text style={styles.value}>{formatDate(createdDate)}</Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Thông Tin Người Nhận</Text>

                <View style={styles.infoRow}>
                    <Text style={styles.label}>Họ tên:</Text>
                    <Text style={styles.value}>{fullName}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.label}>Số điện thoại:</Text>
                    <Text style={styles.value}>{phoneNumber}</Text>
                </View>

                <View style={styles.infoColumn}>
                    <Text style={styles.label}>Địa chỉ:</Text>
                    <Text style={styles.valueMultiline}>
                        {address}, {ward}, {district}, {province}
                    </Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Sản Phẩm</Text>

                {items.map((item) => (
                    <View key={item.id} style={styles.productItem}>
                        <Image
                            source={{ uri: item.imageUrl }}
                            style={styles.productImage}
                        />
                        <View style={styles.productInfo}>
                            <Text style={styles.productName} numberOfLines={2}>
                                {item.productVariantName}
                            </Text>
                            {item.optionValue && (
                                <Text style={styles.productVariant}>
                                    {item.optionName}: {item.optionValue}
                                </Text>
                            )}
                            <Text style={styles.productSku}>SKU: {item.sku}</Text>
                            <View style={styles.productPriceRow}>
                                <Text style={styles.productPrice}>
                                    {formatPrice(item.unitPrice)} x {item.quantity}
                                </Text>
                                <Text style={styles.productTotal}>
                                    {formatPrice(item.unitPrice * item.quantity)}
                                </Text>
                            </View>
                        </View>
                    </View>
                ))}
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Tổng Cộng:</Text>
                    <Text style={styles.totalPrice}>{formatPrice(totalPrice)}</Text>
                </View>
            </View>
        </View>
    )
}

export default OrderSuccessInfo

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.textWhite,
        borderRadius: ifTablet(16, 12),
        padding: ifTablet(20, 16),
        marginTop: ifTablet(16, 12),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    section: {
        marginBottom: ifTablet(16, 12),
    },
    sectionTitle: {
        fontSize: ifTablet(20, 16),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
        marginBottom: ifTablet(16, 12),
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: ifTablet(12, 8),
    },
    infoColumn: {
        marginBottom: ifTablet(12, 8),
    },
    label: {
        fontSize: ifTablet(16, 14),
        fontFamily: 'Sora-Regular',
        color: Colors.grayDark,
        flex: 1,
    },
    value: {
        fontSize: ifTablet(16, 14),
        fontFamily: 'Sora-Medium',
        color: Colors.textDark,
        flex: 1.5,
        textAlign: 'right',
    },
    valueMultiline: {
        fontSize: ifTablet(16, 14),
        fontFamily: 'Sora-Medium',
        color: Colors.textDark,
        marginTop: ifTablet(8, 4),
        lineHeight: ifTablet(24, 20),
    },
    statusText: {
        color: Colors.primary,
        fontFamily: 'Sora-SemiBold',
    },
    divider: {
        height: 1,
        backgroundColor: Colors.gray,
        marginVertical: ifTablet(16, 12),
        opacity: 0.3,
    },
    productItem: {
        flexDirection: 'row',
        marginBottom: ifTablet(16, 12),
        padding: ifTablet(12, 8),
        borderRadius: ifTablet(12, 8),
    },
    productImage: {
        width: ifTablet(100, 80),
        height: ifTablet(100, 80),
        borderRadius: ifTablet(8, 6),
        backgroundColor: Colors.gray,
    },
    productInfo: {
        flex: 1,
        marginLeft: ifTablet(16, 12),
        justifyContent: 'space-between',
    },
    productName: {
        fontSize: ifTablet(16, 14),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
        marginBottom: ifTablet(6, 4),
    },
    productVariant: {
        fontSize: ifTablet(14, 12),
        fontFamily: 'Sora-Regular',
        color: Colors.grayDark,
        marginBottom: ifTablet(4, 2),
    },
    productSku: {
        fontSize: ifTablet(13, 11),
        fontFamily: 'Sora-Regular',
        color: Colors.grayDark,
        marginBottom: ifTablet(8, 6),
    },
    productPriceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    productPrice: {
        fontSize: ifTablet(14, 12),
        fontFamily: 'Sora-Regular',
        color: Colors.grayDark,
    },
    productTotal: {
        fontSize: ifTablet(16, 14),
        fontFamily: 'Sora-SemiBold',
        color: Colors.primary,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: ifTablet(16, 12),
        borderTopWidth: 2,
        borderTopColor: Colors.primary,
        borderStyle: 'dashed',
    },
    totalLabel: {
        fontSize: ifTablet(20, 16),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
    },
    totalPrice: {
        fontSize: ifTablet(24, 18),
        fontFamily: 'Sora-Bold',
        color: Colors.primary,
    },
})
