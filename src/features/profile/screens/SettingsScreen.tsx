import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Platform, Alert, Linking, Share } from 'react-native'
import React from 'react'
import { ifTablet } from '../../../utils/responsives/responsive'
import { useNavigation } from '@react-navigation/native'
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader'
import { Colors } from '../../../assets/styles/colorStyles'
import { useAuthStore } from '../../../stores/authStore.zustand'
import { ProfileStackNavigationProp } from '../../../types/navigation/navigation'
import { useToast } from '../../../utils/toasts/useToast'
import { useDeleteUserDeviceToken } from '../../shop/hooks/useUserDeviceToken.hook'
import { getFcmToken } from '../../../utils/fcmHelper'
import { useQueryClient } from '@tanstack/react-query'
import { signOutFromGoogle } from '../../../utils/auth/googleAuthHelper'

const SettingsScreen = () => {
    const navigation = useNavigation<ProfileStackNavigationProp>()
    const { logout } = useAuthStore()
    const userProfile = useAuthStore((state) => state.userProfile)
    const { showSuccess } = useToast()
    const { mutate: deleteDeviceToken } = useDeleteUserDeviceToken()
    const queryClient = useQueryClient()

    const arrowIcon = require('../../../assets/icons/icons8-forward-48.png')
    const logoutIcon = require('../../../assets/icons/icons8-forward-48.png')

    const handleLogout = async () => {
        Alert.alert(
            'Đăng xuất',
            'Bạn có chắc chắn muốn đăng xuất?',
            [
                {
                    text: 'Hủy',
                    style: 'cancel',
                },
                {
                    text: 'Đăng xuất',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            // Clear React Query cache
                            queryClient.clear();
                            
                            // Sign out from Google (if logged in with Google)
                            try {
                                await signOutFromGoogle();
                            } catch (error) {
                                console.log('Google sign out error (may not be signed in with Google):', error);
                            }
                            
                            // Delete FCM token
                            const fcmToken = await getFcmToken();
                            if (fcmToken) {
                                deleteDeviceToken(
                                    {
                                        deviceToken: fcmToken,
                                        deviceType: Platform.OS,
                                    },
                                    {
                                        onSuccess: () => {
                                            logout()
                                            showSuccess('Đăng xuất thành công')
                                        },
                                        onError: () => {
                                            logout()
                                            showSuccess('Đăng xuất thành công')
                                        }
                                    }
                                );
                            } else {
                                logout()
                                showSuccess('Đăng xuất thành công')
                            }
                        } catch {
                            logout()
                            showSuccess('Đăng xuất thành công')
                        }
                    }
                }
            ]
        )
    }

    const handleDeleteAccount = () => {
        Alert.alert(
            'Xóa tài khoản',
            'Bạn có chắc chắn muốn xóa tài khoản vĩnh viễn? Hành động này không thể hoàn tác.',
            [
                {
                    text: 'Hủy',
                    style: 'cancel',
                },
                {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: async () => {
                        // Tạm thời dùng logout logic, sẽ xử lý sau
                        try {
                            // Clear React Query cache
                            queryClient.clear();
                            
                            // Sign out from Google (if logged in with Google)
                            try {
                                await signOutFromGoogle();
                            } catch (error) {
                                console.log('Google sign out error:', error);
                            }
                            
                            const fcmToken = await getFcmToken();
                            if (fcmToken) {
                                deleteDeviceToken(
                                    {
                                        deviceToken: fcmToken,
                                        deviceType: Platform.OS,
                                    },
                                    {
                                        onSuccess: () => {
                                            logout()
                                            showSuccess('Đã xóa tài khoản')
                                        },
                                        onError: () => {
                                            logout()
                                            showSuccess('Đã xóa tài khoản')
                                        }
                                    }
                                );
                            } else {
                                logout()
                                showSuccess('Đã xóa tài khoản')
                            }
                        } catch {
                            logout()
                            showSuccess('Đã xóa tài khoản')
                        }
                    }
                }
            ]
        )
    }

    const handleRateApp = () => {
        Linking.openURL('https://newmwayteakwood.vn')
    }

    const handleShareApp = async () => {
        try {
            await Share.share({
                message: 'Tải ứng dụng NEWMWAY Teak Wood ngay, để cùng trải nghiệm mua sắm tuyệt vời cho bạn! https://newmwayteakwood.vn',
                title: 'NEWMWAY Teak Wood',
            })
        } catch (error) {
            console.log('Share error:', error)
        }
    }

    const renderSectionHeader = (title: string) => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{title}</Text>
        </View>
    )

    const renderSettingItem = (title: string, onPress?: () => void, isLogout?: boolean) => (
        <TouchableOpacity
            style={styles.settingItem}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Text style={[styles.settingText, isLogout && styles.logoutText]}>{title}</Text>
            {isLogout ? (
                <Image source={logoutIcon} style={styles.logoutIconImage} />
            ) : (
                <Image source={arrowIcon} style={styles.arrowIcon} />
            )}
        </TouchableOpacity>
    )

    return (
        <View style={styles.container}>
            <PrimaryHeader title="Cài Đặt" onBackPress={navigation.goBack} />

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Profile Section */}
                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        {userProfile?.avatar ? (
                            <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Text style={styles.avatarText}>
                                    {userProfile?.fullName?.[0]?.toUpperCase() || userProfile?.username?.[0]?.toUpperCase() || 'U'}
                                </Text>
                            </View>
                        )}
                        {/* <View style={styles.editBadge}>
                            <Text style={styles.editBadgeText}>✓</Text>
                        </View> */}
                    </View>
                    <Text style={styles.profileName}>
                        {userProfile?.fullName || userProfile?.username || 'User'}
                    </Text>
                    <Text style={styles.profileEmail}>{userProfile?.email || ''}</Text>
                </View>

                {/* Settings List */}
                <View style={styles.settingsContainer}>
                    {/* Quản lý tài khoản */}
                    {renderSectionHeader('QUẢN LÝ TÀI KHOẢN')}
                    {renderSettingItem('Thông Tin Tài Khoản', () => {
                        navigation.navigate('ProfileScreen', { activeTab: 0 })
                    })}
                    {renderSettingItem('Đổi Mật Khẩu', () => {
                        navigation.navigate('ChangePasswordScreen')
                    })}
                    {renderSettingItem('Xóa Tài Khoản Vĩnh Viễn', handleDeleteAccount, true)}

                    {/* Nội dung của tôi */}
                    {renderSectionHeader('NỘI DUNG CỦA TÔI')}
                    {renderSettingItem('Đơn Hàng Của Tôi', () => {
                        navigation.navigate('ProfileScreen', { activeTab: 1 })
                    })}
                    {renderSettingItem('Sản Phẩm Yêu Thích', () => {
                        navigation.navigate('ProfileScreen', { activeTab: 2 })
                    })}
                    {renderSettingItem('Địa Chỉ Giao Hàng', () => {
                        navigation.navigate('ProfileScreen', { activeTab: 3 })
                    })}
                    {renderSettingItem('Giỏ Hàng', () => {
                        const parentNavigation = navigation.getParent()
                        if (parentNavigation) {
                            parentNavigation.navigate('Giỏ Hàng', { screen: 'CartScreen' })
                        }
                    })}
                    {renderSettingItem('Các Đánh Giá', () => {
                        navigation.navigate('MyReviewsScreen')
                    })}
                    {renderSettingItem('Ngân Hàng Của Tôi', () => {
                        navigation.navigate('UserBankingScreen')
                    })}
                    {renderSettingItem('Yêu Cầu Hoàn Tiền & Trả Hàng', () => {
                        navigation.navigate('RefundRequestScreen')
                    })}

                    {/* Cài đặt ứng dụng */}
                    {renderSectionHeader('CÀI ĐẶT ỨNG DỤNG')}
                    {/* {renderSettingItem('Giao Diện', () => { })}
                    {renderSettingItem('Ngôn Ngữ', () => { })} */}
                    {renderSettingItem('Liên Hệ Hỗ Trợ', () => {
                        const parentNavigation = navigation.getParent()
                        if (parentNavigation) {
                            parentNavigation.navigate('Tin Nhắn')
                        }
                    })}

                    {/* Thông tin */}
                    {renderSectionHeader('THÔNG TIN')}
                    {renderSettingItem('Về Chúng Tôi', () => {
                        navigation.navigate('AboutUsScreen')
                    })}
                    {renderSettingItem('Điều Khoản Sử Dụng', () => {
                        navigation.navigate('TermsScreen')
                    })}
                    {renderSettingItem('Chính Sách Bảo Mật', () => {
                        navigation.navigate('PrivacyPolicyScreen')
                    })}
                    {renderSettingItem('Phiên Bản Ứng Dụng', () => {
                        navigation.navigate('AppVersionScreen')
                    })}

                    {/* Tiện ích */}
                    {renderSectionHeader('TIỆN ÍCH')}
                    {renderSettingItem('Câu Hỏi Thường Gặp', () => {
                        navigation.navigate('FAQScreen')
                    })}
                    {renderSettingItem('Chia Sẻ Ứng Dụng', handleShareApp)}
                    {renderSettingItem('Đánh Giá Ứng Dụng', handleRateApp)}

                    {/* Đăng xuất */}
                    <View style={styles.logoutSection}>
                        {renderSettingItem('Đăng Xuất', handleLogout, true)}
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default SettingsScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.grayLight,
    },
    scrollView: {
        flex: 1,
    },
    profileSection: {
        backgroundColor: Colors.textWhite,
        alignItems: 'center',
        paddingVertical: ifTablet(40, 30),
        paddingHorizontal: ifTablet(24, 20),
        marginBottom: ifTablet(2, 1),
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: ifTablet(16, 12),
    },
    avatar: {
        width: ifTablet(100, 80),
        height: ifTablet(100, 80),
        borderRadius: ifTablet(50, 40),
    },
    avatarPlaceholder: {
        width: ifTablet(100, 80),
        height: ifTablet(100, 80),
        borderRadius: ifTablet(50, 40),
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: ifTablet(40, 32),
        fontFamily: 'Sora-Bold',
        color: Colors.textWhite,
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: ifTablet(32, 26),
        height: ifTablet(32, 26),
        borderRadius: ifTablet(16, 13),
        backgroundColor: Colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: Colors.textWhite,
    },
    editBadgeText: {
        fontSize: ifTablet(16, 14),
        color: Colors.textWhite,
        fontWeight: 'bold',
    },
    profileName: {
        fontSize: ifTablet(24, 20),
        fontFamily: 'Sora-Bold',
        color: Colors.textDark,
        marginBottom: ifTablet(6, 4),
    },
    profileEmail: {
        fontSize: ifTablet(14, 12),
        fontFamily: 'Sora-Regular',
        color: Colors.textGray,
    },
    settingsContainer: {
        backgroundColor: Colors.textWhite,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: ifTablet(18, 16),
        paddingHorizontal: ifTablet(24, 20),
        borderBottomWidth: 1,
        borderBottomColor: Colors.grayLight,
    },
    settingText: {
        fontSize: ifTablet(16, 14),
        fontFamily: 'Sora-Regular',
        color: Colors.textDark,
    },
    logoutText: {
        color: Colors.error,
    },
    arrowIcon: {
        width: ifTablet(20, 18),
        height: ifTablet(20, 18),
        tintColor: Colors.textGray,
    },
    logoutIconImage: {
        width: ifTablet(20, 18),
        height: ifTablet(20, 18),
        tintColor: Colors.error,
    },
    sectionHeader: {
        paddingVertical: ifTablet(12, 10),
        paddingHorizontal: ifTablet(24, 20),
        backgroundColor: Colors.grayLight,
    },
    sectionHeaderText: {
        fontSize: ifTablet(12, 11),
        fontFamily: 'Sora-Bold',
        color: Colors.textGray,
        letterSpacing: 0.5,
    },
    logoutSection: {
        marginTop: ifTablet(20, 16),
        borderTopWidth: 1,
        borderTopColor: Colors.grayLight,
    },
})