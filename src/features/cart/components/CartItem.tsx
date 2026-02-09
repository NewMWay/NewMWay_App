import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '../../../assets/styles/colorStyles'
import { ifTablet } from '../../../utils/responsives/responsive'
import { useDeleteCartItem } from '../hooks/useCart.hook';
import LoadingOverlay from '../../auth/components/Loading/LoadingOverlay';
import { useToast } from '../../../utils/toasts/useToast';

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  isSelected: boolean;
  supplier?: string;
  variant?: string;
  onSelect: (id: string) => void;
  onQuantityChange: (id: string, quantity: number) => void;
  onVariantPress?: (id: string) => void;
  onDelete?: (id: string) => void;
  maxQuantity?: number;
}

const CartItem = ({
  id,
  name,
  price,
  originalPrice,
  image,
  quantity,
  isSelected,
  supplier,
  variant,
  onSelect,
  onQuantityChange,
  onVariantPress,
  // onDelete,
  maxQuantity = 99
}: CartItemProps) => {
  const [imageError, setImageError] = useState(false);

  const checkboxIcon = require('../../../assets/icons/icons8-checkbox-48.png');
  const checkboxCheckedIcon = require('../../../assets/icons/icons8-checked-checkbox-48.png');
  // const deleteIcon = require('../../../assets/icons/icons8-full-trash-48.png');
  const { mutate: deleteCartItem, isPending: isDeletePending, isError: isDeleteError } = useDeleteCartItem();
  const { showError } = useToast();
  if (isDeleteError) {
    showError('Xóa sản phẩm khỏi giỏ hàng thất bại. Vui lòng thử lại.');
  }

  // const handleDeletePress = () => {
  //   Alert.alert(
  //     'Xác nhận xóa',
  //     'Bạn có muốn xóa sản phẩm này khỏi giỏ hàng?',
  //     [
  //       {
  //         text: 'Hủy',
  //         style: 'cancel',
  //       },
  //       {
  //         text: 'Xóa',
  //         style: 'destructive',
  //         onPress: () => {
  //           if (onDelete) {
  //             onDelete(id);
  //           } else {
  //             deleteCartItem({ id });
  //           }
  //         },
  //       },
  //     ]
  //   );
  // };

  const handleQuantityDecrease = () => {
    if (quantity > 1) {
      onQuantityChange(id, quantity - 1);
    } else {
      Alert.alert(
        'Xác nhận xóa',
        'Bạn có muốn xóa sản phẩm này khỏi giỏ hàng?',
        [
          {
            text: 'Hủy',
            style: 'cancel',
          },
          {
            text: 'Xóa',
            style: 'destructive',
            onPress: () => deleteCartItem({ id }),

          },
        ]
      );
    }
  };

  const handleQuantityIncrease = () => {
    if (quantity < maxQuantity) {
      onQuantityChange(id, quantity + 1);
    }
  };

  const totalPrice = price * quantity;

  return (
    <View style={styles.container}>
      {/* Selection Checkbox - Left of image */}
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => onSelect(id)}
        activeOpacity={0.9}
      >
        <Image
          source={isSelected ? checkboxCheckedIcon : checkboxIcon}
          style={[
            styles.checkboxIcon,
            isSelected && styles.checkboxIconSelected
          ]}
        />
      </TouchableOpacity>

      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image
          source={imageError ? require('../../../assets/images/logo/LOGO-NEW-WAY-TEAK-WOOD-02.png') : { uri: image }}
          style={styles.productImage}
          onError={() => setImageError(true)}
          resizeMode="cover"
        />
      </View>

      {/* Product Details */}
      <View style={styles.detailsContainer}>
        {/* Supplier */}
        {supplier && (
          <Text style={styles.supplierText} numberOfLines={1}>
            {supplier}
          </Text>
        )}

        {/* Product Name */}
        <Text style={styles.productName} numberOfLines={2}>
          {name}
        </Text>

        {/* Variant and Quantity Row */}
        {variant && (
          <View style={styles.variantQuantityRow}>
            <TouchableOpacity
              style={styles.variantContainer}
              onPress={() => onVariantPress?.(id)}
              activeOpacity={0.7}
            >
              <Text style={styles.variantText}>{variant}</Text>
              <Text style={styles.variantArrow}>›</Text>
            </TouchableOpacity>

            {/* Quantity Controls - Simple */}
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={handleQuantityDecrease}
                activeOpacity={0.7}
              >
                <Text style={styles.quantitySymbol}>-</Text>
              </TouchableOpacity>

              <Text style={styles.quantityText}>{quantity}</Text>

              <TouchableOpacity
                style={[
                  styles.quantityButton,
                  quantity >= maxQuantity && styles.quantityButtonDisabled
                ]}
                onPress={handleQuantityIncrease}
                disabled={quantity >= maxQuantity}
                activeOpacity={0.7}
              >
                <Text style={styles.quantitySymbol}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Price Section */}
        <View style={styles.priceSection}>
          <View style={styles.priceContainer}>
            <Text style={styles.currentPrice}>
              {price.toLocaleString('vi-VN')}₫
            </Text>
            {originalPrice && originalPrice > price && (
              <Text style={styles.originalPrice}>
                {originalPrice.toLocaleString('vi-VN')}₫
              </Text>
            )}
          </View>
        </View>

        {/* Total Price */}
        <Text style={styles.totalPrice}>
          {totalPrice.toLocaleString('vi-VN')}₫
        </Text>
      </View>

      {/* Delete Button */}
      {/* <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDeletePress}
        activeOpacity={0.7}
      >
        <Image source={deleteIcon} style={styles.deleteIcon} />
      </TouchableOpacity> */}

      <LoadingOverlay visible={isDeletePending} />
    </View>
  )
}

export default CartItem

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: ifTablet(16, 12),
    paddingHorizontal: ifTablet(16, 12),
    marginBottom: ifTablet(8, 6),
    borderRadius: ifTablet(12, 10),
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  checkboxContainer: {
    width: ifTablet(50, 40),
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  checkboxIcon: {
    width: ifTablet(24, 20),
    height: ifTablet(24, 20),
    tintColor: '#d1d5db',
  },
  checkboxIconSelected: {
    tintColor: Colors.primary,
  },
  imageContainer: {
    marginRight: ifTablet(12, 10),
    marginLeft: ifTablet(0, -10),
  },
  productImage: {
    width: ifTablet(100, 90),
    height: ifTablet(100, 90),
    borderRadius: ifTablet(12, 10),
    backgroundColor: '#f9fafb',
  },
  detailsContainer: {
    flex: 1,
    paddingTop: ifTablet(2, 1),
  },
  supplierText: {
    fontSize: ifTablet(12, 10),
    color: '#6b7280',
    fontFamily: 'Sora-Regular',
    marginBottom: ifTablet(4, 2),
  },
  productName: {
    fontSize: ifTablet(16, 14),
    fontFamily: 'Sora-SemiBold',
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: ifTablet(6, 4),
    lineHeight: ifTablet(22, 20),
  },
  variantQuantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ifTablet(8, 6),
  },
  variantContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: ifTablet(6, 5),
    paddingVertical: ifTablet(3, 2),
    borderRadius: ifTablet(5, 4),
    alignSelf: 'flex-start',
    maxWidth: '70%',
    marginRight: ifTablet(8, 6),
  },
  variantText: {
    fontSize: ifTablet(12, 11),
    color: Colors.textDark,
    fontFamily: 'Sora-Medium',
    fontWeight: '500',
    marginRight: ifTablet(4, 2),
  },
  variantArrow: {
    fontSize: ifTablet(16, 14),
    color: '#9ca3af',
    fontWeight: 'bold',
  },
  priceSection: {
    marginBottom: ifTablet(8, 6),
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentPrice: {
    fontSize: ifTablet(16, 14),
    fontFamily: 'Sora-SemiBold',
    fontWeight: '600',
    color: Colors.primary,
    marginRight: ifTablet(8, 6),
  },
  originalPrice: {
    fontSize: ifTablet(14, 12),
    fontFamily: 'Sora-Regular',
    color: '#9ca3af',
    textDecorationLine: 'line-through',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: ifTablet(6, 5),
    paddingHorizontal: ifTablet(4, 3),
    paddingVertical: ifTablet(2, 2),
  },
  quantityButton: {
    width: ifTablet(24, 20),
    height: ifTablet(24, 20),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  quantityButtonDisabled: {
    opacity: 0.3,
  },
  quantitySymbol: {
    fontSize: ifTablet(14, 12),
    fontWeight: '500',
    color: '#666',
  },
  quantityText: {
    fontSize: ifTablet(12, 11),
    fontWeight: '500',
    color: Colors.textDark,
    textAlign: 'center',
    minWidth: ifTablet(20, 18),
    marginHorizontal: ifTablet(6, 4),
  },
  totalPrice: {
    fontSize: ifTablet(16, 14),
    fontFamily: 'Sora-Bold',
    fontWeight: '700',
    color: Colors.textDark,
    textAlign: 'right',
    marginTop: ifTablet(8, 6),
  },
  deleteButton: {
    position: 'absolute',
    top: ifTablet(8, 6),
    right: ifTablet(8, 6),
    padding: ifTablet(8, 6),
    zIndex: 10,
  },
  deleteIcon: {
    width: ifTablet(20, 16),
    height: ifTablet(20, 16),
    tintColor: '#ef4444',
  },
})