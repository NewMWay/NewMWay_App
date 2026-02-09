import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native'
import React from 'react'
import { ifTablet } from '../../../utils/responsives/responsive'
import { Colors } from '../../../assets/styles/colorStyles'
import Video from 'react-native-video'
import { useAuthStore } from '../../../stores/authStore.zustand'
import ModalViewMore from '../../../components/common/Modal/ModalViewMore'
import { MediaType } from '../types/media.enum'
import { ProductReviewType } from '../types/product.type'
import { useDeleteProductReview } from '../hooks/useProductQuery.hook'
import { useToast } from '../../../utils/toasts/useToast'
import { ShoppingStackNavigationProp } from '../../../types/navigation/navigation'

interface RatingPreviewProps {
    averageRating: number;
    totalReviews: number;
    ratings: ProductReviewType[];
    onViewAll: () => void;
    soldCount?: number;
    hideViewAll?: boolean;
    showAllReviews?: boolean;
    navigation: ShoppingStackNavigationProp
    onImagePress?: (uri: string, type: 'image' | 'video') => void;
}

const ImageSeparator = () => <View style={{ width: ifTablet(8, 6) }} />;

const RatingPreview = ({
    averageRating,
    totalReviews: _,
    ratings,
    onViewAll,
    soldCount: _soldCount,
    hideViewAll = false,
    showAllReviews: _showAllReviews = false,
    navigation: navigation,
    onImagePress: _onImagePress,
}: RatingPreviewProps) => {
    const starIcon = require('../../../assets/icons/icons8-star-48.png');
    const moreIcon = require('../../../assets/icons/icons8-slider-48.png');
    const playVideoIcon = require('../../../assets/icons/icons8-play-video-48.png');

    const userProfile = useAuthStore((state) => state.userProfile);
    const currentUserId = userProfile?.id;
    const { mutate: deleteProductReview, isPending: isDeleteProductReview } = useDeleteProductReview();
    const { showError } = useToast();

    const [modalVisible, setModalVisible] = React.useState(false);
    const [selectedReview, setSelectedReview] = React.useState<ProductReviewType | null>(null);
    const [isPlayingMap, setIsPlayingMap] = React.useState(new Map<string, boolean>());

    const sortedRatings = React.useMemo(() => {
        return [...ratings].sort((a, b) => {
            if (a.userId === currentUserId) return -1;
            if (b.userId === currentUserId) return 1;
            return 0;
        });
    }, [ratings, currentUserId]);

    if (isDeleteProductReview) {
        return <ActivityIndicator size="large" color={Colors.primary} />
    }

    const handleMorePress = (review: ProductReviewType) => {
        setSelectedReview(review);
        setModalVisible(true);
    };

    const handleEditReview = () => {
        if (selectedReview) {
            setModalVisible(false);
            const parentNavigation = navigation.getParent();
            parentNavigation?.navigate('Cá Nhân',
                {
                    screen: 'UpdateReviewScreen',
                    params: {
                        reviewId: selectedReview.id,
                        productVariantId: selectedReview.productVariantId,
                        rating: selectedReview.rating,
                        title: selectedReview.title || '',
                        content: selectedReview.content,
                        media: selectedReview.media,
                    }
                });
            // navigation.navigate('UpdateReviewScreen', {
            //     reviewId: selectedReview.id,
            //     productVariantId: selectedReview.productVariantId,
            //     rating: selectedReview.rating,
            //     title: selectedReview.title || '',
            //     content: selectedReview.content,
            //     media: selectedReview.media,
            // } as any);
        }
    };

    const handleDeleteReview = () => {
        if (selectedReview?.id) {
            Alert.alert(
                'Xác nhận xóa',
                'Bạn có chắc chắn muốn xóa đánh giá này không?',
                [
                    { text: 'Hủy', style: 'cancel' },
                    {
                        text: 'Xóa',
                        style: 'destructive',
                        onPress: () => confirmDeleteReview(),
                    },
                ]
            );
        }
    };

    const confirmDeleteReview = () => {
        if (selectedReview?.id) {
            deleteProductReview({ Id: selectedReview.id }, {
                onError: (error) => {
                    console.error('❌ Failed to delete review:', selectedReview.id, error);
                    showError('Xóa đánh giá thất bại. Vui lòng thử lại.', error.message);
                }
            });
        }
        setModalVisible(false);
    };

    const formatDateTimeDisplay = (dateString: string, timeString: string) => {
        const dateParts = dateString.split('-');
        const timeParts = timeString.split(':');

        if (dateParts.length !== 3 || timeParts.length < 2) {
            return '';
        }

        const year = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1;
        const day = parseInt(dateParts[2], 10);
        const hours = parseInt(timeParts[0], 10);
        const minutes = parseInt(timeParts[1], 10);

        const dateObj = new Date(year, month, day, hours, minutes);

        const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
        const formattedTime = `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;

        return `${formattedDate} lúc ${formattedTime}`;
    }

    // Sắp xếp review: review của mình lên đầu

    const previewRatings = sortedRatings.slice(0, 2);

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            const starStyle = {
                ...styles.starIcon,
                tintColor: i <= rating ? '#FFD700' : '#E0E0E0'
            };
            stars.push(
                <Image
                    key={i}
                    source={starIcon}
                    style={starStyle}
                />
            );
        }
        return stars;
    };



    const renderRatingItem = ({ item, index }: { item: ProductReviewType; index: number }) => {
        const isCurrentUserReview = item.userId === currentUserId;

        return (
            <View style={[
                styles.ratingItem,
                index < previewRatings.length - 1 && styles.ratingItemWithBorder,
                isCurrentUserReview && styles.currentUserReview
            ]}>
                <View style={styles.userInfoContainer}>
                    {item.avatar ? (
                        <Image source={{ uri: item.avatar }} style={styles.userAvatar} />
                    ) : (
                        <View style={[styles.userAvatar, styles.defaultAvatar]}>
                            <Text style={styles.defaultAvatarText}>
                                {item.fullName ? item.fullName.charAt(0).toUpperCase() : item.userName.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                    )}
                    <View style={styles.userDetails}>
                        <Text style={styles.userName}>{item.fullName || item.userName}</Text>

                    </View>
                    <View style={styles.userStarsContainer}>
                        {renderStars(item.rating)}
                    </View>
                    {currentUserId === item.userId && (
                        <TouchableOpacity
                            style={styles.moreButton}
                            onPress={() => handleMorePress(item)}
                        >
                            <Image source={moreIcon} style={styles.moreIcon} />
                        </TouchableOpacity>
                    )}
                </View>

                {item.title && <Text style={styles.ratingTitle}>{item.title}</Text>}

                <Text style={styles.commentText} numberOfLines={3}>
                    {item.content}
                </Text>

                {item.media.length > 0 && (
                    <FlatList
                        data={item.media}
                        renderItem={({ item: mediaItem }) => {
                            // Function to extract YouTube video ID
                            const getYouTubeVideoId = (url: string): string | null => {
                                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                                const match = url.match(regExp);
                                return (match && match[2].length === 11) ? match[2] : null;
                            };

                            const videoId = getYouTubeVideoId(mediaItem.url);
                            const isYouTube = !!videoId;
                            const isVideo = mediaItem.type === MediaType.Video || isYouTube;
                            const isPlaying = isPlayingMap.get(mediaItem.id) || false;

                            return (
                                <TouchableOpacity
                                    onPress={() => _onImagePress?.(mediaItem.url, isVideo ? 'video' : 'image')}
                                >
                                    {isYouTube ? (
                                        <Image
                                            source={{ uri: `https://img.youtube.com/vi/${videoId}/0.jpg` }}
                                            style={styles.reviewImage}
                                        />
                                    ) : mediaItem.type === MediaType.Video ? (
                                        <Video
                                            source={{ uri: mediaItem.url }}
                                            style={styles.reviewImage}
                                            resizeMode="cover"
                                            paused={true}
                                            controls={true}
                                            onPlaybackStateChanged={(state) => {
                                                setIsPlayingMap(prev => new Map(prev).set(mediaItem.id, state.isPlaying));
                                            }}
                                        />
                                    ) : (
                                        <Image
                                            source={{ uri: mediaItem.url }}
                                            style={styles.reviewImage}
                                        />
                                    )}
                                    {isVideo && !isPlaying && (
                                        <Image
                                            source={playVideoIcon}
                                            style={styles.playIcon}
                                            resizeMode="contain"
                                        />
                                    )}
                                </TouchableOpacity>
                            );
                        }}
                        keyExtractor={(mediaItem) => mediaItem.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.reviewImagesContainer}
                        ItemSeparatorComponent={ImageSeparator}
                    />
                )}

                <View style={styles.bottomInfoContainer}>
                    {item.productVariantName && (
                        <Text style={styles.productVariant}>Phân loại: {item.productVariantName}</Text>
                    )}
                    <Text style={styles.timeText}>{formatDateTimeDisplay(item.date, item.time)}</Text>
                </View>

                {/* Replies Section */}
                {item.replies && item.replies.length > 0 && (
                    <View style={styles.repliesContainer}>
                        <Text style={styles.replyHeaderText}>Phản hồi từ người bán</Text>
                        {item.replies.map((reply) => (
                            <View key={reply.id} style={styles.replyItem}>
                                <View style={styles.replyHeader}>
                                    {reply.avatar ? (
                                        <Image source={{ uri: reply.avatar }} style={styles.replyAvatar} />
                                    ) : (
                                        <View style={[styles.replyAvatar, styles.defaultReplyAvatar]}>
                                            <Text style={styles.defaultReplyAvatarText}>
                                                {reply.userName.charAt(0).toUpperCase()}
                                            </Text>
                                        </View>
                                    )}
                                    <View style={styles.replyContent}>
                                        <Text style={styles.replyUserName}>{reply.userName}</Text>
                                        <Text style={styles.replyText}>{reply.content}</Text>
                                        <Text style={styles.replyTime}>{formatDateTimeDisplay(reply.date, reply.time)}</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        );
    };

    if (ratings.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <View style={styles.ratingHeaderLeft}>
                        <Text style={styles.ratingText}>0</Text>
                        <Image source={starIcon} style={styles.headerStarIcon} />
                        <Text style={styles.titleText}>Đánh Giá Sản Phẩm</Text>
                    </View>
                </View>
                <View style={styles.noReviewContainer}>
                    <Text style={styles.noReviewText}>Chưa có đánh giá nào</Text>
                    <Text style={styles.noReviewSubText}>Hãy là người đầu tiên đánh giá sản phẩm này</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {!hideViewAll && (
                <View style={styles.headerContainer}>
                    <View style={styles.ratingHeaderLeft}>
                        <Text style={styles.ratingText}>{averageRating}</Text>
                        <Image source={starIcon} style={styles.headerStarIcon} />
                        <Text style={styles.titleText}>Đánh Giá Sản Phẩm</Text>
                    </View>
                    <TouchableOpacity onPress={onViewAll} style={styles.viewAllButton}>
                        <Text style={styles.viewAllText}>Xem tất cả</Text>
                        {/* <Image source={chevronRightIcon} style={styles.chevronIcon} /> */}
                    </TouchableOpacity>
                </View>
            )}

            <FlatList
                data={previewRatings}
                renderItem={renderRatingItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
            />

            <ModalViewMore
                visible={modalVisible}
                title="Tùy chọn"
                onClose={() => setModalVisible(false)}
                buttons={[
                    {
                        text: 'Chỉnh sửa',
                        onPress: handleEditReview,
                    },
                    {
                        text: 'Xóa',
                        onPress: handleDeleteReview,
                    },
                ]}
            />
        </View>
    )
}

export default RatingPreview

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: ifTablet(12, 8),
        padding: ifTablet(16, 12),
        marginVertical: ifTablet(8, 6),
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: ifTablet(16, 12),
        borderBottomWidth: 0.5,
        borderBottomColor: '#E0E0E0',
        paddingBottom: ifTablet(8, 6),
    },
    ratingHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: ifTablet(20, 16),
        fontFamily: 'Sora-Bold',
        fontWeight: '600',
        color: Colors.textDark,
        marginRight: ifTablet(8, 6),
    },
    headerStarIcon: {
        width: ifTablet(20, 16),
        height: ifTablet(20, 16),
        tintColor: '#FFD700',
        marginRight: ifTablet(12, 8),
    },
    titleText: {
        fontSize: ifTablet(16, 14),
        fontFamily: 'Sora-SemiBold',
        fontWeight: '600',
        color: Colors.textDark,
    },
    viewAllButton: {
        // flexDirection: 'row',
        alignItems: 'center',
    },
    viewAllText: {
        fontSize: ifTablet(14, 12),
        fontFamily: 'Sora-Regular',
        color: Colors.primary,
        marginRight: ifTablet(4, 2),
    },
    chevronIcon: {
        width: ifTablet(16, 12),
        height: ifTablet(16, 12),
        tintColor: Colors.gray,
    },
    ratingItem: {
        marginBottom: ifTablet(16, 12),
        paddingBottom: ifTablet(16, 12),
    },
    ratingItemWithBorder: {
        borderBottomWidth: 1,
        // borderBottomColor: '#F0F0F0',
        borderBottomColor: Colors.primary,
    },
    currentUserReview: {
        borderWidth: 1,
        borderColor: Colors.primary,
        borderRadius: ifTablet(12, 10),
        padding: ifTablet(12, 10),
        backgroundColor: Colors.primary + '05',
        marginBottom: ifTablet(20, 16),
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: ifTablet(16, 12),
    },
    userAvatar: {
        width: ifTablet(40, 32),
        height: ifTablet(40, 32),
        borderRadius: ifTablet(20, 16),
        marginRight: ifTablet(12, 8),
    },
    defaultAvatar: {
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    defaultAvatarText: {
        color: '#fff',
        fontSize: ifTablet(16, 14),
        fontWeight: 'bold',
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontSize: ifTablet(14, 12),
        fontFamily: 'Sora-SemiBold',
        fontWeight: '600',
        color: Colors.textDark,
        marginBottom: ifTablet(4, 2),
    },
    timeText: {
        fontSize: ifTablet(11, 9),
        fontFamily: 'Sora-Regular',
        color: Colors.gray,
    },
    ratingTitle: {
        fontSize: ifTablet(13, 11),
        fontFamily: 'Sora-SemiBold',
        fontWeight: '600',
        color: Colors.textDark,
        marginBottom: ifTablet(12, 6),
    },
    productVariant: {
        fontSize: ifTablet(12, 10),
        fontFamily: 'Sora-Regular',
        color: Colors.textDark,
    },
    attributeText: {
        fontSize: ifTablet(12, 10),
        fontFamily: 'Sora-Regular',
        color: Colors.gray,
        marginBottom: ifTablet(12, 6),
    },
    userStarsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: ifTablet(8, 6),
    },
    moreButton: {
        padding: ifTablet(4, 2),
        marginLeft: ifTablet(8, 6),
    },
    moreIcon: {
        width: ifTablet(20, 16),
        height: ifTablet(20, 16),
        tintColor: Colors.primary,
    },

    starIcon: {
        width: ifTablet(14, 12),
        height: ifTablet(14, 12),
        marginRight: ifTablet(2, 1),
    },

    commentText: {
        fontSize: ifTablet(14, 12),
        fontFamily: 'Sora-Regular',
        color: Colors.textDark,
        lineHeight: ifTablet(20, 18),
        marginBottom: ifTablet(12, 8),
        opacity: 0.8,
    },
    reviewImagesContainer: {
        paddingLeft: 0,
        marginBottom: ifTablet(12, 8),
    },
    reviewImage: {
        width: ifTablet(100, 90),
        height: ifTablet(100, 90),
        borderRadius: ifTablet(8, 6),
    },
    playIcon: {
        position: 'absolute',
        width: ifTablet(30, 20),
        height: ifTablet(30, 20),
        tintColor: 'white',
        top: ifTablet('40%', '40%'),
        left: ifTablet('40%', '40%'),
    },
    bottomInfoContainer: {
        marginTop: ifTablet(20, 16),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    noReviewContainer: {
        alignItems: 'center',
        paddingVertical: ifTablet(32, 24),
    },
    noReviewText: {
        fontSize: ifTablet(16, 14),
        fontFamily: 'Sora-SemiBold',
        fontWeight: '600',
        color: Colors.gray,
        marginBottom: ifTablet(8, 6),
    },
    noReviewSubText: {
        fontSize: ifTablet(14, 12),
        fontFamily: 'Sora-Regular',
        color: Colors.gray,
        textAlign: 'center',
    },
})