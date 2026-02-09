import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import { Colors } from '../../../assets/styles/colorStyles'
import { ifTablet } from '../../../utils/responsives/responsive'
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { ProfileStackNavigationProp, ProfileStackParamList } from '../../../types/navigation/navigation'
import { useUserBankingQuery } from '../../refund/hooks/useBanking.hook'

const UserBankingScreen = () => {
    const navigation = useNavigation<ProfileStackNavigationProp>()
    const route = useRoute<RouteProp<ProfileStackParamList, 'UserBankingScreen'>>()
    const { data: bankingData, isLoading, error } = useUserBankingQuery()

    const fromCancelOrder = route.params?.fromCancelOrder

    const handleGoBack = () => {
        navigation.goBack()
    }

    const handleAddBanking = () => {
        navigation.navigate('AddUserBankingScreen')
    }

    const handleEditBanking = (id: string) => {
        navigation.navigate('EditUserBankingScreen', { id })
    }

    const handleSelectBanking = (id: string) => {
        if (fromCancelOrder) {
            navigation.setParams({ selectedBankingId: id } as any);
            navigation.goBack();
        }
    }

    // Get first banking account or null
    const firstBanking = bankingData && bankingData.length > 0 ? bankingData[0] : null

    if (isLoading) {
        return (
            <View style={styles.container}>
                <PrimaryHeader
                    title="Thông tin ngân hàng"
                    onBackPress={handleGoBack}
                />
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            </View>
        )
    }

    if (error) {
        return (
            <View style={styles.container}>
                <PrimaryHeader
                    title="Thông tin ngân hàng"
                    onBackPress={handleGoBack}
                />
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>Không thể tải thông tin ngân hàng</Text>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <PrimaryHeader
                title="Thông tin ngân hàng"
                onBackPress={handleGoBack}
            />

            <ScrollView
                contentContainerStyle={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                {firstBanking ? (
                    <View style={styles.contentContainer}>
                        {fromCancelOrder && (
                            <Text style={styles.selectPrompt}>Chọn tài khoản để nhận hoàn tiền</Text>
                        )}
                        {bankingData?.map((banking) => (
                            <TouchableOpacity
                                key={banking.id}
                                style={styles.bankingCard}
                                onPress={() => fromCancelOrder && handleSelectBanking(banking.id)}
                                activeOpacity={fromCancelOrder ? 0.7 : 1}
                            >
                                <View style={styles.bankingHeader}>
                                    <Text style={styles.bankingTitle}>Thông tin tài khoản</Text>
                                    {!fromCancelOrder && (
                                        <TouchableOpacity
                                            style={styles.editButton}
                                            onPress={() => handleEditBanking(banking.id)}
                                        >
                                            <Text style={styles.editButtonText}>Sửa</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>

                                <View style={styles.bankingInfo}>
                                    <View style={styles.infoRow}>
                                        <Text style={styles.infoLabel}>Ngân hàng:</Text>
                                        <Text style={styles.infoValue}>{banking.bankName}</Text>
                                    </View>
                                    <View style={styles.divider} />
                                    <View style={styles.infoRow}>
                                        <Text style={styles.infoLabel}>Số tài khoản:</Text>
                                        <Text style={styles.infoValue}>{banking.bankNumber}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyIcon}>🏦</Text>
                        <Text style={styles.emptyTitle}>Chưa có thông tin ngân hàng</Text>
                        <Text style={styles.emptyDescription}>
                            Thêm thông tin tài khoản ngân hàng để nhận hoàn tiền khi cần thiết
                        </Text>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={handleAddBanking}
                        >
                            <Text style={styles.addButtonText}>Thêm ngân hàng</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>

            {firstBanking && (
                <View style={styles.bottomContainer}>
                    <TouchableOpacity
                        style={styles.bottomButton}
                        onPress={handleAddBanking}
                    >
                        <Text style={styles.bottomButtonText}>Thêm tài khoản mới</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
}

export default UserBankingScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.grayLight,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flexGrow: 1,
        paddingVertical: ifTablet(24, 20),
    },
    contentContainer: {
        paddingHorizontal: ifTablet(20, 16),
        gap: ifTablet(16, 12),
    },
    bankingCard: {
        backgroundColor: Colors.textWhite,
        borderRadius: ifTablet(16, 12),
        padding: ifTablet(20, 16),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    bankingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: ifTablet(20, 16),
    },
    bankingTitle: {
        fontSize: ifTablet(18, 16),
        fontFamily: 'Sora-Bold',
        color: Colors.textDark,
    },
    editButton: {
        paddingHorizontal: ifTablet(16, 12),
        paddingVertical: ifTablet(8, 6),
        backgroundColor: Colors.primary,
        borderRadius: ifTablet(8, 6),
    },
    editButtonText: {
        fontSize: ifTablet(14, 12),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textWhite,
    },
    bankingInfo: {
        gap: ifTablet(16, 12),
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: ifTablet(14, 12),
        fontFamily: 'Sora-Regular',
        color: Colors.textGray,
    },
    infoValue: {
        fontSize: ifTablet(14, 12),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
        textAlign: 'right',
        flex: 1,
        marginLeft: ifTablet(12, 10),
    },
    divider: {
        height: 1,
        backgroundColor: Colors.grayLight,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: ifTablet(40, 32),
        paddingVertical: ifTablet(60, 48),
    },
    emptyIcon: {
        fontSize: ifTablet(80, 64),
        marginBottom: ifTablet(20, 16),
    },
    emptyTitle: {
        fontSize: ifTablet(20, 18),
        fontFamily: 'Sora-Bold',
        color: Colors.textDark,
        textAlign: 'center',
        marginBottom: ifTablet(12, 10),
    },
    emptyDescription: {
        fontSize: ifTablet(14, 12),
        fontFamily: 'Sora-Regular',
        color: Colors.textGray,
        textAlign: 'center',
        lineHeight: ifTablet(22, 20),
        marginBottom: ifTablet(32, 24),
    },
    addButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: ifTablet(32, 24),
        paddingVertical: ifTablet(14, 12),
        borderRadius: ifTablet(12, 10),
    },
    addButtonText: {
        fontSize: ifTablet(16, 14),
        fontFamily: 'Sora-Bold',
        color: Colors.textWhite,
    },
    errorText: {
        fontSize: ifTablet(16, 14),
        fontFamily: 'Sora-Regular',
        color: Colors.error,
        textAlign: 'center',
    },
    selectPrompt: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-SemiBold',
        color: Colors.primary,
        marginBottom: ifTablet(16, 12),
        textAlign: 'center',
    },
    bottomContainer: {
        paddingHorizontal: ifTablet(20, 16),
        paddingVertical: ifTablet(16, 12),
        backgroundColor: Colors.textWhite,
        borderTopWidth: 1,
        borderTopColor: Colors.grayLight,
        paddingBottom: ifTablet(24, 30),

    },
    bottomButton: {
        backgroundColor: Colors.primary,
        paddingVertical: ifTablet(14, 12),
        borderRadius: ifTablet(12, 10),
        alignItems: 'center',
    },
    bottomButtonText: {
        fontSize: ifTablet(16, 14),
        fontFamily: 'Sora-Bold',
        color: Colors.textWhite,
    },
})