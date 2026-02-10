import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '../../../assets/styles/colorStyles'
import { ifTablet } from '../../../utils/responsives/responsive'
import { CartStackNavigationProp } from '../../../types/navigation/navigation'
import { useUserAddressQuery } from '../../address/hooks/useAddress.hook'
import { OrderNoteModal } from './OrderNoteModal'

interface CheckoutRecipientInfoProps {
  navigation: CartStackNavigationProp;
  selectedAddressId?: string | null;
  orderNote: string;
  onNoteChange: (note: string) => void;
}

const CheckoutRecipientInfo: React.FC<CheckoutRecipientInfoProps> = ({
  navigation,
  selectedAddressId,
  orderNote,
  onNoteChange
}) => {
  const { data: userAddresses, isLoading } = useUserAddressQuery();
  const [showNoteModal, setShowNoteModal] = useState(false);

  // Get selected address or default address
  const selectedAddress = userAddresses?.find(addr =>
    selectedAddressId ? addr.id === selectedAddressId : addr.isDefault
  ) || userAddresses?.[0];

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <Text style={styles.loadingText}>Đang tải thông tin...</Text>
        </View>
      </View>
    );
  }

  if (!selectedAddress) {
    return (
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Chưa có địa chỉ nhận hàng</Text>
            <Text style={styles.emptySubtitle}>
              Vui lòng thêm địa chỉ để tiếp tục đặt hàng
            </Text>
            <TouchableOpacity
              style={styles.addAddressButton}
              onPress={() => navigation.navigate('ListAddressScreen', { fromCheckout: false })}
            >
              <Text style={styles.addAddressButtonText}>+ Thêm địa chỉ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  const fullAddress = `${selectedAddress.address}, ${selectedAddress.ward}, ${selectedAddress.district}, ${selectedAddress.province}`;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Text style={styles.sectionTitle}>Thông tin nhận hàng</Text>
        </View>
        {selectedAddress.isDefault && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultBadgeText}>Mặc định</Text>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.name}>{selectedAddress.receiverName}</Text>
          <View style={styles.separator} />
          <Text style={styles.phone}>{selectedAddress.receiverPhone}</Text>
        </View>

        <Text style={styles.address}>{fullAddress}</Text>

        {orderNote && (
          <View style={styles.noteContainer}>
            <Text style={styles.noteLabel}>Ghi chú:</Text>
            <Text style={styles.noteText}>{orderNote}</Text>
          </View>
        )}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('ListAddressScreen', { fromCheckout: true })}
        >
          <Text style={styles.actionButtonText}>Đổi địa chỉ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowNoteModal(true)}
        >
          <Text style={styles.actionButtonText}>
            {orderNote ? 'Sửa ghi chú' : 'Thêm ghi chú'}
          </Text>
        </TouchableOpacity>
      </View>

      <OrderNoteModal
        visible={showNoteModal}
        note={orderNote}
        onClose={() => setShowNoteModal(false)}
        onSave={onNoteChange}
      />
    </View>
  )
}

export default CheckoutRecipientInfo

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: ifTablet(12, 10),
    marginBottom: ifTablet(16, 12),
    padding: ifTablet(16, 12),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ifTablet(12, 10),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ifTablet(8, 6),
  },
  icon: {
    fontSize: ifTablet(20, 18),
  },
  sectionTitle: {
    fontSize: ifTablet(16, 15),
    fontFamily: 'Sora-SemiBold',
    color: Colors.textDark,
  },
  defaultBadge: {
    paddingHorizontal: ifTablet(8, 6),
    paddingVertical: ifTablet(4, 3),
    backgroundColor: Colors.primary + '15',
    borderRadius: 4,
  },
  defaultBadgeText: {
    fontSize: ifTablet(11, 10),
    fontFamily: 'Sora-Medium',
    color: Colors.primary,
  },
  infoContainer: {
    paddingVertical: ifTablet(12, 10),
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ifTablet(8, 6),
  },
  name: {
    fontSize: ifTablet(15, 14),
    fontFamily: 'Sora-SemiBold',
    color: Colors.textDark,
  },
  separator: {
    width: 1,
    height: ifTablet(14, 12),
    backgroundColor: '#DDD',
    marginHorizontal: ifTablet(10, 8),
  },
  phone: {
    fontSize: ifTablet(15, 14),
    fontFamily: 'Sora-Regular',
    color: Colors.textDark,
  },
  address: {
    fontSize: ifTablet(14, 13),
    fontFamily: 'Sora-Regular',
    color: Colors.grayDark,
    lineHeight: ifTablet(20, 18),
  },
  noteContainer: {
    marginTop: ifTablet(12, 10),
    padding: ifTablet(10, 8),
    backgroundColor: '#FFF9E6',
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#FFB800',
  },
  noteLabel: {
    fontSize: ifTablet(12, 11),
    fontFamily: 'Sora-Medium',
    color: '#B8860B',
    marginBottom: ifTablet(4, 3),
  },
  noteText: {
    fontSize: ifTablet(14, 13),
    fontFamily: 'Sora-Regular',
    color: Colors.textDark,
    lineHeight: ifTablet(18, 16),
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: ifTablet(12, 10),
    gap: ifTablet(10, 8),
    paddingTop: ifTablet(12, 10),
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ifTablet(10, 8),
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: ifTablet(6, 4),
  },
  actionButtonIcon: {
    fontSize: ifTablet(16, 14),
  },
  actionButtonText: {
    fontSize: ifTablet(14, 13),
    fontFamily: 'Sora-Medium',
    color: Colors.textDark,
  },
  loadingText: {
    fontSize: ifTablet(14, 13),
    fontFamily: 'Sora-Regular',
    color: Colors.grayDark,
    textAlign: 'center',
    paddingVertical: ifTablet(20, 16),
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: ifTablet(24, 20),
  },
  emptyTitle: {
    fontSize: ifTablet(16, 15),
    fontFamily: 'Sora-SemiBold',
    color: Colors.textDark,
    marginBottom: ifTablet(8, 6),
  },
  emptySubtitle: {
    fontSize: ifTablet(14, 13),
    fontFamily: 'Sora-Regular',
    color: Colors.grayDark,
    textAlign: 'center',
    marginBottom: ifTablet(16, 12),
  },
  addAddressButton: {
    paddingHorizontal: ifTablet(24, 20),
    paddingVertical: ifTablet(12, 10),
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  addAddressButtonText: {
    fontSize: ifTablet(15, 14),
    fontFamily: 'Sora-SemiBold',
    color: 'white',
  },
})