import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Text,
  ActivityIndicator,
  KeyboardAvoidingView,
  // Platform
} from 'react-native'
import React, { useState } from 'react'
import { Colors } from '../../../assets/styles/colorStyles'
import { ifTablet } from '../../../utils/responsives/responsive'
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader'
import { useNavigation } from '@react-navigation/native'
import { CartStackNavigationProp } from '../../../types/navigation/navigation'
import {
  useProvincesQuery,
  useDistrictsQuery,
  useWardsQuery,
  useCreateUserAddress
} from '../../address/hooks/useAddress.hook'
import { useToast } from '../../../utils/toasts/useToast'
import { SelectModal, LocationOption } from '../../address/components/SelectModal'
import { InputField } from '../../address/components/InputField'
import { SelectField } from '../../address/components/SelectField'

const AddAddressScreen = () => {
  const navigation = useNavigation<CartStackNavigationProp>();
  const { mutate: createAddress, isPending } = useCreateUserAddress();
  const { showError } = useToast();

  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const [selectedProvince, setSelectedProvince] = useState<LocationOption | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<LocationOption | null>(null);
  const [selectedWard, setSelectedWard] = useState<LocationOption | null>(null);


  const [showProvinceModal, setShowProvinceModal] = useState(false);
  const [showDistrictModal, setShowDistrictModal] = useState(false);
  const [showWardModal, setShowWardModal] = useState(false);


  const { data: provincesData, isLoading: loadingProvinces } = useProvincesQuery();
  console.log('Provinces Data:', provincesData);

  const { data: districtsData, isLoading: loadingDistricts } = useDistrictsQuery({
    id: selectedProvince?.id || ''
  });
  const { data: wardsData, isLoading: loadingWards } = useWardsQuery({
    id: selectedDistrict?.id || ''
  });


  const provincesArray = Array.isArray(provincesData) ? provincesData : provincesData?.provinces || [];
  const provinces: LocationOption[] = provincesArray.map((p: any) => ({
    id: p.cityId,
    name: p.name
  }));

  console.log('Transformed Provinces:', provinces);
  console.log('Provinces Length:', provinces.length);

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

    createAddress(payload, {
      onSuccess: () => {
        navigation.goBack();
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={'padding'}
    // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    // keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <PrimaryHeader
        title="Thêm Địa Chỉ Mới"
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
            <Text style={styles.submitButtonText}>Thêm Địa Chỉ</Text>
          )}
        </TouchableOpacity>
      </View>


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
    </KeyboardAvoidingView>
  )
}

export default AddAddressScreen

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
})