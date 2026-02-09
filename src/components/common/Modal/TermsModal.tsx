import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Colors } from '../../../assets/styles/colorStyles';
import WebView from 'react-native-webview';
import PrimaryHeader from '../Header/PrimaryHeader';
import { ifTablet } from '../../../utils/responsives/responsive';
import { TERMS_OF_SERVICE, PRIVACY_POLICY, POLICY_WEB_URL } from '../../../constants/policyData';

interface TermsModalProps {
    visible: boolean;
    onClose: () => void;
    title: string;
}

const TermsModal: React.FC<TermsModalProps> = ({ visible, onClose, title }) => {
    const [showWebView, setShowWebView] = useState(false);
    const policyUrl = POLICY_WEB_URL;

    // const handleViewDetail = () => {
    //     Linking.openURL(policyUrl);
    // };

    const handleBack = () => {
        setShowWebView(false);
    };

    const termsContent = title === "Điều khoản dịch vụ" ? TERMS_OF_SERVICE : PRIVACY_POLICY;

    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={styles.modalContainer}>
                {/* Kiểm tra trạng thái hiển thị WebView */}
                {showWebView ? (
                    <View style={styles.webViewContainer}>
                        <PrimaryHeader title="Chi Tiết Chính Sách" onBackPress={handleBack} />
                        <WebView
                            source={{ uri: policyUrl }}
                            startInLoadingState={true}
                            renderLoading={() => (
                                <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />

                            )}
                        />
                    </View>
                ) : (
                    <View style={styles.modalContent}>
                        <View style={styles.header}>
                            <Text style={styles.title}>{title}</Text>
                        </View>
                        <ScrollView style={styles.scrollContent}>
                            <Text style={styles.content}>{termsContent}</Text>
                        </ScrollView>
                        <TouchableOpacity onPress={() => setShowWebView(true)}>
                            <Text style={styles.linkText}>Xem chi tiết</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Text style={styles.closeButtonText}>Đóng</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContent: {
        width: '90%',
        height: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    webViewContainer: {
        paddingTop: ifTablet(50, 40),
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
    },
    loader: {
        marginTop: 20,
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.primary,
        fontFamily: 'Sora-Bold',
    },
    scrollContent: {
        marginBottom: 20,
    },
    content: {
        fontSize: 14,
        color: Colors.textDark,
        lineHeight: 22,
        fontFamily: 'Sora-Regular',
    },
    linkText: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
        textDecorationLine: 'underline',
        fontFamily: 'Sora-SemiBold',
    },
    closeButton: {
        backgroundColor: Colors.primary,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    closeButtonText: {
        color: Colors.textWhite,
        fontWeight: '600',
        fontSize: 14,
        fontFamily: 'Sora-SemiBold',
    },
});

export default TermsModal;