import { Animated, Modal, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View, Platform, Alert } from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useAuthStore } from '../../../stores/authStore.zustand'
import { useToast } from '../../../utils/toasts/useToast'
import { useProfileQuery, useUpdateProfile } from '../hooks/useProfile.hook'
import LoadingOverlay from '../../auth/components/Loading/LoadingOverlay'
import ProfileHeader from '../components/ProfileHeader'
import ProfileTabBar from '../components/ProfileTabBar'
import InfoTab from '../components/InfoTab'
import OrdersTab from '../components/OrdersTab'
import FavoritesTab from '../components/FavoritesTab'
import AddressTab from '../components/AddressTab'
import { Colors } from '../../../assets/styles/colorStyles'
import { ifTablet } from '../../../utils/responsives/responsive'
import { useOrderListQuery } from '../../order/hooks/useOrder.hook'
import { useUserAddressQuery } from '../../address/hooks/useAddress.hook'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { ProfileStackNavigationProp, ProfileStackParamList } from '../../../types/navigation/navigation'
import { useDeleteUserDeviceToken } from '../../shop/hooks/useUserDeviceToken.hook'
import { getFcmToken } from '../../../utils/fcmHelper'
import { launchImageLibrary } from 'react-native-image-picker'
import { useUploadImage } from '../../shop/hooks/useMediaUpload.hook'

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileStackNavigationProp>()
  const route = useRoute<RouteProp<ProfileStackParamList, 'ProfileScreen'>>();
  const { data: profile, isLoading, isError } = useProfileQuery()
  const { logout } = useAuthStore()
  const { showSuccess, showError } = useToast()
  const { mutate: deleteDeviceToken } = useDeleteUserDeviceToken()

  const scrollY = useRef(new Animated.Value(0)).current
  const scrollViewRef = useRef<ScrollView>(null)
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState(route.params?.activeTab || 0)
  const [settingsModalVisible, setSettingsModalVisible] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [pickedAvatar, setPickedAvatar] = useState<any>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const { mutate: updateProfile, isPending: isUpdatePending, isError: isUpdateError } = useUpdateProfile()
  const { mutate: uploadImage } = useUploadImage()
  const {
    data: orderData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingOrders,
    refetch: refetchOrders,
    isRefetching: isRefetchingOrders
  } = useOrderListQuery({
    // Bạn có thể thêm params filter nếu cần
  })
  const orders = useMemo(() => {
    return orderData?.pages.flatMap(page => page.items) || []
  }, [orderData])
  const totalCount = orderData?.pages[0]?.total || 0;


  const { data: userAddresses, isError: isErrorAddresses, isLoading: isLoadingAddresses } = useUserAddressQuery();
  console.log('userAddresses', userAddresses);

  const currentScrollY = useRef(0)

  // Handle activeTab param from navigation
  useEffect(() => {
    if (route.params?.activeTab !== undefined) {
      setActiveTab(route.params.activeTab);
    }
  }, [route.params?.activeTab]);

  console.log('Profile Data:', profile)

  if (isError) {
    showError('Không thể tải thông tin người dùng.')
  }
  if (isUpdateError) {
    showError('Cập nhật thông tin người dùng thất bại!')
  }
  if (isErrorAddresses) {
    showError('Không thể tải địa chỉ người dùng.')
  }

  const SCROLL_THRESHOLD = ifTablet(150, 120)

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }: any) => {
    const paddingToBottom = 20
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom
  }
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const scrollYValue = event.nativeEvent.contentOffset.y
        currentScrollY.current = scrollYValue

        if (scrollYValue > SCROLL_THRESHOLD + 10) {
          setIsHeaderCollapsed(true)
        } else if (scrollYValue < SCROLL_THRESHOLD - 10) {
          setIsHeaderCollapsed(false)
        }
        // Load more only for Orders tab
        if (activeTab === 1 && isCloseToBottom(event.nativeEvent) && hasNextPage && !isFetchingNextPage) {
          console.log('Load more orders...');
          fetchNextPage();
        }
      },
    }
  )
  const handleRefresh = () => {
    if (activeTab === 1) {
      refetchOrders()
    } else {
      // Logic refresh cho các tab khác nếu cần (ví dụ refresh profile)
      // refetchProfile()
    }
  }

  const handleLogout = async () => {
    setSettingsModalVisible(false)

    // Xóa FCM token trên server trước khi logout
    try {
      const fcmToken = await getFcmToken();
      if (fcmToken) {
        // Phải đợi API xóa token hoàn thành trước khi logout
        deleteDeviceToken(
          {
            deviceToken: fcmToken,
            deviceType: Platform.OS,
          },
          {
            onSuccess: () => {
              // Sau khi xóa token thành công, mới logout
              logout()
              showSuccess('Đăng xuất thành công')
            },
            onError: (error) => {
              console.log('Failed to delete FCM token:', error);
              // Vẫn logout dù API fail
              logout()
              showSuccess('Đăng xuất thành công')
            }
          }
        );
      } else {
        // Không có FCM token, logout luôn
        logout()
        showSuccess('Đăng xuất thành công')
      }
    } catch (error) {
      console.log('Failed to get FCM token:', error);
      // Lỗi khi lấy token, vẫn logout
      logout()
      showSuccess('Đăng xuất thành công')
    }
  }

  const handleEditProfile = () => {
    setSettingsModalVisible(false)
    setIsEditMode(true)
    setActiveTab(0)
    setPickedAvatar(null)
  }

  const handleCancelEdit = () => {
    setIsEditMode(false)
    setPickedAvatar(null)
  }

  const handlePickAvatar = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 0.8,
        maxWidth: 1024,
        maxHeight: 1024,
      });

      if (result.didCancel) {
        console.log('User cancelled image picker');
        return;
      }

      if (result.errorCode) {
        const errorMessages: { [key: string]: string } = {
          'camera_unavailable': 'Camera không khả dụng trên thiết bị này',
          'permission': 'Vui lòng cấp quyền truy cập thư viện ảnh',
          'others': result.errorMessage || 'Không thể chọn ảnh'
        };
        Alert.alert('Lỗi', errorMessages[result.errorCode] || errorMessages.others);
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const image = result.assets[0];

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (image.fileSize && image.fileSize > maxSize) {
          Alert.alert('Lỗi', 'Kích thước ảnh phải nhỏ hơn 5MB');
          return;
        }

        // Upload image to server
        setIsUploadingAvatar(true);

        const formDataImage: any = {
          uri: Platform.OS === 'android' ? image.uri : image.uri?.replace('file://', ''),
          type: image.type || 'image/jpeg',
          name: image.fileName || `avatar_${Date.now()}.jpg`,
        };

        uploadImage(
          { Image: formDataImage },
          {
            onSuccess: (uploadedUrl: string) => {
              console.log('Image uploaded successfully:', uploadedUrl);
              setPickedAvatar(uploadedUrl); // Lưu URL từ server
              setIsUploadingAvatar(false);
              showSuccess('Tải ảnh đại diện lên thành công!');
            },
            onError: (error: any) => {
              console.log('Upload image error:', error);
              setIsUploadingAvatar(false);
              showError('Tải ảnh lên thất bại. Vui lòng thử lại!');
            },
          }
        );
      }
    } catch (error) {
      console.log('Error picking image:', error);
      setIsUploadingAvatar(false);
      showError('Có lỗi xảy ra khi chọn ảnh');
    }
  }


  const handleSaveProfile = (data: { fullName: string; phone: string }) => {
    updateProfile({
      fullName: data.fullName,
      phone: data.phone,
      avatar: pickedAvatar ? pickedAvatar : (profile?.avatar || null),
    },
      {
        onSuccess: () => {
          setIsEditMode(false)
          setPickedAvatar(null)
        },
        onError: () => {
          showError('Cập nhật thông tin người dùng thất bại!')
        }

      }

    )

  }

  const handleSettingsPress = () => {
    setSettingsModalVisible(true)
  }

  const handleSettingDetailPress = () => {
    setSettingsModalVisible(false)
    navigation.navigate('SettingsScreen')
  }

  const handleTabChange = (index: number) => {
    setActiveTab(index)
  }

  const renderTabContent = () => {
    if (!profile) return null

    switch (activeTab) {
      case 0:
        return (
          <InfoTab
            username={profile.username}
            fullName={profile.fullName}
            phone={profile.phone}
            email={profile.email}
            createdDate={profile.createdDate}
            lastModifiedDate={profile.lastModifiedDate}
            isEditMode={isEditMode}
            onSave={handleSaveProfile}
            onCancel={handleCancelEdit}
          />
        )
      case 1:
        return <OrdersTab
          orders={orders}
          isLoading={isLoadingOrders}
          isFetchingNextPage={isFetchingNextPage}
          totalCount={totalCount}
        />
      case 2:
        return <FavoritesTab />
      case 3:
        return <AddressTab
          addresses={userAddresses}
          isLoading={isLoadingAddresses}
        />
      default:
        return null
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={activeTab === 1 ? isRefetchingOrders : false}
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
          />
        }
      >
        {profile && (
          <ProfileHeader
            scrollY={scrollY}
            isHeaderCollapsed={isHeaderCollapsed}
            avatar={pickedAvatar || profile.avatar}
            fullName={profile.fullName}
            username={profile.username}
            email={profile.email}
            phone={profile.phone}
            onSettingsPress={handleSettingsPress}
            isEditMode={isEditMode}
            onChangeAvatar={handlePickAvatar}
            onBackPress={() => navigation.goBack()}
          />
        )}

        <View style={styles.contentContainer}>
          {renderTabContent()}
        </View>
      </ScrollView>

      {profile && (
        <ProfileTabBar
          scrollY={scrollY}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      )}

      <LoadingOverlay visible={isLoading || isUpdatePending || isUploadingAvatar} />

      {/* Settings Modal */}
      <Modal
        visible={settingsModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSettingsModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSettingsModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleEditProfile}
            >
              <Text style={styles.modalOptionText}>Chỉnh sửa thông tin</Text>
            </TouchableOpacity>

            <View style={styles.modalDivider} />

            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleSettingDetailPress}
            >
              <Text style={styles.modalOptionText}>Cài đặt chi tiết</Text>
            </TouchableOpacity>

            <View style={styles.modalDivider} />

            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleLogout}
            >
              <Text style={[styles.modalOptionText, styles.logoutText]}>
                Đăng xuất
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.textWhite,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: ifTablet(120, 350),
  },
  contentContainer: {
    marginTop: ifTablet(60, 60),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.textWhite,
    borderRadius: ifTablet(16, 12),
    width: ifTablet('60%', '80%'),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  modalOption: {
    paddingVertical: ifTablet(20, 16),
    paddingHorizontal: ifTablet(24, 20),
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: ifTablet(18, 16),
    color: Colors.textDark,
  },
  modalDivider: {
    height: 1,
    backgroundColor: Colors.gray + '30',
  },
  logoutText: {
    color: Colors.error,
  },
})