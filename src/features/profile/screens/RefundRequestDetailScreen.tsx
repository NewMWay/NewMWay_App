import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { ProfileStackParamList } from '../../../types/navigation/navigation'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { RefundStatus } from '../../refund/enums/refund.enum'
import { useRefundDetailQuery } from '../../refund/hooks/useRefund.hook'
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader'
import { Colors } from '../../../assets/styles/colorStyles'
import { ifTablet } from '../../../utils/responsives/responsive'
import { ProfileStackNavigationProp } from '../../../types/navigation/navigation'
import ImageZoomView from '../../../components/common/ModalView/ImageZoomView'


const RefundRequestDetailScreen = () => {
    const navigation = useNavigation<ProfileStackNavigationProp>()
    const route = useRoute<RouteProp<ProfileStackParamList, 'RefundRequestDetailScreen'>>()
    const { refundRequestId } = route.params

    const { data: refundDetail, isLoading } = useRefundDetailQuery({ id: refundRequestId })

    const [selectedImageUri, setSelectedImageUri] = useState<string>('')

    const handleBackPress = () => {
        navigation.goBack()
    }

    const handleImagePress = (imageUrl: string) => {
        setSelectedImageUri(imageUrl)
    }

    const handleCloseImage = () => {
        setSelectedImageUri('')
    }

    const getStatusColor = (status: RefundStatus) => {
        switch (status) {
            case RefundStatus.Pending:
                return '#f59e0b'
            case RefundStatus.Approved:
                return '#10b981'
            case RefundStatus.Rejected:
                return '#ef4444'
            case RefundStatus.Refunded:
                return '#0891b2'
            default:
                return Colors.textGray
        }
    }

    const getStatusLabel = (status: RefundStatus) => {
        switch (status) {
            case RefundStatus.Pending:
                return 'Đang chờ'
            case RefundStatus.Approved:
                return 'Đã duyệt'
            case RefundStatus.Rejected:
                return 'Đã từ chối'
            case RefundStatus.Refunded:
                return 'Đã hoàn tiền'
            default:
                return status
        }
    }

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A'
        const date = new Date(dateString)
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount)
    }

    if (isLoading) {
        return (
            <View style={styles.container}>
                <PrimaryHeader
                    title="Chi Tiết Yêu Cầu Hoàn Tiền"
                    onBackPress={handleBackPress}
                />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            </View>
        )
    }

    if (!refundDetail) {
        return (
            <View style={styles.container}>
                <PrimaryHeader
                    title="Chi Tiết Yêu Cầu Hoàn Tiền"
                    onBackPress={handleBackPress}
                />
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Không tìm thấy thông tin yêu cầu hoàn tiền</Text>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <PrimaryHeader
                title="Chi Tiết Yêu Cầu Hoàn Tiền"
                onBackPress={handleBackPress}
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Status Badge */}
                <View style={styles.statusContainer}>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(refundDetail.status) + '20' }]}>
                        <Text style={[styles.statusText, { color: getStatusColor(refundDetail.status) }]}>
                            {getStatusLabel(refundDetail.status)}
                        </Text>
                    </View>
                </View>

                {/* Amount Card */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Số tiền hoàn</Text>
                    <Text style={styles.amountText}>{formatCurrency(refundDetail.amount)}</Text>
                </View>

                {/* Reason Card */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Lý do hoàn tiền</Text>
                    <Text style={styles.contentText}>{refundDetail.reason}</Text>
                </View>

                {/* Banking Info Card */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Thông tin tài khoản nhận</Text>
                    <View style={styles.bankingInfo}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Ngân hàng:</Text>
                            <Text style={styles.infoValue}>{refundDetail.bankName}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Số tài khoản:</Text>
                            <Text style={styles.infoValue}>{refundDetail.bankNumber}</Text>
                        </View>
                    </View>
                </View>

                {/* Admin Note Card (if exists) */}
                {refundDetail.adminNote && (
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Ghi chú từ quản trị viên</Text>
                        <View style={styles.adminNoteContainer}>
                            <Text style={styles.adminNoteText}>{refundDetail.adminNote}</Text>
                        </View>
                    </View>
                )}

                {/* Images Gallery (if exists) */}
                {refundDetail.refundImage && refundDetail.refundImage.length > 0 && (
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Hình ảnh minh chứng</Text>
                        <View style={styles.imagesGrid}>
                            {refundDetail.refundImage.map((img) => (
                                <TouchableOpacity
                                    key={img.id}
                                    style={styles.imageItem}
                                    onPress={() => handleImagePress(img.imageUrl)}
                                    activeOpacity={0.7}
                                >
                                    <Image
                                        source={{ uri: img.imageUrl }}
                                        style={styles.image}
                                        resizeMode="cover"
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {/* Dates Card */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Thông tin thời gian</Text>
                    <View style={styles.datesInfo}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Ngày tạo:</Text>
                            <Text style={styles.infoValue}>{formatDate(refundDetail.createdAt)}</Text>
                        </View>
                        {refundDetail.lastModifiedDate && (
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Cập nhật lần cuối:</Text>
                                <Text style={styles.infoValue}>{formatDate(refundDetail.lastModifiedDate)}</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Request ID Card */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Mã yêu cầu</Text>
                    <Text style={styles.idText}>{refundDetail.id}</Text>
                </View>
            </ScrollView>

            {/* Image Zoom Viewer */}
            <ImageZoomView
                imageUri={selectedImageUri}
                type="image"
                onClose={handleCloseImage}
            />
        </View>
    )
}

export default RefundRequestDetailScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: ifTablet(20, 16),
    },
    emptyText: {
        fontSize: ifTablet(16, 15),
        fontFamily: 'Sora-Regular',
        color: Colors.textGray,
        textAlign: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: ifTablet(16, 12),
        paddingBottom: ifTablet(70, 50),
    },
    statusContainer: {
        alignItems: 'center',
        marginBottom: ifTablet(20, 16),
    },
    statusBadge: {
        paddingHorizontal: ifTablet(20, 16),
        paddingVertical: ifTablet(10, 8),
        borderRadius: ifTablet(20, 16),
    },
    statusText: {
        fontSize: ifTablet(16, 15),
        fontFamily: 'Sora-Bold',
    },
    card: {
        backgroundColor: Colors.textWhite,
        borderRadius: ifTablet(12, 10),
        padding: ifTablet(16, 14),
        marginBottom: ifTablet(16, 12),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: ifTablet(15, 14),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
        marginBottom: ifTablet(12, 10),
    },
    amountText: {
        fontSize: ifTablet(24, 22),
        fontFamily: 'Sora-Bold',
        color: Colors.primary,
    },
    contentText: {
        fontSize: ifTablet(15, 14),
        fontFamily: 'Sora-Regular',
        color: Colors.primaryDark,
        lineHeight: ifTablet(22, 20),
    },
    bankingInfo: {
        gap: ifTablet(10, 8),
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-Regular',
        color: Colors.textGray,
        flex: 1,
    },
    infoValue: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-SemiBold',
        color: Colors.primaryDark,
        flex: 2,
        textAlign: 'right',
    },
    adminNoteContainer: {
        backgroundColor: '#fef3c7',
        borderRadius: ifTablet(10, 8),
        padding: ifTablet(14, 12),
        borderLeftWidth: 4,
        borderLeftColor: '#f59e0b',
    },
    adminNoteText: {
        fontSize: ifTablet(15, 14),
        fontFamily: 'Sora-Regular',
        color: '#92400e',
        lineHeight: ifTablet(22, 20),
    },
    imagesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: ifTablet(12, 10),
    },
    imageItem: {
        width: ifTablet(100, 85),
        height: ifTablet(100, 85),
        borderRadius: ifTablet(10, 8),
        overflow: 'hidden',
        backgroundColor: Colors.grayLight,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    datesInfo: {
        gap: ifTablet(10, 8),
    },
    idText: {
        fontSize: ifTablet(13, 12),
        fontFamily: 'Sora-Regular',
        color: Colors.textGray,
    },
})

