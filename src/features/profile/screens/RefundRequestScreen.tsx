import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader'
import { Colors } from '../../../assets/styles/colorStyles'
import { ifTablet } from '../../../utils/responsives/responsive'
import { ProfileStackNavigationProp } from '../../../types/navigation/navigation'
import { useRefundsQuery } from '../../refund/hooks/useRefund.hook'
import { RefundItems } from '../../refund/types/refund.type'
import { RefundStatus } from '../../refund/enums/refund.enum'

const RefundRequestScreen = () => {
    const navigation = useNavigation<ProfileStackNavigationProp>()

    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
        isRefetching
    } = useRefundsQuery({})

    const allRefunds = data?.pages.flatMap(page => page.items) || []
    const totalCount = data?.pages[0]?.total || 0

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

    const getStatusBackgroundColor = (status: RefundStatus) => {
        switch (status) {
            case RefundStatus.Pending:
                return '#fef3c7'
            case RefundStatus.Approved:
                return '#d1fae5'
            case RefundStatus.Rejected:
                return '#fee2e2'
            case RefundStatus.Refunded:
                return '#cffafe'
            default:
                return Colors.grayLight
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
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

    const handleLoadMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }

    const renderRefundItem = ({ item }: { item: RefundItems }) => (
        <TouchableOpacity
            style={styles.refundCard}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('RefundRequestDetailScreen', { refundRequestId: item.id })}
        >
            {/* Header */}
            <View style={styles.cardHeader}>
                <View style={styles.headerLeft}>
                    <Text style={styles.refundId}>#{item.id.substring(0, 8).toUpperCase()}</Text>
                    <Text style={styles.refundDate}>{formatDate(item.createdAt)}</Text>
                </View>
                <View style={[
                    styles.statusBadge,
                    {
                        backgroundColor: getStatusBackgroundColor(item.status as RefundStatus),
                        borderColor: getStatusColor(item.status as RefundStatus)
                    }
                ]}>
                    <Text style={[styles.statusText, { color: getStatusColor(item.status as RefundStatus) }]}>
                        {getStatusLabel(item.status as RefundStatus)}
                    </Text>
                </View>
            </View>

            {/* Amount */}
            <View style={styles.amountContainer}>
                <Text style={styles.amountLabel}>Số tiền hoàn</Text>
                <Text style={styles.amountValue}>{formatCurrency(item.amount)}</Text>
            </View>

            {/* Reason */}
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Lý do:</Text>
                <Text style={styles.infoValue} numberOfLines={2}>{item.reason}</Text>
            </View>

            {/* Bank Info */}
            <View style={styles.bankInfo}>
                <Text style={styles.bankLabel}>Tài khoản nhận</Text>
                <View style={styles.bankDetails}>
                    <Text style={styles.bankName}>{item.bankName}</Text>
                    <Text style={styles.bankNumber}>{item.bankNumber}</Text>
                </View>
            </View>

            {/* Admin Note */}
            {item.adminNote && (
                <View style={styles.adminNoteContainer}>
                    <Text style={styles.adminNoteLabel}>Ghi chú từ admin:</Text>
                    <Text style={styles.adminNoteText}>{item.adminNote}</Text>
                </View>
            )}
        </TouchableOpacity>
    )

    const renderEmpty = () => {
        if (isLoading) return null

        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>💰</Text>
                <Text style={styles.emptyText}>Chưa có yêu cầu hoàn tiền | trả hàng </Text>
                <Text style={styles.emptySubtext}>
                    Các yêu cầu hoàn tiền của bạn sẽ hiển thị ở đây
                </Text>
            </View>
        )
    }

    const renderFooter = () => {
        if (!isFetchingNextPage) return null

        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={Colors.primary} />
            </View>
        )
    }

    if (isLoading) {
        return (
            <View style={styles.container}>
                <PrimaryHeader title="Yêu Cầu Hoàn Tiền & Trả Hàng" onBackPress={() => navigation.goBack()} />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <PrimaryHeader
                title="Yêu Cầu Hoàn Tiền & Trả Hàng"
                onBackPress={() => navigation.goBack()}
            />

            {totalCount > 0 && (
                <View style={styles.countContainer}>
                    <Text style={styles.countText}>Tổng: {totalCount} yêu cầu</Text>
                </View>
            )}

            <FlatList
                data={allRefunds}
                renderItem={renderRefundItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={renderEmpty}
                ListFooterComponent={renderFooter}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={refetch}
                        tintColor={Colors.primary}
                        colors={[Colors.primary]}
                    />
                }
            />
        </View>
    )
}

export default RefundRequestScreen

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
    countContainer: {
        backgroundColor: Colors.textWhite,
        paddingHorizontal: ifTablet(16, 12),
        paddingVertical: ifTablet(12, 10),
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    countText: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-Medium',
        color: Colors.textGray,
    },
    listContent: {
        padding: ifTablet(16, 12),
        flexGrow: 1,
    },
    refundCard: {
        backgroundColor: Colors.textWhite,
        borderRadius: ifTablet(16, 12),
        padding: ifTablet(16, 14),
        marginBottom: ifTablet(12, 10),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: ifTablet(16, 12),
        paddingBottom: ifTablet(12, 10),
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerLeft: {
        flex: 1,
    },
    refundId: {
        fontSize: ifTablet(16, 15),
        fontFamily: 'Sora-Bold',
        color: Colors.textDark,
        marginBottom: ifTablet(4, 3),
    },
    refundDate: {
        fontSize: ifTablet(12, 11),
        fontFamily: 'Sora-Regular',
        color: Colors.textGray,
    },
    statusBadge: {
        paddingHorizontal: ifTablet(12, 10),
        paddingVertical: ifTablet(6, 5),
        borderRadius: ifTablet(16, 14),
        borderWidth: 1,
    },
    statusText: {
        fontSize: ifTablet(12, 11),
        fontFamily: 'Sora-SemiBold',
    },
    amountContainer: {
        backgroundColor: '#f8f9fa',
        padding: ifTablet(12, 10),
        borderRadius: ifTablet(10, 8),
        marginBottom: ifTablet(12, 10),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    amountLabel: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-Medium',
        color: Colors.textGray,
    },
    amountValue: {
        fontSize: ifTablet(18, 16),
        fontFamily: 'Sora-Bold',
        color: Colors.primary,
    },
    infoRow: {
        marginBottom: ifTablet(12, 10),
    },
    infoLabel: {
        fontSize: ifTablet(12, 11),
        fontFamily: 'Sora-Regular',
        color: Colors.textGray,
        marginBottom: ifTablet(4, 3),
    },
    infoValue: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-Medium',
        color: Colors.textDark,
        lineHeight: ifTablet(20, 18),
    },
    bankInfo: {
        backgroundColor: '#e8f4f8',
        padding: ifTablet(12, 10),
        borderRadius: ifTablet(10, 8),
        marginBottom: ifTablet(12, 10),
    },
    bankLabel: {
        fontSize: ifTablet(12, 11),
        fontFamily: 'Sora-Regular',
        color: '#0891b2',
        marginBottom: ifTablet(6, 5),
    },
    bankDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bankName: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
        flex: 1,
    },
    bankNumber: {
        fontSize: ifTablet(13, 12),
        fontFamily: 'Sora-Medium',
        color: Colors.textGray,
    },
    adminNoteContainer: {
        backgroundColor: '#fff7ed',
        padding: ifTablet(12, 10),
        borderRadius: ifTablet(10, 8),
        borderLeftWidth: 3,
        borderLeftColor: '#f59e0b',
    },
    adminNoteLabel: {
        fontSize: ifTablet(12, 11),
        fontFamily: 'Sora-SemiBold',
        color: '#f59e0b',
        marginBottom: ifTablet(4, 3),
    },
    adminNoteText: {
        fontSize: ifTablet(13, 12),
        fontFamily: 'Sora-Regular',
        color: Colors.textDark,
        lineHeight: ifTablet(18, 16),
    },
    footerLoader: {
        paddingVertical: ifTablet(20, 16),
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: ifTablet(80, 60),
    },
    emptyIcon: {
        fontSize: ifTablet(60, 50),
        marginBottom: ifTablet(16, 12),
    },
    emptyText: {
        fontSize: ifTablet(18, 16),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
        marginBottom: ifTablet(8, 6),
    },
    emptySubtext: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-Regular',
        color: Colors.textGray,
        textAlign: 'center',
        paddingHorizontal: ifTablet(40, 30),
    },
})