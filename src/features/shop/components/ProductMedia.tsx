import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { ifTablet } from '../../../utils/responsives/responsive'
import { Colors } from '../../../assets/styles/colorStyles'
import Video from 'react-native-video'

const { width, height } = Dimensions.get('window')

type ProductMediaProps = {
    _id: string,
    images: string[],
    heightPercent?: number,
    variants?: Array<{
        id: string;
        name: string;
        images: string[];
    }>,
    onVariantChange?: (variantId: string | null) => void;
    optionValueStock?: { [key: string]: Array<{ value: string; optionValueId: string }> } | null;
    selectedOptions?: { [key: string]: string };
    onOptionSelect?: (optionName: string, value: string) => void;
    onImagePress?: (uri: string, type?: 'image' | 'video') => void;
}

const ProductMedia: React.FC<ProductMediaProps> = ({ _id, images, heightPercent, variants, onVariantChange, optionValueStock, selectedOptions = {}, onOptionSelect, onImagePress }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedVariantIndex, setSelectedVariantIndex] = useState<number | null>(null);
    const [_selectedVariantImageIndex, setSelectedVariantImageIndex] = useState<number | null>(null);
    const mainFlatListRef = useRef<FlatList>(null);
    const playVideoIcon = require('../../../assets/icons/icons8-play-video-48.png');
    const [isPlayingMap, setIsPlayingMap] = useState(new Map<string, boolean>());

    React.useEffect(() => {
        setActiveIndex(0);
        setSelectedVariantIndex(null);
        setSelectedVariantImageIndex(null);

        if (onOptionSelect && selectedOptions) {
            Object.keys(selectedOptions).forEach(optionName => {
                onOptionSelect(optionName, '');
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_id]);

    useEffect(() => {
        if (onVariantChange) {
            const selectedVariantId = selectedVariantIndex !== null && variants && variants[selectedVariantIndex]
                ? variants[selectedVariantIndex].id
                : null;
            onVariantChange(selectedVariantId);
        }
    }, [selectedVariantIndex, variants, onVariantChange]);

    // Combine all images: main images + all variant images with metadata
    const getAllImagesWithMetadata = () => {
        let allImages: Array<{ id: string; image: string; variantIndex?: number; variantName?: string; isMainImage: boolean }> = [];

        // Add main images
        images.forEach((img, index) => {
            allImages.push({
                id: `main_${index}`,
                image: img,
                isMainImage: true
            });
        });

        // Add variant images
        if (variants && variants.length > 0) {
            variants.forEach((variant, variantIndex) => {
                variant.images.forEach((img, imageIndex) => {
                    allImages.push({
                        id: `variant_${variantIndex}_${imageIndex}`,
                        image: img,
                        variantIndex,
                        variantName: variant.name,
                        isMainImage: false
                    });
                });
            });
        }

        return allImages;
    };

    const dataMedia = getAllImagesWithMetadata();
    const mediaHeight = heightPercent ? (height * heightPercent / 100) : height * 0.45;

    // Create thumbnail data with variant info - only variant images
    const getThumbnailData = () => {
        let thumbnails: Array<{ id: string; image: string; variantIndex?: number; imageIndex: number; isMainImage: boolean }> = [];

        // Only add variant images (no main images in thumbnails)
        if (variants && variants.length > 0) {
            variants.forEach((variant, variantIndex) => {
                variant.images.forEach((img, imageIndex) => {
                    thumbnails.push({
                        id: `variant_${variantIndex}_${imageIndex}`,
                        image: img,
                        variantIndex,
                        imageIndex,
                        isMainImage: false
                    });
                });
            });
        }

        return thumbnails;
    };

    const thumbnailData = getThumbnailData();

    const renderMediaItem = ({ item }: { item: { id: string; image: string; variantIndex?: number; variantName?: string; isMainImage: boolean } }) => {
        // Function to extract YouTube video ID
        const getYouTubeVideoId = (url: string): string | null => {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.match(regExp);
            return (match && match[2].length === 11) ? match[2] : null;
        };

        // Check if the item is a video (file extension or YouTube)
        const videoId = getYouTubeVideoId(item.image);
        const isYouTube = !!videoId;
        const isVideoFile = /\.(mp4|mov|webm|avi|mkv)$/i.test(item.image);
        const isVideo = isVideoFile || isYouTube;
        const isPlaying = isPlayingMap.get(item.id) || false;

        return (
            <View style={[styles.mediaContainer, { width, height: mediaHeight }]}>
                <TouchableOpacity
                    style={styles.imageTouchable}
                    onPress={() => onImagePress?.(item.image, isVideo ? 'video' : 'image')}
                    activeOpacity={0.9}
                >
                    {isYouTube ? (
                        <Image
                            source={{ uri: `https://img.youtube.com/vi/${videoId}/0.jpg` }}
                            style={styles.mediaImage}
                            resizeMode="contain"
                        />
                    ) : isVideo ? (
                        <Video
                            source={{ uri: item.image }}
                            style={styles.mediaImage}
                            controls={true}
                            resizeMode="contain"
                            onPlaybackStateChanged={(state) => {
                                setIsPlayingMap(prev => new Map(prev).set(item.id, state.isPlaying));
                            }}
                        />
                    ) : (
                        <Image
                            source={{ uri: item.image }}
                            style={styles.mediaImage}
                            resizeMode="contain"
                        />
                    )}
                    {isVideo && !isPlaying && (
                        <Image
                            source={playVideoIcon}
                            style={styles.playIcon}
                            resizeMode="contain"
                        />
                    )}
                    {/* Variant Badge */}
                    {!item.isMainImage && item.variantName && (
                        <View style={styles.variantBadge}>
                            <Text style={styles.variantBadgeText}>{item.variantName}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>
        );
    }
    const handleScroll = (event: any) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / width);
        setActiveIndex(index);

        // Auto-select variant when scrolling to variant image
        const currentItem = dataMedia[index];
        if (currentItem && !currentItem.isMainImage && currentItem.variantIndex !== undefined) {
            if (selectedVariantIndex !== currentItem.variantIndex) {
                setSelectedVariantIndex(currentItem.variantIndex);
            }
        } else if (currentItem?.isMainImage && selectedVariantIndex !== null) {
            // Deselect variant when scrolling back to main images
            setSelectedVariantIndex(null);
        }
    };

    const handleThumbnailPress = (thumbnailItem: any) => {
        // Find the index in dataMedia where this variant image appears
        const targetIndex = dataMedia.findIndex(
            item => item.variantIndex === thumbnailItem.variantIndex &&
                item.id === thumbnailItem.id
        );

        if (targetIndex !== -1) {
            setSelectedVariantIndex(thumbnailItem.variantIndex);
            setSelectedVariantImageIndex(thumbnailItem.imageIndex);
            setActiveIndex(targetIndex);

            mainFlatListRef.current?.scrollToIndex({
                index: targetIndex,
                animated: true,
            });
        }
    };

    // Get display text for variant section
    const getVariantDisplayText = () => {
        if (!variants || variants.length === 0) return null;

        if (selectedVariantIndex !== null) {
            return `Đang xem: ${variants[selectedVariantIndex].name}`;
        }

        return `Có ${variants.length} biến thể - vuốt để xem tất cả`;
    };

    const renderPagination = () => {
        const currentPosition = activeIndex + 1;
        const totalImages = dataMedia.length;

        return (
            <View style={styles.paginationContainer}>
                <Text style={styles.paginationText}>
                    {currentPosition}/{totalImages}
                </Text>
            </View>
        );
    };

    const renderThumbnail = ({ item }: { item: any }) => {
        // Check if this thumbnail's variant is currently being viewed
        const isSelected = selectedVariantIndex === item.variantIndex;

        return (
            <TouchableOpacity
                style={[
                    styles.thumbnailContainer,
                    isSelected && styles.activeThumbnailContainer
                ]}
                onPress={() => handleThumbnailPress(item)}
            >
                <Image
                    source={{ uri: item.image }}
                    style={styles.thumbnailImage}
                    resizeMode="contain"
                />
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.wrapper}>
            <View style={[styles.container, { height: mediaHeight }]} >
                <FlatList
                    ref={mainFlatListRef}
                    data={dataMedia}
                    renderItem={renderMediaItem}
                    keyExtractor={(item) => item.id}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    contentContainerStyle={styles.flatListContent}
                    getItemLayout={(data, index) => ({
                        length: width,
                        offset: width * index,
                        index,
                    })}
                />
                {renderPagination()}
            </View>

            {variants && variants.length > 0 && (
                <View style={styles.bottomSection}>
                    {/* Variant Name or Count */}
                    <Text style={styles.variantName}>
                        {getVariantDisplayText()}
                    </Text>

                    {/* Thumbnail List */}
                    <FlatList
                        data={thumbnailData}
                        renderItem={renderThumbnail}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.thumbnailListContainer}
                    />
                </View>
            )}

            {optionValueStock && Object.keys(optionValueStock).length > 0 && (
                <View style={styles.optionsContainer}>
                    {Object.entries(optionValueStock).map(([optionName, options]) => (
                        <View key={optionName} style={styles.optionGroup}>
                            <Text style={styles.optionLabel}>{optionName}:</Text>
                            <View style={styles.optionValuesContainer}>
                                {options.map((option) => {
                                    const isSelected = selectedOptions[optionName] === option.value;
                                    return (
                                        <TouchableOpacity
                                            key={option.optionValueId}
                                            style={[
                                                styles.optionValueButton,
                                                isSelected && styles.optionValueButtonSelected
                                            ]}
                                            onPress={() => {
                                                if (isSelected) {
                                                    onOptionSelect?.(optionName, '');
                                                } else {
                                                    onOptionSelect?.(optionName, option.value);
                                                }
                                            }}
                                        >
                                            <Text style={[
                                                styles.optionValueText,
                                                isSelected && styles.optionValueTextSelected
                                            ]}>
                                                {option.value}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                    ))}
                </View>
            )}
        </View>
    )
}

export default ProductMedia

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        backgroundColor: 'white',
    },
    container: {
        width: '100%',
        backgroundColor: 'white',
    },
    mediaContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: ifTablet(0, 10),
        paddingVertical: ifTablet(0, 10),
    },
    mediaImage: {
        width: ifTablet('100%', '100%'),
        height: ifTablet('150%', '100%'),
    },
    imageTouchable: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',

    },
    playIcon: {
        position: 'absolute',
        width: ifTablet(60, 40),
        height: ifTablet(60, 40),
        tintColor: 'white',
    },
    variantBadge: {
        position: 'absolute',
        top: ifTablet(16, 12),
        left: ifTablet(16, 12),
        backgroundColor: 'rgba(238, 77, 45, 0.9)',
        paddingHorizontal: ifTablet(12, 10),
        paddingVertical: ifTablet(6, 5),
        borderRadius: ifTablet(8, 6),
        maxWidth: '80%',
    },
    variantBadgeText: {
        color: 'white',
        fontSize: ifTablet(13, 11),
        fontFamily: 'Sora-SemiBold',
        fontWeight: '600',
    },
    flatListContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    paginationContainer: {
        position: 'absolute',
        bottom: ifTablet(24, 16),
        right: ifTablet(24, 16),
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: ifTablet(16, 12),
        paddingVertical: ifTablet(8, 6),
        borderRadius: ifTablet(20, 16),
        minWidth: ifTablet(60, 50),
        alignItems: 'center',
    },
    paginationText: {
        color: 'white',
        fontSize: ifTablet(16, 14),
        fontFamily: 'Sora-Medium',
        textAlign: 'center',
    },
    bottomSection: {
        paddingHorizontal: ifTablet(20, 16),
        paddingVertical: ifTablet(16, 12),
        backgroundColor: 'white',
    },
    variantName: {
        fontSize: ifTablet(16, 14),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
        marginBottom: ifTablet(12, 8),
        textAlign: 'center',
    },
    thumbnailListContainer: {
        justifyContent: 'center',
        paddingHorizontal: ifTablet(8, 4),
    },
    thumbnailContainer: {
        width: ifTablet(60, 50),
        height: ifTablet(60, 50),
        borderRadius: ifTablet(8, 6),
        marginHorizontal: ifTablet(4, 3),
        borderWidth: 2,
        borderColor: 'transparent',
        overflow: 'hidden',
    },
    activeThumbnailContainer: {
        borderColor: Colors.pricePrimary,
    },
    thumbnailImage: {
        width: '100%',
        height: '100%',
    },
    optionsContainer: {
        paddingHorizontal: ifTablet(20, 16),
        paddingVertical: ifTablet(12, 8),
        backgroundColor: 'white',
    },
    optionGroup: {
        marginBottom: ifTablet(16, 12),
    },
    optionLabel: {
        fontSize: ifTablet(16, 14),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
        marginBottom: ifTablet(8, 6),
    },
    optionValuesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: ifTablet(8, 6),
    },
    optionValueButton: {
        paddingHorizontal: ifTablet(16, 12),
        paddingVertical: ifTablet(8, 6),
        borderRadius: ifTablet(8, 6),
        borderWidth: 1,
        borderColor: Colors.gray,
        backgroundColor: 'white',
    },
    optionValueButtonSelected: {
        borderColor: Colors.pricePrimary,
        backgroundColor: Colors.priceBackground,
    },
    optionValueText: {
        fontSize: ifTablet(14, 12),
        fontFamily: 'Sora-Regular',
        color: Colors.textDark,
    },
    optionValueTextSelected: {
        fontFamily: 'Sora-SemiBold',
        color: Colors.pricePrimary,
    },
})