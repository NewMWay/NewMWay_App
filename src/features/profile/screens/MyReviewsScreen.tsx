import { StyleSheet, Text, View, FlatList, ActivityIndicator, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader'
import { Colors } from '../../../assets/styles/colorStyles'
import { ifTablet } from '../../../utils/responsives/responsive'
import { ProfileStackNavigationProp, ShoppingStackNavigationProp } from '../../../types/navigation/navigation'
import { useUserHistoryReviewedProductsQuery, useDeleteProductReview } from '../../shop/hooks/useProductQuery.hook'
import { UserHistoryReviewedProductItem } from '../../shop/types/product.type'

import Video from 'react-native-video'
import ImageZoomView from '../../../components/common/ModalView/ImageZoomView'
import { MediaType } from '../../shop/types/media.enum'

const MyReviewsScreen = () => {
    const navigation = useNavigation<ProfileStackNavigationProp & ShoppingStackNavigationProp>()

    const [imageUri, setImageUri] = useState<string | undefined>(undefined)
    const [mediaType, setMediaType] = useState<'image' | 'video'>('image')

    const {
        data,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
    } = useUserHistoryReviewedProductsQuery({})

    const { mutate: deleteReview } = useDeleteProductReview()

    const reviews = data?.pages.flatMap(page => page.items) || []

    const handleLoadMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }

    const handleEditReview = useCallback((review: UserHistoryReviewedProductItem) => {
        const productVariant = review.productVariants[0]
        if (!productVariant) return

        navigation.navigate('UpdateReviewScreen', {
            reviewId: review.id,
            productVariantId: productVariant.productVariantId,
            rating: review.rating,
            title: review.title,
            content: review.content,
            media: review.reviewMedias.map(m => ({
                id: m.id,
                url: m.url,
                type: m.type as MediaType,
            })),
        } as any)
    }, [navigation])

    const handleDeleteReview = useCallback((reviewId: string) => {
        Alert.alert(
            'Xóa đánh giá',
            'Bạn có chắc chắn muốn xóa đánh giá này?',
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: () => {
                        deleteReview({ Id: reviewId })
                    },
                },
            ]
        )
    }, [deleteReview])

    const handleImagePress = useCallback((url: string, type: 'image' | 'video') => {
        setImageUri(url)
        setMediaType(type)
    }, [])

    const handleCloseImage = useCallback(() => {
        setImageUri(undefined)
    }, [])

    const renderReviewItem = useCallback(({ item }: { item: UserHistoryReviewedProductItem }) => (
        <ReviewItem
            review={item}
            onEdit={() => handleEditReview(item)}
            onDelete={() => handleDeleteReview(item.id)}
            onImagePress={handleImagePress}
        />
    ), [handleEditReview, handleDeleteReview, handleImagePress])

    const renderFooter = () => {
        if (!isFetchingNextPage) return null
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={Colors.primary} />
            </View>
        )
    }

    if (isLoading) {
        return (
            <View style={styles.container}>
                <PrimaryHeader title="Đánh Giá Của Tôi" onBackPress={() => navigation.goBack()} />
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <PrimaryHeader title="Đánh Giá Của Tôi" onBackPress={() => navigation.goBack()} />

            <FlatList
                data={reviews}
                renderItem={renderReviewItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={reviews.length === 0 ? styles.emptyListContainer : styles.listContent}
                showsVerticalScrollIndicator={false}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyIcon}>⭐</Text>
                        <Text style={styles.emptyText}>Chưa có đánh giá nào</Text>
                        <Text style={styles.emptySubtext}>
                            Hãy mua sắm và đánh giá sản phẩm bạn đã dùng
                        </Text>
                    </View>
                }
            />

            {/* Image/Video Viewer */}
            <ImageZoomView
                imageUri={imageUri}
                type={mediaType}
                onClose={handleCloseImage}
            />
        </View>
    )
}

// Media Separator Component
const MediaSeparator = () => <View style={{ width: ifTablet(8, 6) }} />

// Function to extract YouTube video ID
const getYouTubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
}

// Function to format date and time display
const formatDateTimeDisplay = (dateString: string, timeString: string) => {
    const dateParts = dateString.split('-')
    const timeParts = timeString.split(':')

    if (dateParts.length !== 3 || timeParts.length < 2) {
        return ''
    }

    const year = parseInt(dateParts[0], 10)
    const month = parseInt(dateParts[1], 10) - 1
    const day = parseInt(dateParts[2], 10)
    const hours = parseInt(timeParts[0], 10)
    const minutes = parseInt(timeParts[1], 10)

    const dateObj = new Date(year, month, day, hours, minutes)

    const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`
    const formattedTime = `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`

    return `${formattedDate} lúc ${formattedTime}`
}

// Review Item Component
interface ReviewItemProps {
    review: UserHistoryReviewedProductItem
    onEdit: () => void
    onDelete: () => void
    onImagePress?: (url: string, type: 'image' | 'video') => void
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review, onEdit, onDelete, onImagePress }) => {
    const starIcon = require('../../../assets/icons/icons8-star-48.png')
    const playIcon = require('../../../assets/icons/icons8-play-video-48.png')
    const [isPlayingMap, setIsPlayingMap] = useState<Map<string, boolean>>(new Map())

    const productVariant = review.productVariants[0]

    const renderStars = (rating: number) => {
        return (
            <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <Image
                        key={star}
                        source={star <= rating ? starIcon : starIcon}
                        style={[styles.starIcon,
                        { tintColor: star <= rating ? Colors.warning : Colors.grayLight }
                        ]}
                    />
                ))}
            </View>
        )
    }

    const renderMedia = () => {
        if (!review.reviewMedias || review.reviewMedias.length === 0) return null

        return (
            <FlatList
                data={review.reviewMedias}
                renderItem={({ item: mediaItem }) => {
                    const videoId = getYouTubeVideoId(mediaItem.url)
                    const isYouTube = !!videoId
                    const isVideo = mediaItem.type === MediaType.Video || isYouTube
                    const isPlaying = isPlayingMap.get(mediaItem.id) || false

                    return (
                        <TouchableOpacity
                            onPress={() => onImagePress?.(mediaItem.url, isVideo ? 'video' : 'image')}
                            activeOpacity={0.7}
                        >
                            <View style={styles.mediaItem}>
                                {isYouTube ? (
                                    <Image
                                        source={{ uri: `https://img.youtube.com/vi/${videoId}/0.jpg` }}
                                        style={styles.mediaImage}
                                    />
                                ) : mediaItem.type === MediaType.Video ? (
                                    <Video
                                        source={{ uri: mediaItem.url }}
                                        style={styles.mediaImage}
                                        resizeMode="cover"
                                        paused={true}
                                        controls={true}
                                        onPlaybackStateChanged={(state) => {
                                            setIsPlayingMap(prev => new Map(prev).set(mediaItem.id, state.isPlaying))
                                        }}
                                    />
                                ) : (
                                    <Image
                                        source={{ uri: mediaItem.url }}
                                        style={styles.mediaImage}
                                    />
                                )}
                                {isVideo && !isPlaying && (
                                    <View style={styles.playIconOverlay}>
                                        <Image source={playIcon} style={styles.playIcon} />
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                    )
                }}
                keyExtractor={(mediaItem) => mediaItem.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={MediaSeparator}
                contentContainerStyle={styles.mediaListContainer}
            />
        )
    }

    return (
        <View style={styles.reviewCard}>
            {/* Product Info */}
            {productVariant && (
                <View style={styles.productInfo}>
                    <Image
                        source={{ uri: productVariant.image }}
                        style={styles.productImage}
                    />
                    <View style={styles.productDetails}>
                        <Text style={styles.productName} numberOfLines={2}>
                            {productVariant.name}
                        </Text>
                        <Text style={styles.variantText} numberOfLines={1}>
                            Giá: {productVariant.price.toLocaleString('vi-VN')}đ
                        </Text>
                    </View>
                </View>
            )}

            {/* Rating */}
            <View style={styles.ratingSection}>
                {renderStars(review.rating)}
                <Text style={styles.reviewDate}>{formatDateTimeDisplay(review.date, review.time)}</Text>
            </View>

            {/* Review Content */}
            {review.title && <Text style={styles.reviewTitle}>{review.title}</Text>}
            {review.content && (
                <Text style={styles.reviewContent} >
                    {review.content}
                </Text>
            )}

            {/* Media */}
            {renderMedia()}

            {/* Seller Reply */}
            {review.replies && review.replies.length > 0 && (
                <View style={styles.repliesContainer}>
                    <Text style={styles.replyHeaderText}>Phản hồi từ người bán</Text>
                    {review.replies.map((reply) => (
                        <View key={reply.id} style={styles.replyItem}>
                            <View style={styles.replyHeader}>
                                {reply.avatar ? (
                                    <Image
                                        source={{ uri: reply.avatar }}
                                        style={styles.replyAvatar}
                                    />
                                ) : (
                                    <View style={[styles.replyAvatar, styles.defaultReplyAvatar]}>
                                        <Text style={styles.defaultReplyAvatarText}>
                                            {reply.userName?.charAt(0)?.toUpperCase() || 'S'}
                                        </Text>
                                    </View>
                                )}
                                <View style={styles.replyContent}>
                                    <Text style={styles.replyUserName}>{reply.userName}</Text>
                                    <Text style={styles.replyText}>{reply.content}</Text>
                                    <Text style={styles.replyTime}>{reply.date} {reply.time}</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.editButton} onPress={onEdit}>
                    <Text style={styles.editButtonText}>Sửa</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
                    <Text style={styles.deleteButtonText}>Xóa</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default MyReviewsScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.grayLight,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: ifTablet(16, 12),
        paddingBottom: ifTablet(24, 20),
    },
    emptyListContainer: {
        flexGrow: 1,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: ifTablet(80, 60),
    },
    emptyIcon: {
        fontSize: ifTablet(60, 50),
        marginBottom: ifTablet(16, 12),
    },
    emptyText: {
        fontSize: ifTablet(18, 16),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
        marginBottom: ifTablet(8, 6),
    },
    emptySubtext: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-Regular',
        color: Colors.textGray,
        textAlign: 'center',
        paddingHorizontal: ifTablet(40, 30),
    },
    footerLoader: {
        paddingVertical: ifTablet(20, 16),
        alignItems: 'center',
    },
    reviewCard: {
        backgroundColor: Colors.textWhite,
        borderRadius: ifTablet(12, 10),
        padding: ifTablet(16, 14),
        marginBottom: ifTablet(12, 10),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    productInfo: {
        flexDirection: 'row',
        marginBottom: ifTablet(12, 10),
        paddingBottom: ifTablet(12, 10),
        borderBottomWidth: 1,
        borderBottomColor: Colors.grayLight,
    },
    productImage: {
        width: ifTablet(60, 50),
        height: ifTablet(60, 50),
        borderRadius: ifTablet(8, 6),
        backgroundColor: Colors.grayLight,
    },
    productDetails: {
        flex: 1,
        marginLeft: ifTablet(12, 10),
        justifyContent: 'center',
    },
    productName: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
        marginBottom: ifTablet(4, 3),
    },
    variantText: {
        fontSize: ifTablet(12, 11),
        fontFamily: 'Sora-Regular',
        color: Colors.textGray,
    },
    ratingSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: ifTablet(8, 6),
    },
    starsContainer: {
        flexDirection: 'row',
        gap: ifTablet(4, 3),
    },
    starIcon: {
        width: ifTablet(16, 14),
        height: ifTablet(16, 14),
    },
    reviewDate: {
        fontSize: ifTablet(12, 11),
        fontFamily: 'Sora-Regular',
        color: Colors.textGray,
    },
    reviewTitle: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
        marginBottom: ifTablet(6, 5),
    },
    reviewContent: {
        fontSize: ifTablet(13, 12),
        fontFamily: 'Sora-Regular',
        color: Colors.textDark,
        lineHeight: ifTablet(20, 18),
        marginBottom: ifTablet(12, 10),
    },
    mediaItem: {
        width: ifTablet(80, 70),
        height: ifTablet(80, 70),
        borderRadius: ifTablet(8, 6),
        overflow: 'hidden',
    },
    mediaImage: {
        width: '100%',
        height: '100%',
        backgroundColor: Colors.grayLight,
    },
    playIconOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    playIcon: {
        width: ifTablet(32, 28),
        height: ifTablet(32, 28),
        tintColor: Colors.textWhite,
    },
    repliesContainer: {
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        marginTop: ifTablet(16, 12),
        paddingLeft: ifTablet(16, 8),
    },
    replyHeaderText: {
        fontSize: ifTablet(14, 10),
        fontFamily: 'Sora-SemiBold',
        fontWeight: '600',
        color: Colors.primary,
        marginVertical: ifTablet(12, 8),
    },
    replyItem: {
        marginBottom: ifTablet(12, 8),
        backgroundColor: Colors.gray + '20',
        padding: ifTablet(12, 10),
        borderRadius: ifTablet(8, 6),
        borderLeftWidth: 1,
        borderLeftColor: Colors.primary,
    },
    replyHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    replyAvatar: {
        width: ifTablet(32, 28),
        height: ifTablet(32, 28),
        borderRadius: ifTablet(16, 14),
        marginRight: ifTablet(10, 8),
    },
    defaultReplyAvatar: {
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    defaultReplyAvatarText: {
        color: '#fff',
        fontSize: ifTablet(14, 12),
        fontFamily: 'Sora-SemiBold',
        fontWeight: '600',
    },
    replyContent: {
        flex: 1,
    },
    replyUserName: {
        fontSize: ifTablet(13, 11),
        fontFamily: 'Sora-SemiBold',
        fontWeight: '600',
        color: Colors.textDark,
        marginBottom: ifTablet(4, 3),
    },
    replyText: {
        fontSize: ifTablet(13, 11),
        fontFamily: 'Sora-Regular',
        color: Colors.textDark,
        lineHeight: ifTablet(18, 16),
        marginBottom: ifTablet(6, 5),
    },
    replyTime: {
        fontSize: ifTablet(10, 9),
        fontFamily: 'Sora-Regular',
        color: Colors.gray,
    },

    actionButtons: {
        flexDirection: 'row',
        gap: ifTablet(12, 10),
    },
    editButton: {
        flex: 1,
        paddingVertical: ifTablet(10, 8),
        borderRadius: ifTablet(8, 6),
        borderWidth: 1,
        borderColor: Colors.primary,
        alignItems: 'center',
    },
    editButtonText: {
        fontSize: ifTablet(14, 12),
        fontFamily: 'Sora-SemiBold',
        color: Colors.primary,
    },
    deleteButton: {
        flex: 1,
        paddingVertical: ifTablet(10, 8),
        borderRadius: ifTablet(8, 6),
        backgroundColor: Colors.error + '15',
        borderWidth: 1,
        borderColor: Colors.error,
        alignItems: 'center',
    },
    deleteButtonText: {
        fontSize: ifTablet(14, 12),
        fontFamily: 'Sora-SemiBold',
        color: Colors.error,
    },
    mediaListContainer: {
        paddingHorizontal: ifTablet(16, 12),
        paddingVertical: ifTablet(8, 6),
    },
})
