import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
} from 'react-native'
import React from 'react'
import { Colors } from '../../../assets/styles/colorStyles'
import { ifTablet } from '../../../utils/responsives/responsive'

interface ImageUploadPreviewProps {
    images: { uri: string; name: string }[]
    onRemove: (index: number) => void
    message?: string
}

const ImageUploadPreview: React.FC<ImageUploadPreviewProps> = ({
    images,
    onRemove,
    // message,
}) => {
    const deleteIcon = require('../../../assets/icons/icons8-delete-48.png')

    if (images.length === 0) return null

    return (
        <View style={styles.container}>
            <View style={styles.uploadCard}>
                {/* Image count */}
                <Text style={styles.imageCountText}>{images.length} ảnh</Text>

                {/* Image preview - Horizontal Scroll */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.imagesScrollContent}
                >
                    {images.map((image, index) => (
                        <View key={index} style={styles.imageContainer}>
                            <Image source={{ uri: image.uri }} style={styles.previewImage} resizeMode="cover" />
                            <TouchableOpacity onPress={() => onRemove(index)} style={styles.deleteButton}>
                                <Image source={deleteIcon} style={styles.deleteIcon} />
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>
    )
}

export default ImageUploadPreview

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.primary,
        borderRadius: 12,
        padding: ifTablet(12, 10),
        marginVertical: ifTablet(8, 6),
        alignSelf: 'flex-end',
        maxWidth: '100%',
        maxHeight: ifTablet(220, 180),
    },
    uploadCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 8,
        padding: ifTablet(10, 8),
        alignSelf: 'flex-start',
    },
    imageCountText: {
        fontSize: ifTablet(13, 12),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textWhite,
        marginBottom: ifTablet(10, 8),
        textAlign: 'center',
    },
    imagesScrollContent: {
        gap: ifTablet(8, 6),
    },
    imageContainer: {
        position: 'relative',
    },
    previewImage: {
        width: ifTablet(200, 160),
        height: ifTablet(200, 160),
        borderRadius: 8,
        backgroundColor: Colors.grayLight,
    },
    deleteButton: {
        position: 'absolute',
        top: ifTablet(8, 6),
        right: ifTablet(8, 6),
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: ifTablet(16, 14),
        padding: ifTablet(6, 5),
    },
    deleteIcon: {
        width: ifTablet(16, 14),
        height: ifTablet(16, 14),
        tintColor: Colors.textWhite,
    },
})
