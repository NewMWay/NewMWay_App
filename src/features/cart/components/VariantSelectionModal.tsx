import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Image, ScrollView } from 'react-native';
import { Colors } from '../../../assets/styles/colorStyles';
import { ifTablet } from '../../../utils/responsives/responsive';
import { CartItem, ProductOptionValueStock } from '../types/cart.type';

interface VariantSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  cartItem: CartItem | null;
  onConfirm: (selectedVariantId: string, selectedOptionStockId: string) => void;
}

const VariantSelectionModal: React.FC<VariantSelectionModalProps> = ({
  visible,
  onClose,
  cartItem,
  onConfirm
}) => {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [selectedOptionStockId, setSelectedOptionStockId] = useState<string | null>(null);

  React.useEffect(() => {
    if (cartItem && visible) {
      // Find currently selected variant and option
      const currentVariant = cartItem.variants.find(v =>
        v.productOptionValueStocks.some(opt => opt.isSelected)
      );
      
      if (currentVariant) {
        setSelectedVariantId(currentVariant.productVariantId);
        
        const selectedOption = currentVariant.productOptionValueStocks.find(opt => opt.isSelected);
        if (selectedOption) {
          setSelectedOptionStockId(selectedOption.productVariantOptionValueStockId);
        }
      }
    }
  }, [cartItem, visible]);

  if (!cartItem) return null;

  const handleVariantSelect = (variantId: string) => {
    setSelectedVariantId(variantId);
    // Auto select first option of this variant
    const variant = cartItem.variants.find(v => v.productVariantId === variantId);
    if (variant && variant.productOptionValueStocks.length > 0) {
      setSelectedOptionStockId(variant.productOptionValueStocks[0].productVariantOptionValueStockId);
    }
  };

  const handleOptionSelect = (optionStockId: string) => {
    setSelectedOptionStockId(optionStockId);
  };

  const handleConfirm = () => {
    if (selectedVariantId && selectedOptionStockId) {
      console.log('Selected Variant ID:', selectedVariantId);
      console.log('Selected Option Stock ID:', selectedOptionStockId);
      onConfirm(selectedVariantId, selectedOptionStockId);
      onClose();
    }
  };

  const selectedVariant = cartItem.variants.find(v => v.productVariantId === selectedVariantId);

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          onPress={onClose}
          activeOpacity={1}
        />
        
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.dragIndicator} />
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Product Info */}
          <View style={styles.productInfo}>
            <Image
              source={{ uri: selectedVariant?.productImageUrl || cartItem.variants[0]?.productImageUrl }}
              style={styles.productImage}
              resizeMode="cover"
            />
            <View style={styles.productDetails}>
              <Text style={styles.productPrice}>
                {(selectedVariant?.unitPrice || cartItem.variants[0]?.unitPrice)?.toLocaleString('vi-VN')}₫
              </Text>
              <Text style={styles.productStock}>Kho: {cartItem.quantity}</Text>
            </View>
          </View>

          <ScrollView
            style={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Variants Section */}
            {cartItem.variants.length > 1 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Phân loại</Text>
                <View style={styles.optionsContainer}>
                  {cartItem.variants.map((variant) => {
                    const isSelected = selectedVariantId === variant.productVariantId;
                    return (
                      <TouchableOpacity
                        key={variant.productVariantId}
                        style={[
                          styles.optionButton,
                          isSelected && styles.optionButtonSelected
                        ]}
                        onPress={() => handleVariantSelect(variant.productVariantId)}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            isSelected && styles.optionTextSelected
                          ]}
                        >
                          {variant.productVariantName}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Options Section - Group by optionName */}
            {selectedVariant && selectedVariant.productOptionValueStocks.length > 0 && (
              <>
                {(() => {
                  // Group options by optionName
                  const groupedOptions: { [key: string]: ProductOptionValueStock[] } = {};
                  
                  selectedVariant.productOptionValueStocks.forEach(opt => {
                    // Only show options with optionValueId (skip null options)
                    if (opt.optionValueId) {
                      if (!groupedOptions[opt.optionName]) {
                        groupedOptions[opt.optionName] = [];
                      }
                      groupedOptions[opt.optionName].push(opt);
                    }
                  });

                  return Object.keys(groupedOptions).map(optionName => (
                    <View key={optionName} style={styles.section}>
                      <Text style={styles.sectionTitle}>{optionName}</Text>
                      <View style={styles.optionsContainer}>
                        {groupedOptions[optionName].map((option) => {
                          const isSelected = selectedOptionStockId === option.productVariantOptionValueStockId;
                          return (
                            <TouchableOpacity
                              key={option.productVariantOptionValueStockId}
                              style={[
                                styles.optionButton,
                                isSelected && styles.optionButtonSelected
                              ]}
                              onPress={() => handleOptionSelect(option.productVariantOptionValueStockId)}
                            >
                              <Text
                                style={[
                                  styles.optionText,
                                  isSelected && styles.optionTextSelected
                                ]}
                              >
                                {option.optionValueName}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                  ));
                })()}
              </>
            )}

            {/* Quantity Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Số lượng</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity style={styles.quantityButton}>
                  <Text style={styles.quantitySymbol}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{cartItem.quantity}</Text>
                <TouchableOpacity style={styles.quantityButton}>
                  <Text style={styles.quantitySymbol}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* Confirm Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.confirmButton,
                (!selectedVariantId || !selectedOptionStockId) && styles.confirmButtonDisabled
              ]}
              onPress={handleConfirm}
              disabled={!selectedVariantId || !selectedOptionStockId}
            >
              <Text style={styles.confirmButtonText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default VariantSelectionModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  overlayTouchable: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: ifTablet(24, 20),
    borderTopRightRadius: ifTablet(24, 20),
    maxHeight: '80%',
    paddingBottom: ifTablet(20, 16),
  },
  header: {
    alignItems: 'center',
    paddingTop: ifTablet(12, 10),
    paddingBottom: ifTablet(8, 6),
    position: 'relative',
  },
  dragIndicator: {
    width: ifTablet(50, 40),
    height: ifTablet(5, 4),
    backgroundColor: '#E0E0E0',
    borderRadius: ifTablet(3, 2),
  },
  closeButton: {
    position: 'absolute',
    right: ifTablet(20, 16),
    top: ifTablet(12, 10),
    padding: ifTablet(8, 6),
  },
  closeText: {
    fontSize: ifTablet(24, 20),
    color: '#9ca3af',
    fontWeight: '300',
  },
  productInfo: {
    flexDirection: 'row',
    padding: ifTablet(20, 16),
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  productImage: {
    width: ifTablet(80, 70),
    height: ifTablet(80, 70),
    borderRadius: ifTablet(12, 10),
    backgroundColor: '#f9fafb',
  },
  productDetails: {
    marginLeft: ifTablet(16, 12),
    justifyContent: 'center',
  },
  productPrice: {
    fontSize: ifTablet(20, 18),
    fontFamily: 'Sora-Bold',
    color: Colors.primary,
    marginBottom: ifTablet(6, 4),
  },
  productStock: {
    fontSize: ifTablet(14, 12),
    fontFamily: 'Sora-Regular',
    color: '#6b7280',
  },
  scrollContent: {
    paddingHorizontal: ifTablet(20, 16),
  },
  section: {
    marginTop: ifTablet(20, 16),
  },
  sectionTitle: {
    fontSize: ifTablet(16, 14),
    fontFamily: 'Sora-SemiBold',
    color: Colors.textDark,
    marginBottom: ifTablet(12, 10),
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ifTablet(10, 8),
  },
  optionButton: {
    paddingHorizontal: ifTablet(20, 16),
    paddingVertical: ifTablet(10, 8),
    borderRadius: ifTablet(8, 6),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  optionButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.priceBackground,
  },
  optionText: {
    fontSize: ifTablet(14, 12),
    fontFamily: 'Sora-Regular',
    color: Colors.textDark,
  },
  optionTextSelected: {
    fontFamily: 'Sora-SemiBold',
    color: Colors.primary,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#f8f9fa',
    borderRadius: ifTablet(8, 6),
    paddingHorizontal: ifTablet(8, 6),
    paddingVertical: ifTablet(4, 3),
  },
  quantityButton: {
    width: ifTablet(32, 28),
    height: ifTablet(32, 28),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  quantitySymbol: {
    fontSize: ifTablet(18, 16),
    fontWeight: '500',
    color: '#666',
  },
  quantityText: {
    fontSize: ifTablet(16, 14),
    fontWeight: '500',
    color: Colors.textDark,
    textAlign: 'center',
    minWidth: ifTablet(40, 35),
    marginHorizontal: ifTablet(8, 6),
  },
  footer: {
    paddingHorizontal: ifTablet(20, 16),
    paddingTop: ifTablet(16, 12),
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    paddingVertical: ifTablet(16, 14),
    borderRadius: ifTablet(12, 10),
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#cccccc',
    opacity: 0.6,
  },
  confirmButtonText: {
    fontSize: ifTablet(16, 14),
    fontFamily: 'Sora-SemiBold',
    color: '#FFFFFF',
  },
});
