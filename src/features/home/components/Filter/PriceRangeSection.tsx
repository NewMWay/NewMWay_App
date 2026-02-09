import React, { useState } from 'react'
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
  TextInput,
  Image
} from 'react-native'
import { Colors } from '../../../../assets/styles/colorStyles'
import { ifTablet } from '../../../../utils/responsives/responsive'

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

interface PriceRangeSectionProps {
  title: string
  priceRange: { min: number; max: number }
  onPriceRangeChange: (range: { min: number; max: number }) => void
  maxPrice?: number
}

const PriceRangeSection: React.FC<PriceRangeSectionProps> = ({
  title,
  priceRange,
  onPriceRangeChange,
  maxPrice = 10000000
}) => {
  const [expanded, setExpanded] = useState(false)
  const [localMinPrice, setLocalMinPrice] = useState(priceRange.min.toString())
  const [localMaxPrice, setLocalMaxPrice] = useState(priceRange.max.toString())
  const rotateAnim = new Animated.Value(expanded ? 1 : 0)
  
  const iconDown = require('../../../../assets/icons/icons8-down-48.png')
  const iconCollapse = require('../../../../assets/icons/icons8-collapse-arrow-48.png')

  const toggleExpand = () => {
    const toValue = expanded ? 0 : 1
    
    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut
      }
    })
    
    Animated.timing(rotateAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true
    }).start()
    
    setExpanded(!expanded)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price)
  }

  const handleApplyPrice = () => {
    const min = Math.max(0, parseInt(localMinPrice.replace(/[^\d]/g, ''), 10) || 0)
    const max = Math.min(maxPrice, parseInt(localMaxPrice.replace(/[^\d]/g, ''), 10) || maxPrice)
    
    onPriceRangeChange({ min, max })
  }

  const handlePresetPrice = (min: number, max: number) => {
    setLocalMinPrice(min.toString())
    setLocalMaxPrice(max.toString())
    onPriceRangeChange({ min, max })
  }

  const isFiltered = priceRange.min > 0 || priceRange.max < maxPrice
  const pricePresets = [
    { label: 'Dưới 500K', min: 0, max: 500000 },
    { label: '500K - 1M', min: 500000, max: 1000000 },
    { label: '1M - 2M', min: 1000000, max: 2000000 },
    { label: 'Trên 2M', min: 2000000, max: maxPrice },
  ]

  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity 
        style={styles.header} 
        onPress={toggleExpand}
        activeOpacity={0.7}
      >
        <Text style={styles.title}>{title}</Text>
        
        <View style={styles.headerRight}>
          {isFiltered && (
            <View style={styles.countBadge}>
              <Text style={styles.countText}>1</Text>
            </View>
          )}
          
          <View style={styles.iconContainer}>
            <Image 
              source={expanded ? iconCollapse : iconDown}
              style={styles.chevronIcon}
              resizeMode="contain"
            />
          </View>
        </View>
      </TouchableOpacity>

      {/* Expandable Content */}
      {expanded && (
        <View style={styles.content}>
          {/* Price Input */}
          <View style={styles.priceInputContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Từ</Text>
              <TextInput
                style={styles.priceInput}
                value={localMinPrice}
                onChangeText={setLocalMinPrice}
                keyboardType="numeric"
                placeholder="0"
              />
              <Text style={styles.currency}>VNĐ</Text>
            </View>
            
            <Text style={styles.separator}>-</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Đến</Text>
              <TextInput
                style={styles.priceInput}
                value={localMaxPrice}
                onChangeText={setLocalMaxPrice}
                keyboardType="numeric"
                placeholder={maxPrice.toString()}
              />
              <Text style={styles.currency}>VNĐ</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.applyButton}
            onPress={handleApplyPrice}
          >
            <Text style={styles.applyButtonText}>Áp dụng</Text>
          </TouchableOpacity>

          {/* Price Presets */}
          <View style={styles.presetsContainer}>
            {pricePresets.map((preset, index) => (
              <TouchableOpacity
                key={index}
                style={styles.presetButton}
                onPress={() => handlePresetPrice(preset.min, preset.max)}
              >
                <Text style={styles.presetText}>{preset.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Current Range Display */}
          {isFiltered && (
            <View style={styles.currentRange}>
              <Text style={styles.currentRangeText}>
                Giá hiện tại: {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)} VNĐ
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  )
}

export default PriceRangeSection

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.textWhite,
    borderRadius: ifTablet(12, 8),
    marginBottom: ifTablet(16, 12),
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: ifTablet(20, 16),
  },
  title: {
    fontSize: ifTablet(18, 16),
    fontFamily: 'Sora-SemiBold',
    color: Colors.textDark,
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ifTablet(12, 8),
  },
  countBadge: {
    backgroundColor: Colors.primary,
    borderRadius: ifTablet(12, 10),
    paddingHorizontal: ifTablet(8, 6),
    paddingVertical: ifTablet(4, 3),
    minWidth: ifTablet(24, 20),
    alignItems: 'center',
  },
  countText: {
    color: Colors.textWhite,
    fontSize: ifTablet(12, 10),
    fontFamily: 'Sora-SemiBold',
  },
  iconContainer: {
    width: ifTablet(24, 20),
    height: ifTablet(24, 20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevronIcon: {
    width: ifTablet(20, 18),
    height: ifTablet(20, 18),
    tintColor: '#666666',
  },
  content: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    padding: ifTablet(20, 16),
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ifTablet(16, 12),
  },
  inputGroup: {
    flex: 1,
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: ifTablet(14, 12),
    fontFamily: 'Sora-Regular',
    color: '#666666',
    marginBottom: ifTablet(4, 2),
  },
  priceInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: ifTablet(8, 6),
    paddingHorizontal: ifTablet(12, 8),
    paddingVertical: ifTablet(8, 6),
    fontSize: ifTablet(16, 14),
    fontFamily: 'Sora-Regular',
    textAlign: 'center',
    minWidth: ifTablet(80, 70),
  },
  currency: {
    fontSize: ifTablet(12, 10),
    fontFamily: 'Sora-Regular',
    color: '#666666',
    marginTop: ifTablet(4, 2),
  },
  separator: {
    fontSize: ifTablet(16, 14),
    fontFamily: 'Sora-Regular',
    color: '#666666',
    marginHorizontal: ifTablet(12, 8),
  },
  applyButton: {
    backgroundColor: Colors.primary,
    borderRadius: ifTablet(8, 6),
    paddingVertical: ifTablet(12, 8),
    alignItems: 'center',
    marginBottom: ifTablet(16, 12),
  },
  applyButtonText: {
    color: Colors.textWhite,
    fontSize: ifTablet(16, 14),
    fontFamily: 'Sora-SemiBold',
  },
  presetsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ifTablet(8, 6),
    marginBottom: ifTablet(12, 8),
  },
  presetButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: ifTablet(20, 16),
    paddingHorizontal: ifTablet(16, 12),
    paddingVertical: ifTablet(8, 6),
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  presetText: {
    fontSize: ifTablet(14, 12),
    fontFamily: 'Sora-Regular',
    color: Colors.textDark,
  },
  currentRange: {
    backgroundColor: 'rgba(165, 96, 62, 0.1)',
    borderRadius: ifTablet(8, 6),
    padding: ifTablet(12, 8),
  },
  currentRangeText: {
    fontSize: ifTablet(14, 12),
    fontFamily: 'Sora-SemiBold',
    color: Colors.primary,
    textAlign: 'center',
  },
})