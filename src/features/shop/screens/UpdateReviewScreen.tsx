import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useUploadImage, useUploadVideo } from '../hooks/useMediaUpload.hook'
import { UploadImageRequest, UploadVideoRequest } from '../types/mediaUpload.type'
import {
    useDeleteProductMedia,
    useUpdateProductReview,
} from '../hooks/useProductQuery.hook'
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader'
import { Colors } from '../../../assets/styles/colorStyles'
import { ifTablet } from '../../../utils/responsives/responsive'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { ProfileStackNavigationProp, ShoppingStackParamList } from '../../../types/navigation/navigation'
import { launchImageLibrary } from 'react-native-image-picker'
import { useToast } from '../../../utils/toasts/useToast'
import { MediaType } from '../types/media.enum'
import Video from 'react-native-video'

const UpdateReviewScreen = () => {
    const navigation = useNavigation<ProfileStackNavigationProp>();
    const route = useRoute<RouteProp<ShoppingStackParamList, 'UpdateReviewScreen'>>();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { reviewId, productVariantId } = route.params;
    const { showSuccess, showError } = useToast();

    // Get initial review data from navigation params or from a query
    const initialReview = route.params as any; // You should pass full review data

    const [rating, setRating] = useState(initialReview?.rating || 0);
    const [title, setTitle] = useState(initialReview?.title || '');
    const [content, setContent] = useState(initialReview?.content || '');
    const [existingMedia, setExistingMedia] = useState<Array<{ id: string; url: string; type: MediaType }>>(
        initialReview?.media || []
    );
    const [selectedMedia, setSelectedMedia] = useState<any[]>([]);

    const { mutate: uploadImage, isPending: isUploadingImage } = useUploadImage();
    const { mutate: uploadVideo, isPending: isUploadingVideo } = useUploadVideo();
    const { mutate: updateReview, isPending: isUpdatingReview } = useUpdateProductReview();
    const { mutate: deleteMedia, isPending: isDeletingMedia } = useDeleteProductMedia();

    const isSubmitting = isUploadingImage || isUploadingVideo || isUpdatingReview || isDeletingMedia;

    const starIcon = require('../../../assets/icons/icons8-star-48.png');
    const addIcon = require('../../../assets/icons/icons8-camera-48.png');
    const deleteIcon = require('../../../assets/icons/icons8-full-trash-48.png');
    const playVideoIcon = require('../../../assets/icons/icons8-play-video-48.png');

    const handleBackPress = () => {
        navigation.goBack();
    };

    const handleStarPress = (selectedRating: number) => {
        setRating(selectedRating);
    };

    const handleMediaPick = async () => {
        const totalMedia = existingMedia.length + selectedMedia.length;
        if (totalMedia >= 5) {
            showError('Chỉ được chọn tối đa 5 media');
            return;
        }

        const result = await launchImageLibrary({
            mediaType: 'mixed', // Allow both photo and video
            quality: 0.8,
            selectionLimit: 5 - totalMedia,
        });

        if (result.assets && result.assets.length > 0) {
            const newMedia = result.assets.map(asset => ({
                uri: asset.uri!,
                type: asset.type?.includes('video') ? MediaType.Video : MediaType.Image,
                name: asset.fileName || `media_${Date.now()}.${asset.type?.split('/')[1] || 'jpg'}`,
            }));
            setSelectedMedia([...selectedMedia, ...newMedia]);
        }
    };

    const handleRemoveExistingMedia = (mediaId: string) => {
        deleteMedia(
            { id: mediaId },
            {
                onSuccess: () => {
                    setExistingMedia(existingMedia.filter(m => m.id !== mediaId));
                    showSuccess('Xóa media thành công');
                },
                onError: () => {
                    showError('Xóa media thất bại');
                }
            }
        );
    };

    const handleRemoveNewMedia = (index: number) => {
        const newMedia = selectedMedia.filter((_, i) => i !== index);
        setSelectedMedia(newMedia);
    };

    const uploadAllMedia = async (): Promise<Array<{ url: string, type: MediaType }>> => {
        const urls: Array<{ url: string, type: MediaType }> = [];

        for (const media of selectedMedia) {
            try {
                const formDataObj = {
                    uri: media.uri,
                    type: media.type === MediaType.Video ? 'video/mp4' : 'image/jpeg',
                    name: media.name,
                };

                const formData = media.type === MediaType.Video
                    ? { Video: formDataObj as any }
                    : { Image: formDataObj as any };

                await new Promise<void>((resolve, reject) => {
                    if (media.type === MediaType.Video) {
                        uploadVideo(
                            formData as UploadVideoRequest,
                            {
                                onSuccess: (url) => {
                                    urls.push({ url, type: media.type });
                                    resolve();
                                },
                                onError: (error) => {
                                    console.error('Upload error:', error);
                                    reject(error);
                                },
                            }
                        );
                    } else {
                        uploadImage(
                            formData as UploadImageRequest,
                            {
                                onSuccess: (url) => {
                                    urls.push({ url, type: media.type });
                                    resolve();
                                },
                                onError: (error) => {
                                    console.error('Upload error:', error);
                                    reject(error);
                                },
                            }
                        );
                    }
                });
            } catch (error) {
                console.error('Error uploading media:', error);
                throw error;
            }
        }

        return urls;
    };

    const handleSubmit = async () => {
        if (rating === 0) {
            showError('Vui lòng chọn số sao đánh giá');
            return;
        }

        if (!title.trim()) {
            showError('Vui lòng nhập tiêu đề đánh giá');
            return;
        }

        if (!content.trim()) {
            showError('Vui lòng nhập nội dung đánh giá');
            return;
        }

        try {
            let newMedias: { url: string, type: MediaType }[] = [];

            if (selectedMedia.length > 0) {
                newMedias = await uploadAllMedia();
            }

            // Combine existing media URLs with new ones
            const allMedias = [
                ...existingMedia.map(m => ({ url: m.url, type: m.type || MediaType.Image })),
                ...newMedias
            ];

            updateReview(
                {
                    Id: reviewId,
                    rating: rating,
                    title: title.trim(),
                    content: content.trim(),
                    medias: allMedias,
                },
                {
                    onSuccess: () => {
                        showSuccess('Cập nhật đánh giá thành công!');
                        navigation.goBack();
                    },
                    onError: (error: any) => {
                        showError('Cập nhật đánh giá thất bại. Vui lòng thử lại.', error.message);
                        console.error('Update error:', error);
                    },
                }
            );
        } catch (error) {
            showError('Có lỗi xảy ra khi upload media, vui lòng thử lại sau.');
            console.error('Submit error:', error);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 30 : 0}
        >
            <PrimaryHeader title="Chỉnh Sửa Đánh Giá" onBackPress={handleBackPress} />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Rating Section */}
                <View style={styles.section}>
                    <Text style={styles.label}>Điểm:</Text>
                    <View style={styles.starsContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity
                                key={star}
                                onPress={() => handleStarPress(star)}
                                activeOpacity={0.7}
                            >
                                <Image
                                    source={starIcon}
                                    style={[
                                        styles.starIcon,
                                        { tintColor: star <= rating ? Colors.warning : Colors.grayLight }
                                    ]}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Title Section */}
                <View style={styles.section}>
                    <Text style={styles.label}>Tiêu Đề</Text>
                    <TextInput
                        style={styles.titleInput}
                        placeholder="Nhập tiêu đề đánh giá"
                        placeholderTextColor={Colors.gray}
                        value={title}
                        onChangeText={setTitle}
                        maxLength={100}
                    />
                    <Text style={styles.charCount}>{title.length}/100</Text>
                </View>

                {/* Content Section */}
                <View style={styles.section}>
                    <Text style={styles.label}>Nội Dung</Text>
                    <TextInput
                        style={styles.contentInput}
                        placeholder="Nhập nội dung đánh giá của bạn..."
                        placeholderTextColor={Colors.gray}
                        value={content}
                        onChangeText={setContent}
                        multiline
                        numberOfLines={6}
                        maxLength={500}
                        textAlignVertical="top"
                    />
                    <Text style={styles.charCount}>{content.length}/500</Text>
                </View>

                {/* Media Section */}
                <View style={styles.section}>
                    <Text style={styles.label}>Hình Ảnh / Video</Text>

                    <View style={styles.imagesContainer}>
                        {/* Existing Media */}
                        {existingMedia.map((media) => (
                            <View key={media.id} style={styles.imageWrapper}>
                                {media.type === MediaType.Video ? (
                                    <View style={styles.previewImage}>
                                        <Video
                                            source={{ uri: media.url }}
                                            style={StyleSheet.absoluteFill}
                                            resizeMode="cover"
                                            paused={true}
                                            controls={false}
                                        />
                                        <View style={styles.playIconContainer}>
                                            <Image source={playVideoIcon} style={styles.playIcon} />
                                        </View>
                                    </View>
                                ) : (
                                    <Image source={{ uri: media.url }} style={styles.previewImage} />
                                )}
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => handleRemoveExistingMedia(media.id)}
                                    disabled={isDeletingMedia}
                                >
                                    <Image source={deleteIcon} style={styles.deleteIcon} />
                                </TouchableOpacity>
                            </View>
                        ))}

                        {/* New Selected Media */}
                        {selectedMedia.map((media, index) => (
                            <View key={`new-${index}`} style={styles.imageWrapper}>
                                {media.type === MediaType.Video ? (
                                    <View style={styles.previewImage}>
                                        <Video
                                            source={{ uri: media.uri }}
                                            style={StyleSheet.absoluteFill}
                                            resizeMode="cover"
                                            paused={true}
                                            controls={false}
                                        />
                                        <View style={styles.playIconContainer}>
                                            <Image source={playVideoIcon} style={styles.playIcon} />
                                        </View>
                                    </View>
                                ) : (
                                    <Image source={{ uri: media.uri }} style={styles.previewImage} />
                                )}
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => handleRemoveNewMedia(index)}
                                >
                                    <Image source={deleteIcon} style={styles.deleteIcon} />
                                </TouchableOpacity>
                            </View>
                        ))}

                        {/* Add Media Button */}
                        {(existingMedia.length + selectedMedia.length) < 5 && (
                            <TouchableOpacity
                                style={styles.addImageButton}
                                onPress={handleMediaPick}
                                disabled={isSubmitting}
                            >
                                <Image source={addIcon} style={styles.addIcon} />
                            </TouchableOpacity>
                        )}
                    </View>
                    <Text style={styles.imageHint}>Tổng cộng tối đa 5 media (hình ảnh hoặc video)</Text>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator size="small" color={Colors.textWhite} />
                    ) : (
                        <Text style={styles.submitButtonText}>Cập Nhật Đánh Giá</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default UpdateReviewScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.textWhite,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: ifTablet(20, 16),
        paddingBottom: ifTablet(40, 30),
    },
    section: {
        marginBottom: ifTablet(24, 20),
    },
    label: {
        fontSize: ifTablet(16, 14),
        fontFamily: 'Sora-SemiBold',
        fontWeight: '600',
        color: Colors.textDark,
        marginBottom: ifTablet(12, 10),
    },
    starsContainer: {
        flexDirection: 'row',
        gap: ifTablet(12, 8),
    },
    starIcon: {
        width: ifTablet(40, 36),
        height: ifTablet(40, 36),
    },
    titleInput: {
        borderWidth: 1,
        borderColor: Colors.grayLight,
        borderRadius: ifTablet(12, 10),
        padding: ifTablet(14, 12),
        fontSize: ifTablet(15, 13),
        fontFamily: 'Sora-Regular',
        color: Colors.textDark,
        backgroundColor: Colors.textWhite,
    },
    contentInput: {
        borderWidth: 1,
        borderColor: Colors.grayLight,
        borderRadius: ifTablet(12, 10),
        padding: ifTablet(14, 12),
        fontSize: ifTablet(15, 13),
        fontFamily: 'Sora-Regular',
        color: Colors.textDark,
        backgroundColor: Colors.textWhite,
        minHeight: ifTablet(150, 120),
    },
    charCount: {
        fontSize: ifTablet(12, 10),
        fontFamily: 'Sora-Regular',
        color: Colors.gray,
        textAlign: 'right',
        marginTop: ifTablet(6, 4),
    },
    imagesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: ifTablet(12, 10),
    },
    imageWrapper: {
        width: ifTablet(100, 90),
        height: ifTablet(100, 90),
        position: 'relative',
    },
    previewImage: {
        width: '100%',
        height: '100%',
        borderRadius: ifTablet(12, 10),
        backgroundColor: Colors.grayLight,
    },
    playIconContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: ifTablet(12, 10),
    },
    playIcon: {
        width: ifTablet(40, 30),
        height: ifTablet(40, 30),
        tintColor: 'white',
    },
    deleteButton: {
        position: 'absolute',
        top: ifTablet(6, 4),
        right: ifTablet(6, 4),
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: ifTablet(16, 14),
        padding: ifTablet(6, 5),
    },
    deleteIcon: {
        width: ifTablet(16, 14),
        height: ifTablet(16, 14),
        tintColor: Colors.textWhite,
    },
    addImageButton: {
        width: ifTablet(100, 90),
        height: ifTablet(100, 90),
        borderRadius: ifTablet(12, 10),
        borderWidth: 2,
        borderColor: Colors.primary,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary + '10',
    },
    addIcon: {
        width: ifTablet(40, 36),
        height: ifTablet(40, 36),
        tintColor: Colors.primary,
    },
    submitButton: {
        backgroundColor: Colors.primary,
        borderRadius: ifTablet(12, 10),
        paddingVertical: ifTablet(16, 14),
        alignItems: 'center',
        marginTop: ifTablet(20, 16),
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        fontSize: ifTablet(16, 14),
        fontFamily: 'Sora-SemiBold',
        fontWeight: '600',
        color: Colors.textWhite,
    },
    imageHint: {
        fontSize: ifTablet(12, 10),
        fontFamily: 'Sora-Regular',
        color: Colors.gray,
        marginTop: ifTablet(8, 6),
    },
})
