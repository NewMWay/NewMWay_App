import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { ifTablet } from '../../../utils/responsives/responsive';
import { Colors } from '../../../assets/styles/colorStyles';
interface CartConfirmProps {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    quantity: number;
    supplier?: string;
    variant?: string;
    totalPrice?: number;
}
const CartConfirm: React.FC<CartConfirmProps> = (
    {
        name,
        price,
        originalPrice,
        image,
        quantity,
        supplier,
        variant,
        totalPrice,
    }
) => {
    const [imageError, setImageError] = useState(false);

    return (
        <View style={styles.container}>
            <View style={styles.cardContent}>
                {/* Left: Product Image */}
                <View style={styles.imageWrapper}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={imageError ? require('../../../assets/images/logo/LOGO-NEW-WAY-TEAK-WOOD-02.png') : { uri: image }}
                            style={styles.productImage}
                            onError={() => setImageError(true)}
                            resizeMode="cover"
                        />
                    </View>
                    <View style={styles.quantityBadge}>
                        <Text style={styles.quantityBadgeText}>{quantity}</Text>
                    </View>
                </View>

                {/* Right: Product Info */}
                <View style={styles.infoContainer}>
                    {/* Product Header */}
                    <View style={styles.productHeader}>
                        {supplier && (
                            <Text style={styles.supplierText} numberOfLines={1}>
                                {supplier}
                            </Text>
                        )}
                        <Text style={styles.productName} numberOfLines={2}>
                            {name}
                        </Text>
                    </View>

                    {/* Variant Info */}
                    {variant && (
                        <View style={styles.variantSection}>
                            <Text style={styles.variantText}>{variant}</Text>
                        </View>
                    )}

                    {/* Price Section */}
                    <View style={styles.priceSection}>
                        <View style={styles.priceRow}>
                            <Text style={styles.unitPriceText}>
                                {price.toLocaleString('vi-VN')}₫
                            </Text>
                            {originalPrice && originalPrice > price && (
                                <Text style={styles.originalPrice}>
                                    {originalPrice.toLocaleString('vi-VN')}₫
                                </Text>
                            )}
                        </View>
                        
                        <Text style={styles.totalPrice}>
                            {totalPrice ? totalPrice.toLocaleString('vi-VN') + '₫' : (price * quantity).toLocaleString('vi-VN') + '₫'}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default CartConfirm

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
    cardContent: {
        flexDirection: 'row',
        padding: ifTablet(24, 20),
        alignItems: 'flex-start',
    },
    imageWrapper: {
        marginRight: ifTablet(20, 16),
        position: 'relative',
    },
    imageContainer: {
        borderRadius: ifTablet(20, 16),
        backgroundColor: '#f8fafc',
        padding: ifTablet(4, 3),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    productImage: {
        width: ifTablet(100, 100),
        height: ifTablet(100, 100),
        borderRadius: ifTablet(16, 12),
    },
    quantityBadge: {
        position: 'absolute',
        top: ifTablet(-8, -6),
        right: ifTablet(-8, -6),
        backgroundColor: Colors.primary,
        borderRadius: ifTablet(12, 10),
        minWidth: ifTablet(24, 20),
        height: ifTablet(24, 20),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
    quantityBadgeText: {
        color: 'white',
        fontSize: ifTablet(12, 10),
        fontFamily: 'Sora-Bold',
        fontWeight: '700',
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    productHeader: {
        marginBottom: ifTablet(12, 10),
    },
    supplierText: {
        fontSize: ifTablet(12, 11),
        color: '#64748b',
        fontFamily: 'Sora-Regular',
        marginBottom: ifTablet(4, 3),
    },
    productName: {
        fontSize: ifTablet(18, 16),
        fontFamily: 'Sora-Bold',
        fontWeight: '700',
        color: Colors.textDark,
        lineHeight: ifTablet(25, 23),
    },
    variantSection: {
        backgroundColor: '#f1f5f9',
        paddingHorizontal: ifTablet(12, 10),
        paddingVertical: ifTablet(8, 6),
        borderRadius: ifTablet(12, 10),
        alignSelf: 'flex-start',
        marginBottom: ifTablet(16, 12),
        borderLeftWidth: 3,
        borderLeftColor: Colors.primary,
    },
    variantText: {
        fontSize: ifTablet(13, 12),
        color: Colors.textDark,
        fontFamily: 'Sora-Medium',
        fontWeight: '500',
    },
    priceSection: {
        marginTop: 'auto',
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: ifTablet(8, 6),
    },
    unitPriceText: {
        fontSize: ifTablet(15, 13),
        fontFamily: 'Sora-SemiBold',
        fontWeight: '600',
        color: '#64748b',
        marginRight: ifTablet(12, 8),
    },
    originalPrice: {
        fontSize: ifTablet(13, 11),
        fontFamily: 'Sora-Regular',
        color: '#94a3b8',
        textDecorationLine: 'line-through',
    },
    totalPrice: {
        fontSize: ifTablet(20, 18),
        fontFamily: 'Sora-Bold',
        fontWeight: '700',
        color: Colors.primary,
    },
})