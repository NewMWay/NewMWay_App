import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useMemo } from 'react'
import { Colors } from '../../../assets/styles/colorStyles'
import { ifTablet } from '../../../utils/responsives/responsive'
import { useFavoriteQuery } from '../../favorite/hooks/useFavoriteQuery.hook'
import { useAddFavoriteProduct } from '../../favorite/hooks/useFavoriteMutation.hook'
import { useNavigation } from '@react-navigation/native'
import { HomeStackNavigationProp } from '../../../types/navigation/navigation'

const FavoritesTab = () => {
    const navigation = useNavigation<HomeStackNavigationProp>();
    const {
        data: favoriteData,
        // fetchNextPage,
        // hasNextPage,
        isFetchingNextPage,
        isLoading
    } = useFavoriteQuery({});

    const { mutate: toggleFavorite, isPending: isRemoving } = useAddFavoriteProduct();

    const favorites = useMemo(() => {
        return favoriteData?.pages.flatMap(page => page.items) || []
    }, [favoriteData]);

    const totalCount = favoriteData?.pages[0]?.total || 0;

    const formatCurrency = (amount: number) => {
        if (amount === undefined || amount === null || isNaN(amount)) {
            return '0đ';
        }
        return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
    };

    const handleRemoveFavorite = (productId: string, productName: string) => {
        Alert.alert(
            'Xác nhận',
            `Bạn có chắc muốn bỏ "${productName}" khỏi danh sách yêu thích?`,
            [
                {
                    text: 'Hủy',
                    style: 'cancel',
                },
                {
                    text: 'Xác nhận',
                    style: 'destructive',
                    onPress: () => {
                        toggleFavorite({ productId });
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const handleProductPress = (productId: string) => {
        const parendtNavigation = navigation.getParent();
        if (parendtNavigation) {
            parendtNavigation.navigate('Mua Sắm', {
                screen: 'ProductDetailsScreen',
                params: { productId },
            });
        }
    };

    if (isLoading && favorites.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    if (favorites.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>💔</Text>
                <Text style={styles.emptyText}>Chưa có sản phẩm yêu thích</Text>
                <Text style={styles.emptySubtext}>Hãy thêm sản phẩm bạn yêu thích để xem sau</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sản Phẩm Yêu Thích ({totalCount})</Text>

            <View style={styles.gridContainer}>
                {favorites.map((item, index) => {
                    const isEven = index % 2 === 0;
                    return (
                        <View key={item.id} style={[styles.itemContainer, isEven ? styles.itemLeft : styles.itemRight]}>
                            <TouchableOpacity
                                style={styles.productCard}
                                onPress={() => handleProductPress(item.id)}
                                activeOpacity={0.9}
                            >
                                <View style={styles.imageContainer}>
                                    <Image
                                        source={{ uri: item.thumbnail }}
                                        style={styles.productImage}
                                    />
                                    <TouchableOpacity
                                        style={styles.favoriteButton}
                                        onPress={() => handleRemoveFavorite(item.id, item.name)}
                                        disabled={isRemoving}
                                    >
                                        <Text style={styles.heartIcon}>❤️</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.productInfo}>
                                    <Text style={styles.productName} numberOfLines={2}>
                                        {item.name}
                                    </Text>

                                    <View style={styles.priceContainer}>
                                        <Text style={styles.currentPrice}>{formatCurrency(item.price)}</Text>
                                        {item.oldPrice && item.oldPrice > item.price && (
                                            <Text style={styles.oldPrice}>{formatCurrency(item.oldPrice)}</Text>
                                        )}
                                    </View>

                                    {item.rating ? (
                                        <View style={styles.ratingRow}>
                                            <Text style={styles.starIcon}>⭐</Text>
                                            <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                                            {item.sold ? (
                                                <>
                                                    <Text style={styles.separator}>•</Text>
                                                    <Text style={styles.soldText}>Đã bán {item.sold}</Text>
                                                </>
                                            ) : null}
                                        </View>
                                    ) : null}
                                </View>
                            </TouchableOpacity>
                        </View>
                    );
                })}

                {isFetchingNextPage && (
                    <View style={styles.footerLoader}>
                        <ActivityIndicator size="small" color={Colors.primary} />
                        <Text style={styles.footerText}>Đang tải thêm...</Text>
                    </View>
                )}
            </View>
        </View>
    )
}

export default FavoritesTab

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        paddingHorizontal: ifTablet(20, 12),
        paddingTop: ifTablet(16, 12),
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: ifTablet(40, 32),
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: ifTablet(40, 32),
    },
    emptyIcon: {
        fontSize: ifTablet(80, 60),
        marginBottom: ifTablet(16, 12),
    },
    emptyText: {
        fontSize: ifTablet(18, 16),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
        marginBottom: ifTablet(8, 6),
    },
    emptySubtext: {
        fontSize: ifTablet(14, 12),
        fontFamily: 'Sora-Regular',
        color: Colors.textGray,
        textAlign: 'center',
    },
    title: {
        fontSize: ifTablet(20, 18),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
        marginBottom: ifTablet(16, 12),
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingBottom: ifTablet(24, 16),
    },
    itemContainer: {
        width: '48%',
        marginBottom: ifTablet(12, 8),
    },
    itemLeft: {
        marginTop: 0,
    },
    itemRight: {
        marginTop: ifTablet(60, 40),
    },
    productCard: {
        backgroundColor: Colors.textWhite,
        borderRadius: ifTablet(16, 12),
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: ifTablet(200, 160),
        backgroundColor: Colors.gray + '10',
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    favoriteButton: {
        position: 'absolute',
        top: ifTablet(10, 8),
        right: ifTablet(10, 8),
        backgroundColor: Colors.textWhite,
        width: ifTablet(36, 32),
        height: ifTablet(36, 32),
        borderRadius: ifTablet(18, 16),
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    heartIcon: {
        fontSize: ifTablet(20, 18),
    },
    productInfo: {
        padding: ifTablet(12, 10),
    },
    productName: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-Medium',
        color: Colors.textDark,
        marginBottom: ifTablet(8, 6),
        lineHeight: ifTablet(20, 18),
        minHeight: ifTablet(40, 36),
    },
    priceContainer: {
        marginBottom: ifTablet(6, 4),
    },
    currentPrice: {
        fontSize: ifTablet(16, 15),
        fontFamily: 'Sora-Bold',
        color: Colors.primary,
        marginBottom: ifTablet(2, 1),
    },
    oldPrice: {
        fontSize: ifTablet(13, 12),
        fontFamily: 'Sora-Regular',
        color: Colors.gray,
        textDecorationLine: 'line-through',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ifTablet(4, 3),
    },
    starIcon: {
        fontSize: ifTablet(12, 11),
    },
    ratingText: {
        fontSize: ifTablet(12, 11),
        fontFamily: 'Sora-Medium',
        color: '#F57C00',
    },
    separator: {
        fontSize: ifTablet(12, 11),
        color: Colors.textGray,
    },
    soldText: {
        fontSize: ifTablet(11, 10),
        fontFamily: 'Sora-Regular',
        color: Colors.textGray,
    },
    footerLoader: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: ifTablet(20, 16),
        gap: ifTablet(8, 6),
        marginTop: ifTablet(16, 12),
    },
    footerText: {
        fontSize: ifTablet(13, 12),
        color: Colors.textGray,
        fontFamily: 'Sora-Regular',
    },
})
