import React from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from 'react-native';
import { ifTablet } from '../../utils/responsives/responsive';
import { Colors } from '../../assets/styles/colorStyles';
import RenderHTML from 'react-native-render-html';

const { height: screenHeight } = Dimensions.get('window');

interface BottomModalProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    content: string;
}

const BottomModal: React.FC<BottomModalProps> = ({
    visible,
    onClose,
    title,
    content,
}) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={onClose}
                />
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.dragIndicator} />
                        <Text style={styles.title}>{title}</Text>
                    </View>

                    {/* Content */}
                    <ScrollView
                        style={styles.scrollContainer}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        bounces={false}
                    >
                        <RenderHTML
                            contentWidth={Dimensions.get('window').width - (ifTablet(48, 40))}
                            source={{ html: content }}
                            baseStyle={styles.contentText}
                        />
                    </ScrollView>

                    {/* Bottom Button */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={onClose}
                        >
                            <Text style={styles.closeButtonText}>Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    modalContainer: {
        backgroundColor: 'white',
        borderTopLeftRadius: ifTablet(24, 20),
        borderTopRightRadius: ifTablet(24, 20),
        maxHeight: screenHeight * 0.8,
        minHeight: screenHeight * 0.6,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 20,
    },
    header: {
        alignItems: 'center',
        paddingTop: ifTablet(16, 12),
        paddingBottom: ifTablet(20, 16),
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    dragIndicator: {
        width: ifTablet(40, 35),
        height: ifTablet(4, 3),
        backgroundColor: '#d1d5db',
        borderRadius: ifTablet(2, 1.5),
        marginBottom: ifTablet(16, 12),
    },
    title: {
        fontSize: ifTablet(20, 18),
        fontFamily: 'Sora-Bold',
        fontWeight: '700',
        color: Colors.textDark,
        textAlign: 'center',
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: ifTablet(24, 20),
        paddingVertical: ifTablet(20, 16),
        paddingBottom: ifTablet(32, 24),
    },
    contentText: {
        fontSize: ifTablet(15, 14),
        fontFamily: 'Sora-Regular',
        lineHeight: ifTablet(24, 22),
        color: Colors.textDark,
        textAlign: 'justify',
    },
    buttonContainer: {
        padding: ifTablet(24, 20),
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    },
    closeButton: {
        backgroundColor: Colors.primary,
        paddingVertical: ifTablet(16, 14),
        borderRadius: ifTablet(12, 10),
        alignItems: 'center',
        shadowColor: Colors.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    closeButtonText: {
        fontSize: ifTablet(16, 15),
        fontFamily: 'Sora-SemiBold',
        fontWeight: '600',
        color: 'white',
    },
});

export default BottomModal;