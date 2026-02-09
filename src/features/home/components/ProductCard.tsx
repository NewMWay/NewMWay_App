import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native'
import React from 'react'
import { Colors } from '../../../assets/styles/colorStyles'
import { ifTablet } from '../../../utils/responsives/responsive'
import formatSold from '../../../utils/format/formatSold'
import { ProductType } from '../../shop/types/product.type'

const { width } = Dimensions.get('window')
const CARD_WIDTH = (width - 48) / 2 // 48 = padding horizontal + gap


export interface ProductCardProps {
    product: ProductType
    onPress?: (product: ProductType) => void
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
    const starIcon = require('../../../assets/icons/icons8-star-48.png');
    const fireIcon = require('../../../assets/icons/icons8-fire-48.png');
    const soldIcon = require('../../../assets/icons/icons8-sold-48.png');

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN').format(price)
    }


    const handlePress = () => {
        onPress?.(product)
    }

    return (
        <TouchableOpacity style={styles.container} onPress={handlePress}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: product.thumbnail }} style={styles.image} />
            </View>

            <View style={styles.contentContainer}>
                {/* Product Name */}
                <View style={styles.topContent}>
                    <View style={styles.nameContainer}>
                        <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                    </View>
                </View>

                {/* Price Section */}
                <View style={styles.priceSection}>
                    {product.oldPrice && (
                        <Text
                            ellipsizeMode="tail"
                            numberOfLines={1}
                            style={styles.oldPrice}>{formatPrice(product.oldPrice)} đ</Text>
                    )}
                    <Text
                        ellipsizeMode="tail"
                        numberOfLines={1}
                        style={styles.currentPrice}>{formatPrice(product.price)} đ</Text>
                </View>

                {/* Bottom indicators - Hot, Rating, Sold */}
                <View style={styles.bottomIndicators}>
                    <View style={styles.leftIndicators}>
                        {product.isHot && (
                            <View style={styles.hotContainer}>
                                <Image
                                    source={fireIcon}
                                    style={styles.hotIcon}
                                    resizeMode="contain"
                                />
                                <Text style={styles.hotText}>Hot</Text>
                            </View>
                        )}
                        {product.rating ? (
                            <View style={styles.ratingContainer}>
                                <Image
                                    source={starIcon}
                                    style={styles.ratingIcon}
                                    resizeMode="contain"
                                />
                                <Text style={styles.rating}>{product.rating.toFixed(1)}</Text>
                            </View>
                        ) : (
                            <View style={styles.placeholderContainer} />
                        )}

                        {product.sold ? (
                            <View style={styles.soldContainer}>
                                <Image
                                    source={soldIcon}
                                    style={styles.soldIcon}
                                    resizeMode="contain"
                                />
                                <Text style={styles.soldText}>{formatSold(product.sold)}</Text>
                            </View>
                        ) : (
                            <View style={styles.placeholderContainer} />
                        )}
                    </View>

                </View>
            </View>
        </TouchableOpacity>
    )
}

export default ProductCard

const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        height: ifTablet(400, 320),
        backgroundColor: Colors.textWhite,
        borderRadius: ifTablet(16, 8),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: ifTablet(20, 16),
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: ifTablet(250, 180),
        borderTopLeftRadius: ifTablet(16, 8),
        borderTopRightRadius: ifTablet(16, 8),
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 193, 7, 0.1)',
        paddingHorizontal: ifTablet(8, 6),
        paddingVertical: ifTablet(4, 3),
        borderRadius: ifTablet(12, 8),
        borderWidth: 1,
        borderColor: 'rgba(255, 193, 7, 0.3)',
    },
    ratingIcon: {
        width: ifTablet(14, 12),
        height: ifTablet(14, 12),
        marginRight: ifTablet(4, 3),
    },
    rating: {
        color: '#F57C00',
        fontSize: ifTablet(12, 10),
        fontFamily: 'Sora-SemiBold',
    },

    contentContainer: {
        flex: 1,
        padding: ifTablet(16, 12),
        justifyContent: 'space-between',
    },
    categoryText: {
        fontSize: ifTablet(14, 12),
        color: Colors.gray,
        fontFamily: 'Sora-Regular',
        marginBottom: ifTablet(4, 2),
    },
    productName: {
        fontSize: ifTablet(16, 14),
        color: Colors.textDark,
        fontFamily: 'Sora-SemiBold',
        fontWeight: '600',
        lineHeight: ifTablet(20, 18),
        flex: 1,
    },
    topContent: {
        flex: 1,
        justifyContent: 'flex-start',
    },

    priceSection: {
        marginBottom: ifTablet(12, 8),
    },
    bottomIndicators: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: ifTablet(28, 24), // Fixed height để đảm bảo đồng đều
    },
    leftIndicators: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: ifTablet(8, 6), // Khoảng cách giữa các indicators
    },
    currentPrice: {
        fontSize: ifTablet(18, 16),
        color: 'rgba(238, 77, 45, 1)',
        fontFamily: 'Sora-Bold',
        fontWeight: '700',
    },
    oldPrice: {
        fontSize: ifTablet(14, 12),
        color: Colors.gray,
        fontFamily: 'Sora-Regular',
        textDecorationLine: 'line-through',
        marginTop: ifTablet(2, 1),
    },
    soldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(108, 117, 125, 0.1)',
        paddingHorizontal: ifTablet(8, 6),
        paddingVertical: ifTablet(4, 3),
        borderRadius: ifTablet(12, 8),
        borderWidth: 1,
        borderColor: 'rgba(108, 117, 125, 0.3)',
    },
    soldIcon: {
        width: ifTablet(14, 12),
        height: ifTablet(14, 12),
        marginRight: ifTablet(4, 3),
    },
    soldText: {
        fontSize: ifTablet(12, 10),
        color: '#6C757D',
        fontFamily: 'Sora-Regular',
    },
    placeholderContainer: {
        height: ifTablet(28, 24), // Same height as other indicators
        width: 1, // Minimal width
        opacity: 0, // Invisible but takes up space
    },
    nameContainer: {
        flex: 1,
        marginBottom: ifTablet(8, 6),
    },
    hotContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(238, 77, 45, 0.1)',
        paddingHorizontal: ifTablet(8, 6),
        paddingVertical: ifTablet(4, 3),
        borderRadius: ifTablet(12, 8),
        borderWidth: 1,
        borderColor: 'rgba(238, 77, 45, 0.3)',
    },
    hotIcon: {
        width: ifTablet(14, 12),
        height: ifTablet(14, 12),
        marginRight: ifTablet(4, 3),
    },
    hotText: {
        color: 'rgba(238, 77, 45, 1)',
        fontSize: ifTablet(12, 10),
        fontFamily: 'Sora-SemiBold',
    },

})