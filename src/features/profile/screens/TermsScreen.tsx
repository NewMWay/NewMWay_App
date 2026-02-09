import { StyleSheet, Text, View, ScrollView,Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader'
import { Colors } from '../../../assets/styles/colorStyles'
import { ifTablet } from '../../../utils/responsives/responsive'
import { ProfileStackNavigationProp } from '../../../types/navigation/navigation'
import { TERMS_OF_SERVICE, POLICY_UPDATE_DATE, POLICY_WEB_URL } from '../../../constants/policyData'
import WebView from 'react-native-webview'

const TermsScreen = () => {
    const navigation = useNavigation<ProfileStackNavigationProp>()
    const [showWebView, setShowWebView] = useState(false)
        const shiledIcon = require('../../../assets/icons/icons8-shield-48.png');
const arrowIcon = require('../../../assets/icons/icons8-forward-48.png')
    const webIcon = require('../../../assets/icons/icons8-global-48.png')

    if (showWebView) {
        return (
            <View style={styles.container}>
                <PrimaryHeader title="Chi Tiết Điều Khoản" onBackPress={() => setShowWebView(false)} />
                <WebView
                    source={{ uri: POLICY_WEB_URL }}
                    startInLoadingState={true}
                    renderLoading={() => (
                        <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
                    )}
                />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <PrimaryHeader title="Điều Khoản Sử Dụng" onBackPress={() => navigation.goBack()} />
            
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {/* Header Card */}
                    <View style={styles.headerCard}>
                        <Image source={shiledIcon} style={{width: ifTablet(40, 36), height: ifTablet(40, 36), tintColor: Colors.primary}} />
                        <Text style={styles.headerTitle}>Điều Khoản Sử Dụng</Text>
                        <Text style={styles.updateDate}>Cập nhật: {POLICY_UPDATE_DATE}</Text>
                    </View>

                    {/* Content Card */}
                    <View style={styles.contentCard}>
                        <Text style={styles.text}>{TERMS_OF_SERVICE}</Text>
                    </View>

                    {/* View Detail Button */}
                    <TouchableOpacity 
                        style={styles.detailButton}
                        onPress={() => setShowWebView(true)}
                        activeOpacity={0.7}
                    >
                        <Image source={webIcon} style={{width: ifTablet(22, 20), height: ifTablet(22, 20), tintColor: Colors.textWhite}} />
                        <Text style={styles.detailButtonText}>Xem Chi Tiết Đầy Đủ</Text>
                        <Image source={arrowIcon} style={{width: ifTablet(22, 20), height: ifTablet(22, 20), tintColor: Colors.textWhite}} />
                    </TouchableOpacity>

                    {/* Note */}
                    <View style={styles.noteCard}>
                        <Image source={shiledIcon} style={{width: ifTablet(20, 18), height: ifTablet(20, 18), tintColor: Colors.textWhite}} />
                        <Text style={styles.noteText}>
                            Bằng cách sử dụng dịch vụ, bạn đồng ý với các điều khoản này.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default TermsScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.grayLight,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: ifTablet(20, 16),
    },
    loader: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -25 }, { translateY: -25 }],
    },
    headerCard: {
        backgroundColor: Colors.textWhite,
        borderRadius: ifTablet(16, 14),
        padding: ifTablet(24, 20),
        alignItems: 'center',
        marginBottom: ifTablet(16, 14),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    headerTitle: {
        fontSize: ifTablet(20, 18),
        fontFamily: 'Sora-Bold',
        color: Colors.textDark,
        marginTop: ifTablet(12, 10),
        marginBottom: ifTablet(8, 6),
    },
    updateDate: {
        fontSize: ifTablet(12, 11),
        fontFamily: 'Sora-Regular',
        color: Colors.textGray,
        fontStyle: 'italic',
    },
    contentCard: {
        backgroundColor: Colors.textWhite,
        borderRadius: ifTablet(16, 14),
        padding: ifTablet(20, 16),
        marginBottom: ifTablet(16, 14),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    text: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-Regular',
        color: Colors.textDark,
        lineHeight: ifTablet(24, 22),
    },
    detailButton: {
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: ifTablet(16, 14),
        paddingHorizontal: ifTablet(24, 20),
        borderRadius: ifTablet(12, 10),
        marginBottom: ifTablet(16, 14),
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    detailButtonText: {
        fontSize: ifTablet(15, 14),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textWhite,
        marginHorizontal: ifTablet(10, 8),
    },
    noteCard: {
        flexDirection: 'row',
        backgroundColor: Colors.success || '#E3F2FD',
        borderRadius: ifTablet(12, 10),
        padding: ifTablet(16, 14),
        alignItems: 'center',
        marginBottom: ifTablet(20, 16),
    },
    noteText: {
        flex: 1,
        fontSize: ifTablet(13, 12),
        fontFamily: 'Sora-Regular',
        color: Colors.textWhite,
        marginLeft: ifTablet(12, 10),
        lineHeight: ifTablet(20, 18),
    },
})
