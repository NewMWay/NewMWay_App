import { StyleSheet, Text, View, ScrollView, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader'
import { Colors } from '../../../assets/styles/colorStyles'
import { ifTablet } from '../../../utils/responsives/responsive'
import { ProfileStackNavigationProp } from '../../../types/navigation/navigation'

const AppVersionScreen = () => {
    const navigation = useNavigation<ProfileStackNavigationProp>()
    const logo = require('../../../assets/images/logo/LOGO-NEW-WAY-TEAK-WOOD-02.png')

    // Hardcoded version info - sẽ được lấy từ package.json hoặc config
    const appVersion = '1.3'
    const buildNumber = '100'
    const releaseDate = '12/03/2026'

    return (
        <View style={styles.container}>
            <PrimaryHeader title="Phiên Bản Ứng Dụng" onBackPress={() => navigation.goBack()} />

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <View style={styles.logoContainer}>
                        <Image source={logo} style={styles.logo} />
                    </View>

                    {/* <Text style={styles.appName}>NEWMWAY Teak Wood</Text> */}

                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Phiên bản:</Text>
                            <Text style={styles.infoValue}>{appVersion}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Build:</Text>
                            <Text style={styles.infoValue}>{buildNumber}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Ngày phát hành:</Text>
                            <Text style={styles.infoValue}>{releaseDate}</Text>
                        </View>
                    </View>

                    <View style={styles.updateSection}>
                        <Text style={styles.updateTitle}>Có gì mới trong phiên bản này?</Text>
                        <Text style={styles.updateItem}>• Cải thiện hiệu suất ứng dụng</Text>
                        <Text style={styles.updateItem}>• Sửa lỗi giao diện trên một số thiết bị</Text>
                        <Text style={styles.updateItem}>• Sửa SplashScreen</Text>

                    </View>

                    <Text style={styles.copyright}>
                        © 2026 NEWMWAY Teak Wood{'\n'}
                        All rights reserved
                    </Text>
                </View>
            </ScrollView>
        </View>
    )
}

export default AppVersionScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.grayLight,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: ifTablet(24, 20),
        alignItems: 'center',
    },
    logoContainer: {
        marginTop: ifTablet(40, 30),
        marginBottom: ifTablet(24, 20),
    },
    logo: {
        width: ifTablet(300, 240),
        height: ifTablet(250, 150),
        resizeMode: 'contain',
    },
    appName: {
        fontSize: ifTablet(22, 18),
        fontFamily: 'Sora-Bold',
        color: Colors.primary,
        marginBottom: ifTablet(32, 24),
    },
    infoCard: {
        width: '100%',
        backgroundColor: Colors.textWhite,
        borderRadius: ifTablet(16, 12),
        padding: ifTablet(20, 16),
        marginBottom: ifTablet(24, 20),
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: ifTablet(12, 10),
    },
    infoLabel: {
        fontSize: ifTablet(15, 14),
        fontFamily: 'Sora-Regular',
        color: Colors.textDark,
    },
    infoValue: {
        fontSize: ifTablet(15, 14),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.grayLight,
    },
    updateSection: {
        width: '100%',
        backgroundColor: Colors.textWhite,
        borderRadius: ifTablet(16, 12),
        padding: ifTablet(20, 16),
        marginBottom: ifTablet(24, 20),
    },
    updateTitle: {
        fontSize: ifTablet(16, 15),
        fontFamily: 'Sora-Bold',
        color: Colors.textDark,
        marginBottom: ifTablet(16, 12),
    },
    updateItem: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-Regular',
        color: Colors.primaryDark,
        lineHeight: ifTablet(24, 22),
        marginBottom: ifTablet(8, 6),
    },
    copyright: {
        fontSize: ifTablet(13, 12),
        fontFamily: 'Sora-Regular',
        color: Colors.primaryDark,
        textAlign: 'center',
        marginTop: ifTablet(24, 20),
        lineHeight: ifTablet(20, 18),
    },
})
