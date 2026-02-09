import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader'
import { ShoppingStackNavigationProp } from '../../../types/navigation/navigation'
import { Colors } from '../../../assets/styles/colorStyles'
import { ifTablet } from '../../../utils/responsives/responsive'
import { useProductReviewQuery } from '../hooks/useProductQuery.hook'
import RatingPreview from '../components/RatingPreview'
import { MediaType } from '../types/media.enum'
import { useAuthStore } from '../../../stores/authStore.zustand'
import ImageZoomView from '../../../components/common/ModalView/ImageZoomView'

const AllReviewsScreen = () => {
    const navigation = useNavigation<ShoppingStackNavigationProp>()
    const route = useRoute()
    const { productId } = route.params as { productId: string; productName: string }
    const starIcon = require('../../../assets/icons/icons8-star-48.png');
    const userProfile = useAuthStore((state) => state.userProfile);
    const currentUserId = userProfile?.id;
    const [zoomImage, setZoomImage] = React.useState<string | null>(null);
    const [zoomType, setZoomType] = React.useState<'image' | 'video'>('image');
    const {
        data: productReviewsData,
        isLoading: isProductReviewsLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useProductReviewQuery({
        productId: productId,
    })

    const productReviews = React.useMemo(() => {
        if (!productReviewsData?.pages) return []
        return productReviewsData.pages.flatMap(page => page.items)
    }, [productReviewsData])

    const productRatings = React.useMemo(() => {
        const normalizedReviews = productReviews.map(review => {
            // Chuẩn hóa media type từ backend
            const normalizedMedia = review.media && review.media.length > 0
                ? review.media.map(m => ({
                    id: m.id,
                    url: m.url,
                    type: m.type || MediaType.Image
                }))
                : [];

            return {
                ...review,
                media: normalizedMedia
            }
        });

        // Sắp xếp: review của user hiện tại lên đầu
        return normalizedReviews.sort((a, b) => {
            if (a.userId === currentUserId) return -1;
            if (b.userId === currentUserId) return 1;
            return 0;
        });
    }, [productReviews, currentUserId])


    const ratingStats = React.useMemo(() => {
        const stats = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        productReviews.forEach(review => {
            stats[review.rating as keyof typeof stats]++
        })
        return stats
    }, [productReviews])

    const totalReviews = productReviews.length
    const averageRating = totalReviews > 0
        ? productReviews.reduce((sum, rating) => sum + rating.rating, 0) / totalReviews
        : 0

    const handleGoBack = () => {
        navigation.goBack()
    }

    const handleLoadMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }

    return (
        <View style={styles.container}>
            <PrimaryHeader title="Tất Cả Đánh Giá" onBackPress={handleGoBack} />

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                onScroll={({ nativeEvent }) => {
                    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent
                    const paddingToBottom = 20
                    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
                        handleLoadMore()
                    }
                }}
                scrollEventThrottle={400}
            >
                {/* Statistics Section */}
                <View style={styles.statsContainer}>
                    <Text style={styles.sectionTitle}>Thống Kê Đánh Giá</Text>

                    <View style={styles.statsContent}>
                        <View style={styles.averageSection}>
                            <Text style={styles.averageRating}>{averageRating.toFixed(1)}</Text>
                            <Image source={starIcon} style={styles.starSymbol} />
                            <Text style={styles.totalReviews}>{totalReviews} Đánh Giá</Text>
                        </View>

                        <View style={styles.barsSection}>
                            {[5, 4, 3, 2, 1].map(star => {
                                const count = ratingStats[star as keyof typeof ratingStats]
                                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0

                                return (
                                    <View key={star} style={styles.barRow}>
                                        <Text style={styles.starLabel}>{star}</Text>
                                        <View style={styles.barContainer}>
                                            <View
                                                style={[
                                                    styles.barFill,
                                                    { width: `${percentage}%` }
                                                ]}
                                            />
                                        </View>
                                        <Text style={styles.countText}>{count}</Text>
                                    </View>
                                )
                            })}
                        </View>
                    </View>
                </View>

                {/* Write Review Button */}
                {/* <TouchableOpacity style={styles.writeReviewButton}>
                    <Text style={styles.writeReviewButtonText}>Viết Đánh Giá</Text>
                </TouchableOpacity> */}

                <Text style={styles.disclaimerText}>
                    Đánh giá sản phẩm được quản lý minh bạch và tuân thủ <Text style={styles.disclaimerLink}>Nguyên tắc</Text> xếp hạng và đánh giá của chúng tôi
                </Text>

                {/* Reviews Section */}
                <View style={styles.reviewsContainer}>
                    <Text style={styles.sectionTitle}>Đánh Giá Của Sản Phẩm</Text>

                    {isProductReviewsLoading ? (
                        <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
                    ) : (
                        <RatingPreview
                            averageRating={Number(averageRating.toFixed(1))}
                            totalReviews={totalReviews}
                            ratings={productRatings}
                            onViewAll={() => { }}
                            hideViewAll
                            showAllReviews
                            navigation={navigation}
                            onImagePress={(uri, type) => { setZoomImage(uri); setZoomType(type); }}
                        />
                    )}

                    {isFetchingNextPage && (
                        <ActivityIndicator size="small" color={Colors.primary} style={styles.loadMoreIndicator} />
                    )}
                </View>
            </ScrollView>

            <ImageZoomView
                imageUri={zoomImage || undefined}
                type={zoomType}
                onClose={() => setZoomImage(null)}
            />
        </View>
    )
}

export default AllReviewsScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    scrollView: {
        flex: 1,
    },
    statsContainer: {
        backgroundColor: '#fff',
        padding: ifTablet(20, 16),
        marginBottom: ifTablet(12, 8),
    },
    sectionTitle: {
        fontSize: ifTablet(18, 16),
        fontFamily: 'Sora-Bold',
        fontWeight: '700',
        color: Colors.textDark,
        marginBottom: ifTablet(16, 12),
    },
    statsContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ifTablet(24, 20),
    },
    averageSection: {
        alignItems: 'center',
        paddingRight: ifTablet(24, 20),
        borderRightWidth: 1,
        borderRightColor: '#E0E0E0',
    },
    averageRating: {
        fontSize: ifTablet(48, 40),
        fontFamily: 'Sora-Bold',
        fontWeight: '700',
        color: Colors.textDark,
    },
    starSymbol: {
        width: ifTablet(24, 20),
        height: ifTablet(24, 20),
        marginVertical: ifTablet(4, 2),
    },
    totalReviews: {
        fontSize: ifTablet(14, 12),
        fontFamily: 'Sora-Regular',
        color: Colors.gray,
    },
    barsSection: {
        flex: 1,
        gap: ifTablet(8, 6),
    },
    barRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ifTablet(8, 6),
    },
    starLabel: {
        fontSize: ifTablet(14, 12),
        fontFamily: 'Sora-Medium',
        color: Colors.textDark,
        width: ifTablet(12, 10),
    },
    barContainer: {
        flex: 1,
        height: ifTablet(10, 8),
        backgroundColor: '#F0F0F0',
        borderRadius: ifTablet(5, 4),
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        backgroundColor: '#FFA500',
        borderRadius: ifTablet(5, 4),
    },
    countText: {
        fontSize: ifTablet(12, 10),
        fontFamily: 'Sora-Regular',
        color: Colors.gray,
        width: ifTablet(30, 25),
        textAlign: 'right',
    },
    writeReviewButton: {
        backgroundColor: Colors.primary,
        marginHorizontal: ifTablet(20, 16),
        paddingVertical: ifTablet(14, 12),
        borderRadius: ifTablet(12, 10),
        alignItems: 'center',
        marginBottom: ifTablet(12, 10),
    },
    writeReviewButtonText: {
        fontSize: ifTablet(16, 14),
        fontFamily: 'Sora-SemiBold',
        fontWeight: '600',
        color: '#fff',
    },
    disclaimerText: {
        fontSize: ifTablet(12, 10),
        fontFamily: 'Sora-Regular',
        color: Colors.gray,
        textAlign: 'center',
        paddingHorizontal: ifTablet(20, 16),
        marginBottom: ifTablet(16, 12),
    },
    disclaimerLink: {
        color: Colors.primary,
        fontFamily: 'Sora-SemiBold',
        fontWeight: '600',
    },
    reviewsContainer: {
        backgroundColor: '#fff',
        padding: ifTablet(20, 16),
        marginBottom: ifTablet(12, 8),
    },
    loader: {
        marginTop: ifTablet(32, 24),
    },
    loadMoreIndicator: {
        marginVertical: ifTablet(16, 12),
    },
})
