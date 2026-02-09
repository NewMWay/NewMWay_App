import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import { Colors } from '../../../assets/styles/colorStyles'
import { ifTablet } from '../../../utils/responsives/responsive'
import { ChatAIProduct } from '../types/ChatAi.type'
import formatSold from '../../../utils/format/formatSold'

interface ProductAICardProps {
    product: ChatAIProduct
    onPress?: (productId: string) => void
}

const ProductAICard: React.FC<ProductAICardProps> = ({ product, onPress }) => {
    const soldIcon = require('../../../assets/icons/icons8-sold-48.png')

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN').format(price)
    }

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onPress?.(product.id)}
            activeOpacity={0.7}
        >
            {/* Product Image */}
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: product.image }}
                    style={styles.image}
                    resizeMode="cover"
                />
            </View>

            {/* Product Info */}
            <View style={styles.contentContainer}>
                {/* Product Name */}
                <View style={styles.nameContainer}>
                    <Text style={styles.productName} numberOfLines={2}>
                        {product.name}
                    </Text>
                </View>

                {/* Price Section */}
                <View style={styles.priceSection}>
                    {product.old_price > product.price && (
                        <Text
                            ellipsizeMode="tail"
                            numberOfLines={1}
                            style={styles.oldPrice}
                        >
                            {formatPrice(product.old_price)} đ
                        </Text>
                    )}
                    <Text
                        ellipsizeMode="tail"
                        numberOfLines={1}
                        style={styles.currentPrice}
                    >
                        {formatPrice(product.price)} đ
                    </Text>
                </View>

                {/* Bottom indicators - Sold */}
                <View style={styles.bottomIndicators}>
                    {product.sold > 0 && (
                        <View style={styles.soldContainer}>
                            <Image
                                source={soldIcon}
                                style={styles.soldIcon}
                                resizeMode="contain"
                            />
                            <Text style={styles.soldText}>{formatSold(product.sold)}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: ifTablet(180, 150),
        backgroundColor: Colors.textWhite,
        borderRadius: ifTablet(16, 12),
        marginRight: ifTablet(12, 10),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.05)',
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: ifTablet(180, 150),
        backgroundColor: '#F8F9FA',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    contentContainer: {
        padding: ifTablet(14, 12),
        gap: ifTablet(8, 6),
    },
    nameContainer: {
        minHeight: ifTablet(40, 36),
    },
    productName: {
        fontSize: ifTablet(14, 13),
        color: Colors.textDark,
        fontFamily: 'Sora-SemiBold',
        fontWeight: '600',
        lineHeight: ifTablet(20, 18),
    },
    priceSection: {
        gap: ifTablet(4, 3),
    },
    currentPrice: {
        fontSize: ifTablet(18, 16),
        color: 'rgba(238, 77, 45, 1)',
        fontFamily: 'Sora-Bold',
        fontWeight: '700',
    },
    oldPrice: {
        fontSize: ifTablet(14, 12),
        color: '#9CA3AF',
        fontFamily: 'Sora-Regular',
        textDecorationLine: 'line-through',
    },
    bottomIndicators: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    soldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: ifTablet(10, 8),
        paddingVertical: ifTablet(5, 4),
        borderRadius: ifTablet(20, 16),
    },
    soldIcon: {
        width: ifTablet(14, 12),
        height: ifTablet(14, 12),
        marginRight: ifTablet(4, 3),
        tintColor: '#6B7280',
    },
    soldText: {
        fontSize: ifTablet(12, 11),
        color: '#6B7280',
        fontFamily: 'Sora-Medium',
    },
})

export default ProductAICard
