import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Text,
  ActivityIndicator
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { Colors } from '../../../assets/styles/colorStyles'
import { ifTablet } from '../../../utils/responsives/responsive'
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { CartStackNavigationProp, CartStackParamList } from '../../../types/navigation/navigation'
import {
  useProvincesQuery,
  useDistrictsQuery,
  useWardsQuery,
  useUpdateUserAddress,
  useUserAddressQuery
} from '../../address/hooks/useAddress.hook'
import { SelectModal, LocationOption } from '../../address/components/SelectModal'
import { InputField } from '../../address/components/InputField'
import { SelectField } from '../../address/components/SelectField'
import { useToast } from '../../../utils/toasts/useToast'

type EditAddressScreenRouteProp = RouteProp<CartStackParamList, 'EditAddressScreen'>;

const EditAddressScreen = () => {
  const navigation = useNavigation<CartStackNavigationProp>();
  const route = useRoute<EditAddressScreenRouteProp>();
  const { id: addressId } = route.params;
  const { showError } = useToast();

  const { mutate: updateAddress, isPending } = useUpdateUserAddress();
  const { data: userAddresses, isLoading: loadingAddress } = useUserAddressQuery();

  // Find the address to edit
  const addressToEdit = userAddresses?.find(addr => addr.id === addressId);
  // Form states
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  // Location states
  const [selectedProvince, setSelectedProvince] = useState<LocationOption | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<LocationOption | null>(null);
  const [selectedWard, setSelectedWard] = useState<LocationOption | null>(null);

  // Modal states
  const [showProvinceModal, setShowProvinceModal] = useState(false);
  const [showDistrictModal, setShowDistrictModal] = useState(false);
  const [showWardModal, setShowWardModal] = useState(false);

  // Queries
  const { data: provincesData, isLoading: loadingProvinces } = useProvincesQuery();
  const { data: districtsData, isLoading: loadingDistricts } = useDistrictsQuery({
    id: selectedProvince?.id || ''
  });
  const { data: wardsData, isLoading: loadingWards } = useWardsQuery({
    id: selectedDistrict?.id || ''
  });

  // Transform data for modals
  const provincesArray = Array.isArray(provincesData) ? provincesData : provincesData?.provinces || [];
  const provinces: LocationOption[] = provincesArray.map((p: any) => ({
    id: p.cityId,
    name: p.name
  }));

  const districtsArray = Array.isArray(districtsData) ? districtsData : districtsData?.districts || [];
  const districts: LocationOption[] = districtsArray.map((d: any) => ({
    id: d.districtId,
    name: d.name
  }));

  const wardsArray = Array.isArray(wardsData) ? wardsData : wardsData?.wards || [];
  const wards: LocationOption[] = wardsArray.map((w: any) => ({
    id: w.wardId,
    name: w.name
  }));

  useEffect(() => {
    if (addressToEdit) {
      setReceiverName(addressToEdit.receiverName);
      setReceiverPhone(addressToEdit.receiverPhone);
      setAddress(addressToEdit.address);
      setIsDefault(addressToEdit.isDefault);

      // Set province (need to find ID from name)
      if (addressToEdit.province && provinces.length > 0) {
        const province = provinces.find(p => p.name === addressToEdit.province);
        if (province) {
          setSelectedProvince(province);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressToEdit, provinces.length]);

  useEffect(() => {
    if (addressToEdit?.district && districts.length > 0 && !selectedDistrict) {
      const district = districts.find(d => d.name === addressToEdit.district);
      if (district) {
        setSelectedDistrict(district);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressToEdit, districts.length]);

  useEffect(() => {
    if (addressToEdit?.ward && wards.length > 0 && !selectedWard) {
      const ward = wards.find(w => w.name === addressToEdit.ward);
      if (ward) {
        setSelectedWard(ward);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressToEdit, wards.length]);

  const handleSelectProvince = (province: LocationOption) => {
    setSelectedProvince(province);
    setSelectedDistrict(null);
    setSelectedWard(null);
    setShowProvinceModal(false);
  };

  const handleSelectDistrict = (district: LocationOption) => {
    setSelectedDistrict(district);
    setSelectedWard(null);
    setShowDistrictModal(false);
  };

  const handleSelectWard = (ward: LocationOption) => {
    setSelectedWard(ward);
    setShowWardModal(false);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSubmit = () => {
    // Validation
    if (!receiverName.trim()) {
      showError('Vui lòng nhập tên người nhận');
      return;
    }
    if (!receiverPhone.trim()) {
      showError('Vui lòng nhập số điện thoại');
      return;
    }
    if (!selectedProvince) {
      showError('Vui lòng chọn Tỉnh/Thành phố');
      return;
    }
    if (!selectedDistrict) {
      showError('Vui lòng chọn Quận/Huyện');
      return;
    }
    if (!selectedWard) {
      showError('Vui lòng chọn Phường/Xã');
      return;
    }
    if (!address.trim()) {
      showError('Vui lòng nhập địa chỉ cụ thể');
      return;
    }

    const payload = {
      id: addressId,
      receiverName: receiverName.trim(),
      receiverPhone: receiverPhone.trim(),
      cityId: selectedProvince.id,
      province: selectedProvince.name,
      districtId: selectedDistrict.id,
      district: selectedDistrict.name,
      wardId: selectedWard.id,
      ward: selectedWard.name,
      address: address.trim(),
      isDefault: isDefault,
    };

    updateAddress(payload, {
      onSuccess: () => {
        navigation.goBack();
      },
    });
  };

  if (loadingAddress) {
    return (
      <View style={styles.container}>
        <PrimaryHeader
          title="Sửa Địa Chỉ"
          onBackPress={handleGoBack}
        />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </View>
    );
  }

  if (!addressToEdit) {
    return (
      <View style={styles.container}>
        <PrimaryHeader
          title="Sửa Địa Chỉ"
          onBackPress={handleGoBack}
        />
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Không tìm thấy địa chỉ</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PrimaryHeader
        title="Sửa Địa Chỉ"
        onBackPress={handleGoBack}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          {/* Receiver Name */}
          <InputField
            label="Tên người nhận"
            required
            placeholder="Nhập tên người nhận"
            value={receiverName}
            onChangeText={setReceiverName}
          />

          {/* Receiver Phone */}
          <InputField
            label="Số điện thoại"
            required
            placeholder="Nhập số điện thoại"
            value={receiverPhone}
            onChangeText={setReceiverPhone}
            keyboardType="phone-pad"
          />

          {/* Province */}
          <SelectField
            label="Tỉnh/Thành phố"
            required
            value={selectedProvince?.name || null}
            placeholder="Chọn Tỉnh/Thành phố"
            onPress={() => setShowProvinceModal(true)}
          />

          {/* District */}
          <SelectField
            label="Quận/Huyện"
            required
            value={selectedDistrict?.name || null}
            placeholder="Chọn Quận/Huyện"
            onPress={() => setShowDistrictModal(true)}
            disabled={!selectedProvince}
          />

          {/* Ward */}
          <SelectField
            label="Phường/Xã"
            required
            value={selectedWard?.name || null}
            placeholder="Chọn Phường/Xã"
            onPress={() => setShowWardModal(true)}
            disabled={!selectedDistrict}
          />

          {/* Address Detail */}
          <InputField
            label="Địa chỉ cụ thể"
            required
            placeholder="Số nhà, tên đường..."
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            style={styles.textArea}
          />

          {/* Default Address Toggle */}
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>Đặt làm địa chỉ mặc định</Text>
            <Switch
              value={isDefault}
              onValueChange={setIsDefault}
              trackColor={{ false: '#DDD', true: Colors.primary + '80' }}
              thumbColor={isDefault ? Colors.primary : '#f4f3f4'}
            />
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.submitButton, isPending && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isPending}
        >
          {isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Cập Nhật Địa Chỉ</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <SelectModal
        visible={showProvinceModal}
        title="Chọn Tỉnh/Thành phố"
        data={provinces}
        onSelect={handleSelectProvince}
        onClose={() => setShowProvinceModal(false)}
        isLoading={loadingProvinces}
      />

      <SelectModal
        visible={showDistrictModal}
        title="Chọn Quận/Huyện"
        data={districts}
        onSelect={handleSelectDistrict}
        onClose={() => setShowDistrictModal(false)}
        isLoading={loadingDistricts}
      />

      <SelectModal
        visible={showWardModal}
        title="Chọn Phường/Xã"
        data={wards}
        onSelect={handleSelectWard}
        onClose={() => setShowWardModal(false)}
        isLoading={loadingWards}
      />
    </View>
  )
}

export default EditAddressScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: ifTablet(100, 90),
  },
  formContainer: {
    marginHorizontal: ifTablet(32, 16),
    paddingTop: ifTablet(20, 16),
  },
  textArea: {
    minHeight: ifTablet(90, 80),
    paddingTop: ifTablet(12, 10),
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: ifTablet(12, 10),
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    marginTop: ifTablet(12, 8),
  },
  toggleLabel: {
    fontSize: ifTablet(15, 14),
    fontWeight: '500',
    color: '#333',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 25,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingHorizontal: ifTablet(32, 16),
    paddingVertical: ifTablet(16, 12),
  },
  submitButton: {
    backgroundColor: Colors.primary || '#E53935',
    borderRadius: 8,
    paddingVertical: ifTablet(14, 12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: ifTablet(16, 15),
    fontWeight: '600',
    color: 'white',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: ifTablet(16, 14),
    color: Colors.error || '#E53935',
  },
})