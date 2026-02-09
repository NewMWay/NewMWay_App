/* eslint-disable @typescript-eslint/no-unused-vars */

import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { ifTablet } from '../../../utils/responsives/responsive'
import { Colors } from '../../../assets/styles/colorStyles'

interface BottomActionBarProps {
    onConsultation?: () => void;
    onAddToCart?: () => void;
    onBuyNow?: () => void;
    onFavorite?: () => void;
    price?: number;
    isAvailable?: boolean;
    isFavorite?: boolean;
    isLoading?: boolean;
}

const BottomActionBar = ({
    onConsultation,
    onAddToCart,
    onBuyNow,
    onFavorite,
    price,
    isAvailable = true,
    isFavorite = false,
    isLoading = false
}: BottomActionBarProps) => {
    const chatIcon = require('../../../assets/icons/icons8-chat-48.png');
    const cartIcon = require('../../../assets/icons/icons8-cart-48-3.png');

    return (
        <View style={styles.container}>
            {/* Background blur effect */}
            <View style={styles.blurBackground} />

            {/* Main content */}
            <View style={styles.contentContainer}>
                {/* Left side - Action buttons */}
                <View style={styles.leftSection}>
                    {/* Favorite Button */}
                    {/* <TouchableOpacity
                        style={[
                            styles.favoriteButton,
                            isFavorite && styles.favoriteButtonActive
                        ]}
                        onPress={onFavorite}
                        activeOpacity={0.8}
                    >
                        <View style={styles.iconContainer}>
                            <Image source={heartIcon} style={[
                                styles.favoriteIcon,
                                isFavorite && styles.favoriteIconActive
                            ]} />
                        </View>
                        <Text style={[
                            styles.favoriteText,
                            isFavorite && styles.favoriteTextActive
                        ]}>
                            {isFavorite ? 'Bỏ thích' : 'Yêu thích'}
                        </Text>
                    </TouchableOpacity> */}

                    {/* Consultation Button */}
                    {/* <TouchableOpacity
                        style={styles.consultationButton}
                        onPress={onConsultation}
                        activeOpacity={0.8}
                        disabled={!isAvailable}
                    >
                        <View style={styles.iconContainer}>
                            <Image source={chatIcon} style={styles.consultationIcon} />
                        </View>
                        <Text style={styles.consultationText}>Tư vấn</Text>
                    </TouchableOpacity> */}

                    {/* Add to Cart Button */}
                    <TouchableOpacity
                        style={[
                            styles.addToCartButton,
                            (!isAvailable || isLoading) && styles.disabledButton
                        ]}
                        onPress={onAddToCart}
                        activeOpacity={0.8}
                        disabled={!isAvailable || isLoading}
                    >
                        <View style={styles.iconContainer}>
                            <Image source={cartIcon} style={[
                                styles.addToCartIcon,
                                (!isAvailable || isLoading) && styles.disabledIcon
                            ]} />
                        </View>
                        <Text style={[
                            styles.addToCartText,
                            (!isAvailable || isLoading) && styles.disabledText
                        ]}>
                            {isLoading ? 'Đang thêm...' : 'Thêm giỏ hàng'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Right side - Buy Now with Price */}
                <View style={styles.rightSection}>
                    {/* Buy Now Button with Price */}
                    <TouchableOpacity
                        style={[
                            styles.buyNowButton,
                            (!isAvailable || isLoading) && styles.buyNowDisabled
                        ]}
                        onPress={onBuyNow}
                        activeOpacity={0.8}
                        disabled={!isAvailable || isLoading}
                    >
                        <View style={styles.buyNowContent}>
                            <View style={styles.buyNowTextContainer}>
                                <Text style={[
                                    styles.buyNowText,
                                    (!isAvailable || isLoading) && styles.buyNowTextDisabled
                                ]}>
                                    {isLoading ? 'Đang xử lý...' : (isAvailable ? 'Mua ngay' : 'Hết hàng')}
                                </Text>
                                {isAvailable && !isLoading && (
                                    <Text style={styles.priceInButton}>
                                        {price ? `${price.toLocaleString('vi-VN')}₫` : 'Liên hệ'}
                                    </Text>
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default BottomActionBar

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: ifTablet(100, 85),
    },
    blurBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: ifTablet(16, 12),
        paddingTop: ifTablet(12, 10),
        paddingBottom: Platform.OS === 'ios' ? ifTablet(24, 20) : ifTablet(12, 10),
        borderTopWidth: 0.5,
        borderTopColor: 'rgba(238, 77, 45, 0.2)',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 15,
    },
    leftSection: {
        // flexDirection: 'row',
        alignItems: 'center',
        gap: 0,
    },
    rightSection: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    favoriteButton: {
        width: ifTablet(100, 68),
        height: ifTablet(55, 48),
        backgroundColor: '#059669',
        borderTopLeftRadius: ifTablet(16, 14),
        borderBottomLeftRadius: ifTablet(16, 14),
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        borderWidth: 1,
        borderRightWidth: 0.5,
        borderColor: '#047857',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#059669',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
    },
    favoriteButtonActive: {
        backgroundColor: '#047857',
        borderColor: '#065f46',
    },
    favoriteIcon: {
        width: ifTablet(20, 18),
        height: ifTablet(20, 18),
        tintColor: 'white',
    },
    favoriteIconActive: {
        tintColor: '#E53E3E',
    },
    favoriteText: {
        fontSize: ifTablet(10, 9),
        fontFamily: 'Sora-SemiBold',
        fontWeight: '600',
        color: 'white',
    },
    favoriteTextActive: {
        color: '#E53E3E',
    },
    consultationButton: {
        width: ifTablet(70, 60),
        height: ifTablet(55, 48),
        backgroundColor: '#059669',
        borderRadius: 0,
        borderWidth: 1.5,
        borderLeftWidth: 0.5,
        borderRightWidth: 0.5,
        borderColor: '#047857',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#059669',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    iconContainer: {
        marginBottom: ifTablet(2, 1),
    },
    consultationIcon: {
        width: ifTablet(20, 18),
        height: ifTablet(20, 18),
        tintColor: 'white',
    },
    consultationText: {
        fontSize: ifTablet(10, 9),
        fontFamily: 'Sora-SemiBold',
        fontWeight: '600',
        color: 'white',


    },
    addToCartButton: {
        width: ifTablet(400, 160),
        height: ifTablet(55, 48),
        backgroundColor: '#059669',
        borderRadius: ifTablet(16, 8),
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#047857',
        shadowColor: '#059669',
        shadowOpacity: 0.15,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowRadius: 6,
        elevation: 4,
        borderWidth: 0.5,
    },
    addToCartIcon: {
        width: ifTablet(22, 20),
        height: ifTablet(22, 20),
        tintColor: 'white',
    },
    addToCartText: {
        fontSize: ifTablet(10, 9),
        fontFamily: 'Sora-SemiBold',
        fontWeight: '600',
        color: 'white',
    },
    buyNowButton: {
        width: ifTablet(400, 160),
        height: ifTablet(55, 48),
        backgroundColor: Colors.primary,
        borderRadius: ifTablet(16, 8),
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        borderWidth: 0.5,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    buyNowContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    buyNowTextContainer: {
        alignItems: 'center',
        marginRight: ifTablet(8, 6),
    },
    buyNowText: {
        fontSize: ifTablet(13, 11),
        fontFamily: 'Sora-Bold',
        fontWeight: '700',
        color: 'white',
        marginBottom: ifTablet(2, 1),
    },
    priceInButton: {
        fontSize: ifTablet(12, 10),
        fontFamily: 'Sora-SemiBold',
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.9)',
    },
    buyNowArrow: {
        width: ifTablet(20, 18),
        height: ifTablet(20, 18),
        borderRadius: ifTablet(10, 9),
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: ifTablet(12, 10),
    },
    arrowText: {
        fontSize: ifTablet(12, 10),
        color: 'white',
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: 'rgba(156, 163, 175, 0.3)',
        borderColor: 'rgba(156, 163, 175, 0.5)',
    },
    disabledIcon: {
        tintColor: '#9CA3AF',
    },
    disabledText: {
        color: '#9CA3AF',
    },
    buyNowDisabled: {
        backgroundColor: Colors.gray,
        shadowOpacity: 0,
        elevation: 0,
    },
    buyNowTextDisabled: {
        color: 'white',
        marginRight: 0,
    },
})