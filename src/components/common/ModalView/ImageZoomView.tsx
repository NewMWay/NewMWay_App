import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import { Modal } from 'react-native';
import Video from 'react-native-video';
import YoutubePlayer from 'react-native-youtube-iframe';
import { ifTablet } from '../../../utils/responsives/responsive';

const { width, height } = Dimensions.get('window');

interface ImageZoomViewProps {
    imageUri?: string;
    type?: 'image' | 'video';
    onClose?: () => void;
}

const ImageZoomView: React.FC<ImageZoomViewProps> = ({ imageUri, type = 'image', onClose }) => {
    const visible = !!imageUri;
    const [loading, setLoading] = useState(true);

    // Function to extract YouTube video ID
    const getYouTubeVideoId = (url: string): string | null => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };


    const handleClose = () => {
        onClose?.();
    };

    if (!visible) return null;

    return (
        <Modal visible={visible} transparent={true} onRequestClose={handleClose}>
            <View style={styles.overlay}>
                <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                    <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContainer}
                    maximumZoomScale={type === 'image' ? 5 : 1}  // Disable zoom for video
                    minimumZoomScale={1}
                    zoomScale={1}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    {type === 'image' ? (
                        <Image
                            source={{ uri: imageUri }}
                            style={styles.media}
                            resizeMode="contain"
                            onLoadStart={() => setLoading(true)}
                            onLoadEnd={() => setLoading(false)}
                            onError={() => setLoading(false)}
                        />
                    ) : type === 'video' ? (
                        (() => {
                            const videoId = getYouTubeVideoId(imageUri || '');
                            if (videoId) {
                                // YouTube video
                                return (
                                    <YoutubePlayer
                                        videoId={videoId}
                                        height={ifTablet(height * 0.9, height * 0.5)}
                                        width={ifTablet(width * 0.9, width * 0.9)}
                                        onReady={() => setLoading(false)}
                                        onError={() => setLoading(false)}
                                    />
                                );
                            } else {
                                // Regular video
                                return (
                                    <Video
                                        source={{ uri: imageUri }}
                                        style={styles.media}
                                        controls={true}
                                        resizeMode="contain"
                                        onLoadStart={() => setLoading(true)}
                                        onLoad={() => setLoading(false)}
                                        onError={() => setLoading(false)}
                                    />
                                );
                            }
                        })()
                    ) : null}
                    {loading && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="white" />
                        </View>
                    )}
                </ScrollView>
            </View>
        </Modal>
    );
};

export default ImageZoomView;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
    },
    scrollView: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: height,
    },
    media: {
        width: width,
        height: height,
    },
    loadingContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: ifTablet(width * 0.6, width * 0.9),
        height: ifTablet(height * 0.6, height * 0.7),
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: ifTablet(30, 25),
        width: ifTablet(60, 50),
        height: ifTablet(60, 50),
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeText: {
        color: 'white',
        fontSize: ifTablet(30, 25),
        fontWeight: 'bold',
    },
});