import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useUploadImage, useUploadVideo } from '../hooks/useMediaUpload.hook'
import { UploadImageRequest, UploadVideoRequest } from '../types/mediaUpload.type'
import { useCreateProductReview } from '../hooks/useProductQuery.hook'
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader'
import { Colors } from '../../../assets/styles/colorStyles'
import { ifTablet } from '../../../utils/responsives/responsive'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { ProfileStackNavigationProp, ProfileStackParamList } from '../../../types/navigation/navigation'
import { launchImageLibrary } from 'react-native-image-picker'
import { useToast } from '../../../utils/toasts/useToast'
import { MediaType } from '../types/media.enum'
import Video from 'react-native-video'

const CreateReviewScreen = () => {
    const navigation = useNavigation<ProfileStackNavigationProp>();
    const route = useRoute<RouteProp<ProfileStackParamList, 'CreateReviewScreen'>>();
    const productVariantId = route.params.productVariantId;
    const { showSuccess, showError } = useToast();

    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedMedia, setSelectedMedia] = useState<Array<{ uri: string, type: MediaType, name: string }>>([]);
    const [uploadedMediaUrls, setUploadedMediaUrls] = useState<Array<{ url: string, type: MediaType }>>([]);

    const { mutate: uploadImage, isPending: isUploadingImage } = useUploadImage();
    const { mutate: uploadVideo, isPending: isUploadingVideo } = useUploadVideo();
    const { mutate: createReview, isPending: isCreatingReview } = useCreateProductReview();


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
        if (selectedMedia.length >= 5) {
            showError('Chỉ được chọn tối đa 5 media');
            return;
        }

        const result = await launchImageLibrary({
            mediaType: 'mixed', // Allow both photo and video
            quality: 0.8,
            selectionLimit: 5 - selectedMedia.length,
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

    const handleRemoveMedia = (index: number) => {
        const newMedia = selectedMedia.filter((_, i) => i !== index);
        setSelectedMedia(newMedia);
        const newUrls = uploadedMediaUrls.filter((_, i) => i !== index);
        setUploadedMediaUrls(newUrls);
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

                // const uploadFunction = media.type === MediaType.Video ? uploadVideo : uploadImage;

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
            let medias: { url: string, type: MediaType }[] = [];

            if (selectedMedia.length > 0) {
                medias = await uploadAllMedia();
            }

            createReview(
                {
                    productVariantId: productVariantId,
                    rating: rating,
                    title: title.trim(),
                    content: content.trim(),
                    medias: medias,
                },
                {
                    onSuccess: () => {
                        showSuccess('Đánh giá thành công!');
                        navigation.goBack();
                    },
                    onError: (error) => {
                        if (error.message.includes('already rated')) {
                            showError('Bạn đã đánh giá sản phẩm này rồi.');
                            navigation.goBack();
                            return;
                        }
                        showError('Đánh giá thất bại. Vui lòng thử lại.', error.message);
                        console.error('Review error:', error);
                    },
                }
            );
        } catch (error) {
            showError('Có lỗi xảy ra khi upload ảnh hoặc video, vui lòng thử lại sau.');
            console.error('Submit error:', error);
        }
    };

    const isSubmitting = isUploadingImage || isUploadingVideo || isCreatingReview;

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 30 : 0}
        >
            <PrimaryHeader title="Đánh Giá Đơn Hàng" onBackPress={handleBackPress} />

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
                        placeholderTextColor={Colors.textGray}
                        value={title}
                        onChangeText={setTitle}
                        maxLength={100}
                    />
                </View>

                {/* Content Section */}
                <View style={styles.section}>
                    <Text style={styles.label}>Nội Dung Đánh Giá</Text>
                    <TextInput
                        style={styles.contentInput}
                        placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                        placeholderTextColor={Colors.textGray}
                        value={content}
                        onChangeText={setContent}
                        multiline
                        numberOfLines={6}
                        textAlignVertical="top"
                        maxLength={500}
                    />
                    <Text style={styles.characterCount}>{content.length}/500</Text>
                </View>

                {/* Media Section */}
                <View style={styles.section}>
                    <Text style={styles.label}>Hình Ảnh / Video ( nếu có )</Text>
                    <View style={styles.imagesContainer}>
                        {selectedMedia.map((media, index) => (
                            <View key={index} style={styles.imageWrapper}>
                                {media.type === MediaType.Video ? (
                                    <View style={styles.imagePreview}>
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
                                    <Image source={{ uri: media.uri }} style={styles.imagePreview} />
                                )}
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => handleRemoveMedia(index)}
                                    activeOpacity={0.7}
                                >
                                    <Image source={deleteIcon} style={styles.deleteIcon} />
                                </TouchableOpacity>
                            </View>
                        ))}

                        {selectedMedia.length < 5 && (
                            <TouchableOpacity
                                style={styles.addImageButton}
                                onPress={handleMediaPick}
                                activeOpacity={0.7}
                            >
                                <Image source={addIcon} style={styles.addIcon} />
                            </TouchableOpacity>
                        )}
                    </View>
                    <Text style={styles.imageHint}>Chọn tối đa 5 file (hình ảnh hoặc video)</Text>
                </View>
            </ScrollView>

            {/* Submit Button */}
            <View style={styles.submitContainer}>
                <TouchableOpacity
                    style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                    activeOpacity={0.8}
                >
                    {isSubmitting ? (
                        <ActivityIndicator size="small" color={Colors.textWhite} />
                    ) : (
                        <Text style={styles.submitButtonText}>Viết Đánh Giá</Text>
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

export default CreateReviewScreen

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
        paddingBottom: ifTablet(100, 120),
    },
    section: {
        marginBottom: ifTablet(24, 20),
    },
    label: {
        fontSize: ifTablet(15, 14),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
        marginBottom: ifTablet(12, 10),
    },
    starsContainer: {
        flexDirection: 'row',
        gap: ifTablet(12, 10),
    },
    starIcon: {
        width: ifTablet(40, 36),
        height: ifTablet(40, 36),
    },
    titleInput: {
        backgroundColor: Colors.textWhite,
        borderWidth: 1,
        borderColor: Colors.grayLight,
        borderRadius: ifTablet(12, 10),
        padding: ifTablet(14, 12),
        fontSize: ifTablet(15, 14),
        fontFamily: 'Sora-Regular',
        color: Colors.textDark,
    },
    contentInput: {
        backgroundColor: Colors.textWhite,
        borderWidth: 1,
        borderColor: Colors.grayLight,
        borderRadius: ifTablet(12, 10),
        padding: ifTablet(14, 12),
        fontSize: ifTablet(15, 14),
        fontFamily: 'Sora-Regular',
        color: Colors.textDark,
        minHeight: ifTablet(150, 130),
    },
    characterCount: {
        fontSize: ifTablet(12, 11),
        fontFamily: 'Sora-Regular',
        color: Colors.textGray,
        textAlign: 'right',
        marginTop: ifTablet(6, 4),
    },
    imagesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: ifTablet(12, 10),
    },
    imageWrapper: {
        position: 'relative',
        width: ifTablet(100, 80),
        height: ifTablet(100, 80),
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        borderRadius: ifTablet(10, 8),
        backgroundColor: Colors.grayLight,
    },
    playIconContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: ifTablet(10, 8),
    },
    playIcon: {
        width: ifTablet(40, 30),
        height: ifTablet(40, 30),
        tintColor: 'white',
    },
    deleteButton: {
        position: 'absolute',
        top: ifTablet(-6, -5),
        right: ifTablet(-6, -5),
        backgroundColor: Colors.textWhite,
        borderRadius: ifTablet(15, 12),
        padding: ifTablet(6, 5),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    deleteIcon: {
        width: ifTablet(20, 16),
        height: ifTablet(20, 16),
        tintColor: Colors.error,
    },
    addImageButton: {
        width: ifTablet(100, 80),
        height: ifTablet(100, 80),
        borderRadius: ifTablet(10, 8),
        borderWidth: 2,
        borderColor: Colors.grayLight,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    addIcon: {
        width: ifTablet(32, 28),
        height: ifTablet(32, 28),
        tintColor: Colors.textGray,
    },
    imageHint: {
        fontSize: ifTablet(12, 11),
        fontFamily: 'Sora-Regular',
        color: Colors.textGray,
        marginTop: ifTablet(8, 6),
    },
    submitContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        padding: ifTablet(20, 16),
        backgroundColor: Colors.textWhite,
        borderTopWidth: 1,
        borderTopColor: Colors.grayLight,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    submitButton: {
        backgroundColor: Colors.primary,
        borderRadius: ifTablet(12, 10),
        paddingVertical: ifTablet(16, 14),
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    submitButtonDisabled: {
        backgroundColor: Colors.textGray,
        opacity: 0.6,
    },
    submitButtonText: {
        fontSize: ifTablet(16, 15),
        fontFamily: 'Sora-Bold',
        color: Colors.textWhite,
    },
})