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
  Image,
  ScrollView
} from 'react-native'
import { Colors } from '../../../../assets/styles/colorStyles'
import { ifTablet } from '../../../../utils/responsives/responsive'

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

export interface FilterOption {
  id: string
  name: string
  quantityProduct?: number // Optional quantity for display
}

interface FilterSectionProps {
  title: string
  data: FilterOption[]
  selectedItems: string[]
  onSelectionChange: (selectedIds: string[]) => void
  multiSelect?: boolean // Default true
  showQuantity?: boolean // Show quantity badge
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  data,
  selectedItems,
  onSelectionChange,
  multiSelect = true,
  showQuantity = true
}) => {
  const [expanded, setExpanded] = useState(false)
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

  const handleItemPress = (itemId: string) => {
    if (multiSelect) {
      const newSelection = selectedItems.includes(itemId)
        ? selectedItems.filter(id => id !== itemId)
        : [...selectedItems, itemId]
      onSelectionChange(newSelection)
    } else {
      // Single select
      const newSelection = selectedItems.includes(itemId) ? [] : [itemId]
      onSelectionChange(newSelection)
    }
  }

  const selectedCount = selectedItems.length

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
          {showQuantity && selectedCount > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{selectedCount}</Text>
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
          <ScrollView 
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            contentContainerStyle={styles.scrollContentContainer}
          >
            {data.map((item) => {
              const isSelected = selectedItems.includes(item.id)

              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.option,
                    isSelected && styles.optionSelected
                  ]}
                  onPress={() => handleItemPress(item.id)}
                  activeOpacity={0.6}
                >
                  <View style={styles.optionContent}>
                    <Text style={[
                      styles.optionText,
                      isSelected && styles.optionTextSelected
                    ]}>
                      {item.name}
                    </Text>

                    {item.quantityProduct !== undefined && (
                      <Text style={[
                        styles.optionCount,
                        isSelected && styles.optionCountSelected
                      ]}>
                        ({item.quantityProduct})
                      </Text>
                    )}
                  </View>

                  <View style={[
                    styles.checkbox,
                    isSelected && styles.checkboxSelected
                  ]}>
                    {isSelected && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>
      )}
    </View>
  )
}

export default FilterSection

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
    paddingTop: ifTablet(12, 8),
    paddingBottom: ifTablet(8, 6),
  },
  scrollContainer: {
    maxHeight: ifTablet(250, 200), // Limit height to enable scrolling
  },
  scrollContentContainer: {
    paddingBottom: ifTablet(4, 2),
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: ifTablet(20, 16),
    paddingVertical: ifTablet(12, 10),
    marginHorizontal: ifTablet(8, 6),
    marginVertical: ifTablet(2, 1),
    borderRadius: ifTablet(8, 6),
  },
  optionSelected: {
    backgroundColor: 'rgba(165, 96, 62, 0.1)',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionText: {
    fontSize: ifTablet(16, 14),
    fontFamily: 'Sora-Regular',
    color: Colors.textDark,
    marginRight: ifTablet(8, 6),
  },
  optionTextSelected: {
    color: Colors.primary,
    fontFamily: 'Sora-SemiBold',
  },
  optionCount: {
    fontSize: ifTablet(14, 12),
    fontFamily: 'Sora-Regular',
    color: '#666666',
  },
  optionCountSelected: {
    color: Colors.primary,
  },
  checkbox: {
    width: ifTablet(20, 18),
    height: ifTablet(20, 18),
    borderRadius: ifTablet(4, 3),
    borderWidth: 2,
    borderColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkmark: {
    color: Colors.textWhite,
    fontSize: ifTablet(12, 10),
    fontWeight: 'bold',
  },
})