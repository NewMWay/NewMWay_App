import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from '../../../assets/styles/colorStyles';
import { ifTablet } from '../../../utils/responsives/responsive';


interface PriceVoucherProps {
  subtotalAmount?: number;
  finalTotalAmount?: number;
  totalPrice?: number;
  selectedItemsCount?: number;
  // onVoucherPress?: () => void;
  // hasVoucher?: boolean;
  // voucherDiscount?: number;
  isLoading?: boolean;
}

const PriceVoucher = ({
  totalPrice = 0,
  selectedItemsCount = 0,
  // onVoucherPress,
  // hasVoucher = false,
  // voucherDiscount = 0,
  isLoading = false
}: PriceVoucherProps) => {
  // const voucherIcon = require('../../../assets/icons/icons8-voucher-48.png');
  const moneyIcon = require('../../../assets/icons/icons8-money-48.png');

  return (
    <View style={styles.container}>
      {/* Left: Icon and Label */}
      <View style={styles.leftContainer}>
        <Image source={moneyIcon} style={styles.priceIcon} />
        <Text style={styles.priceLabel}>Tổng tiền ({selectedItemsCount} sản phẩm)</Text>
      </View>

      {/* Right: Price */}
      <View style={styles.rightContainer}>
        {totalPrice > 0 ? (
          <View style={styles.priceContent}>
            {/* <Text style={styles.originalPriceText}>
              {totalPrice.toLocaleString('vi-VN')}đ
            </Text> */}
            <Text style={styles.finalPriceText}>
              {(totalPrice).toLocaleString('vi-VN')}đ
            </Text>
          </View>
        ) : (
          <Text style={styles.priceText}>
            {isLoading ? 'Tính toán...' : `${totalPrice.toLocaleString('vi-VN')}đ`}
          </Text>
        )}
      </View>
      {/* Voucher */}
      {/* <TouchableOpacity
        onPress={onVoucherPress}
        style={[
          styles.voucherContainer,
          hasVoucher && styles.voucherActiveContainer,
          !onVoucherPress && styles.voucherDisabled
        ]}
        disabled={!onVoucherPress || isLoading}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.voucherText,
          hasVoucher && styles.voucherActiveText
        ]}>
          {hasVoucher 
            ? `Giảm ${voucherDiscount.toLocaleString('vi-VN')}đ` 
            : 'Chọn hoặc nhập mã'
          }
        </Text>
        <Image source={voucherIcon} style={[
          styles.voucherIcon,
          hasVoucher && styles.voucherActiveIcon
        ]} />
      </TouchableOpacity> */}
    </View>
  )
}

export default PriceVoucher

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingVertical: ifTablet(12, 10),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightContainer: {
    alignItems: 'flex-end',
  },
  priceContent: {
    alignItems: 'flex-end',
  },
  priceIcon: {
    width: ifTablet(24, 20),
    height: ifTablet(24, 20),
    tintColor: '#059669',
    marginRight: ifTablet(8, 6),
  },
  priceLabel: {
    fontSize: ifTablet(12, 10),
    fontFamily: 'Sora-Regular',
    color: '#6b7280',
  },
  priceText: {
    fontSize: ifTablet(16, 14),
    fontFamily: 'Sora-SemiBold',
    fontWeight: '600',
    color: Colors.textDark,
  },
  originalPriceText: {
    fontSize: ifTablet(14, 12),
    fontFamily: 'Sora-Regular',
    color: '#9ca3af',
    textDecorationLine: 'line-through',
    marginBottom: ifTablet(2, 1),
  },
  finalPriceText: {
    fontSize: ifTablet(16, 14),
    fontFamily: 'Sora-Bold',
    fontWeight: '700',
    color: Colors.pricePrimary,
  },
  voucherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(156, 163, 175, 0.1)',
    paddingHorizontal: ifTablet(12, 8),
    paddingVertical: ifTablet(8, 6),
    borderRadius: ifTablet(8, 6),
    borderWidth: 1,
    borderColor: 'rgba(156, 163, 175, 0.3)',
  },
  voucherActiveContainer: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderColor: '#6b7280',
  },
  voucherDisabled: {
    backgroundColor: 'rgba(156, 163, 175, 0.1)',
    borderColor: 'rgba(156, 163, 175, 0.3)',
  },
  voucherIcon: {
    width: ifTablet(20, 18),
    height: ifTablet(20, 18),
    tintColor: Colors.primary,
    marginLeft: ifTablet(6, 4),
  },
  voucherActiveIcon: {
    tintColor: Colors.primary,
  },
  voucherText: {
    fontSize: ifTablet(14, 12),
    color: '#9ca3af',
    fontWeight: '500',
    fontFamily: 'Sora-Medium',
  },
  voucherActiveText: {
    color: Colors.primary,
    fontWeight: '600',
  },

})