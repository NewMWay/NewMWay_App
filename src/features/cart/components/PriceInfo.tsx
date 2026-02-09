import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { ifTablet } from '../../../utils/responsives/responsive';
import { Colors } from '../../../assets/styles/colorStyles';
import VoucherSelect from './VoucherSelect';
import { PromotionItem } from '../../promotion/types/promotion.type';

interface PriceInfoProps {
  subtotal?: number;
  shippingFee?: number;
  discount?: number;
  total?: number;
  onVoucherPress?: () => void;
  onRemoveVoucher?: (type?: any) => void;
  selectedOrderPromotion?: PromotionItem | null;
  selectedShippingPromotion?: PromotionItem | null;
  showVoucherList?: boolean;
  availablePromotions?: PromotionItem[];
  onSelectVoucher?: (promotion: PromotionItem) => void;
  currentOrderTotal?: number;
  shipFeeOnly?: number;
  onPaymentMethodChange?: (method: 'cod' | 'online') => void;
}

const PriceInfo: React.FC<PriceInfoProps> = ({
  subtotal = 0,
  shippingFee = 0,
  discount = 0,
  total = 0,
  onVoucherPress,
  onRemoveVoucher,
  selectedOrderPromotion = null,
  selectedShippingPromotion = null,
  showVoucherList = false,
  availablePromotions = [],
  onSelectVoucher,
  currentOrderTotal = 0,
  shipFeeOnly = 0,
  onPaymentMethodChange
}) => {
  const [selectedPayment, setSelectedPayment] = useState<'cod' | 'online'>('cod');
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const downIcon = require('../../../assets/icons/icons8-down-48.png');
  const collapseIcon = require('../../../assets/icons/icons8-collapse-arrow-48.png');
  const codIcon = require('../../../assets/icons/icons8-cash-on-delivery-48.png');
  const onlinePaymentIcon = require('../../../assets/icons/icons8-online-payment-52.png');


  return (
    <View style={styles.container}>
      {/* Voucher Section */}
      <View style={styles.voucherSection}>
        <VoucherSelect
          onVoucherPress={onVoucherPress}
          onRemoveVoucher={onRemoveVoucher}
          selectedOrderPromotion={selectedOrderPromotion}
          selectedShippingPromotion={selectedShippingPromotion}
          voucherDiscount={discount}
          showVoucherList={showVoucherList}
          availablePromotions={availablePromotions}
          onSelectVoucher={onSelectVoucher}
          currentOrderTotal={currentOrderTotal}
          shipFeeOnly={shipFeeOnly}
        />
      </View>

      {/* Price Summary Section */}
      <View style={styles.priceSection}>
        <Text style={styles.sectionTitle}>Thông tin giá tiền</Text>

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Tạm tính</Text>
          <Text style={styles.priceValue}>{subtotal.toLocaleString('vi-VN')}₫</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Phí giao hàng</Text>
          <Text style={styles.priceValue}>{shippingFee.toLocaleString('vi-VN')}₫</Text>
        </View>

        {discount > 0 && (
          <View style={styles.discountSection}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Giảm giá</Text>
              <Text style={styles.discountValue}>-{discount.toLocaleString('vi-VN')}₫</Text>
            </View>
            {selectedOrderPromotion && (
              <View style={styles.voucherDetailRow}>
                <View style={styles.voucherTypeBadge}>
                  <Text style={styles.voucherTypeText}>Order</Text>
                </View>
                <Text style={styles.voucherDetailText}>{selectedOrderPromotion.code}</Text>
                <Text style={styles.voucherDetailAmount}>
                  -{Math.min((currentOrderTotal * selectedOrderPromotion.discountValue) / 100, selectedOrderPromotion.maxDiscountValue).toLocaleString('vi-VN')}₫
                </Text>
              </View>
            )}
            {selectedShippingPromotion && (
              <View style={styles.voucherDetailRow}>
                <View style={[styles.voucherTypeBadge, styles.shippingTypeBadge]}>
                  <Text style={styles.voucherTypeText}>Ship</Text>
                </View>
                <Text style={styles.voucherDetailText}>{selectedShippingPromotion.code}</Text>
                <Text style={styles.voucherDetailAmount}>
                  -{Math.min(Math.min((shipFeeOnly * selectedShippingPromotion.discountValue) / 100, selectedShippingPromotion.maxDiscountValue), shipFeeOnly).toLocaleString('vi-VN')}₫
                </Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tổng cộng</Text>
          <Text style={styles.totalValue}>{total.toLocaleString('vi-VN')}₫</Text>
        </View>
      </View>

      {/* Payment Method Section */}
      <View style={styles.paymentSection}>
        <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>

        <TouchableOpacity
          style={styles.paymentSelector}
          onPress={() => setShowPaymentOptions(!showPaymentOptions)}
        >
          <View style={styles.paymentMethod}>
            <Image
              source={selectedPayment === 'cod' ? codIcon : onlinePaymentIcon}
              style={styles.paymentIcon}
            />
            <Text style={styles.paymentText}>
              {selectedPayment === 'cod' ? 'Thanh toán khi nhận hàng' : 'Thanh toán online'}
            </Text>
          </View>
          <Image
            source={showPaymentOptions ? collapseIcon : downIcon}
            style={styles.dropdownIcon}
          />
        </TouchableOpacity>

        {showPaymentOptions && (
          <View style={styles.paymentOptions}>
            <TouchableOpacity
              style={[styles.paymentOption, selectedPayment === 'cod' && styles.selectedOption]}
              onPress={() => {
                setSelectedPayment('cod');
                setShowPaymentOptions(false);
                onPaymentMethodChange?.('cod');
              }}
            >
              <Image source={codIcon} style={styles.paymentIcon} />
              <Text style={styles.paymentOptionText}>Thanh toán khi nhận hàng</Text>
              {selectedPayment === 'cod' && <View style={styles.checkmark} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.paymentOption, selectedPayment === 'online' && styles.selectedOption]}
              onPress={() => {
                setSelectedPayment('online');
                setShowPaymentOptions(false);
                onPaymentMethodChange?.('online');
              }}
            >
              <Image source={onlinePaymentIcon} style={styles.paymentIcon} />
              <Text style={styles.paymentOptionText}>Thanh toán online</Text>
              {selectedPayment === 'online' && <View style={styles.checkmark} />}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  )
}

export default PriceInfo

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginHorizontal: ifTablet(16, 6),
    marginBottom: ifTablet(16, 12),
    borderRadius: ifTablet(20, 16),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 10,
  },
  voucherSection: {
    padding: ifTablet(20, 16),
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  priceSection: {
    padding: ifTablet(24, 20),
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  paymentSection: {
    padding: ifTablet(24, 20),
  },
  paymentIcon: {
    width: ifTablet(24, 20),
    height: ifTablet(24, 20),
    marginRight: ifTablet(12, 10),
    tintColor: Colors.primary,
  },
  sectionTitle: {
    fontSize: ifTablet(18, 16),
    fontFamily: 'Sora-Bold',
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: ifTablet(20, 16),
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ifTablet(12, 10),
  },
  priceLabel: {
    fontSize: ifTablet(15, 14),
    fontFamily: 'Sora-Regular',
    color: '#64748b',
  },
  priceValue: {
    fontSize: ifTablet(15, 14),
    fontFamily: 'Sora-SemiBold',
    fontWeight: '600',
    color: Colors.textDark,
  },
  discountValue: {
    fontSize: ifTablet(15, 14),
    fontFamily: 'Sora-SemiBold',
    fontWeight: '600',
    color: '#ef4444',
  },
  discountSection: {
    marginBottom: ifTablet(8, 6),
  },
  voucherDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: ifTablet(16, 12),
    marginTop: ifTablet(8, 6),
    gap: ifTablet(8, 6),
  },
  voucherTypeBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: ifTablet(8, 6),
    paddingVertical: ifTablet(3, 2),
    borderRadius: ifTablet(4, 3),
  },
  shippingTypeBadge: {
    backgroundColor: '#fef3c7',
  },
  voucherTypeText: {
    fontSize: ifTablet(10, 9),
    fontFamily: 'Sora-Bold',
    fontWeight: '700',
    color: '#1e40af',
  },
  voucherDetailText: {
    fontSize: ifTablet(13, 12),
    fontFamily: 'Sora-Medium',
    fontWeight: '500',
    color: '#64748b',
    flex: 1,
  },
  voucherDetailAmount: {
    fontSize: ifTablet(13, 12),
    fontFamily: 'Sora-SemiBold',
    fontWeight: '600',
    color: '#ef4444',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: ifTablet(16, 12),
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: ifTablet(16, 12),
    borderRadius: ifTablet(12, 10),
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  totalLabel: {
    fontSize: ifTablet(17, 15),
    fontFamily: 'Sora-Bold',
    fontWeight: '700',
    color: Colors.textDark,
  },
  totalValue: {
    fontSize: ifTablet(20, 18),
    fontFamily: 'Sora-Bold',
    fontWeight: '700',
    color: Colors.primary,
  },
  paymentSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: ifTablet(16, 14),
    borderRadius: ifTablet(12, 10),
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentText: {
    fontSize: ifTablet(15, 14),
    fontFamily: 'Sora-SemiBold',
    fontWeight: '600',
    color: Colors.textDark,
    flex: 1,
  },
  dropdownIcon: {
    width: ifTablet(20, 18),
    height: ifTablet(20, 18),
    tintColor: '#64748b',
  },
  paymentOptions: {
    marginTop: ifTablet(12, 10),
    backgroundColor: '#f8fafc',
    borderRadius: ifTablet(12, 10),
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: ifTablet(16, 14),
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  selectedOption: {
    backgroundColor: '#f0fdf4',
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  paymentOptionText: {
    fontSize: ifTablet(14, 13),
    fontFamily: 'Sora-Medium',
    fontWeight: '500',
    color: Colors.textDark,
    flex: 1,
    marginLeft: ifTablet(12, 10),
  },
  checkmark: {
    width: ifTablet(20, 18),
    height: ifTablet(20, 18),
    borderRadius: ifTablet(10, 9),
    backgroundColor: Colors.primary,
    marginLeft: ifTablet(8, 6),
  },
})