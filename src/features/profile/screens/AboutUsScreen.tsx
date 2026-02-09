import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Linking } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader'
import { Colors } from '../../../assets/styles/colorStyles'
import { ifTablet } from '../../../utils/responsives/responsive'
import { ProfileStackNavigationProp } from '../../../types/navigation/navigation'

const AboutUsScreen = () => {
    const navigation = useNavigation<ProfileStackNavigationProp>()
    const logo = require('../../../assets/images/logo/LOGO-NEW-WAY-TEAK-WOOD-02.png')

    const handleContactPress = (type: 'phone' | 'email' | 'website' | 'shopee' | 'tiktok' | 'facebook') => {
        switch (type) {
            case 'phone':
                Linking.openURL('tel:+84964397011')
                break
            case 'email':
                Linking.openURL('mailto:newmwayteakwood@gmail.com')
                break
            case 'website':
                Linking.openURL('https://newmwayteakwood.vn')
                break
            case 'shopee':
                Linking.openURL('https://shopee.vn/newwayteakwood')
                break
            case 'tiktok':
                Linking.openURL('https://www.tiktok.com/@newmway_teakwood')
                break
            case 'facebook':
                Linking.openURL('https://www.facebook.com/thotgoteak.newwayteakwood')
                break
        }
    }

    return (
        <View style={styles.container}>
            <PrimaryHeader title="Về Chúng Tôi" onBackPress={() => navigation.goBack()} />
            
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <View style={styles.logoContainer}>
                        <Image source={logo} style={styles.logo} />
                    </View>

                    {/* <Text style={styles.companyName}>NEWMWAY Teak Wood</Text> */}
                    
                    <Text style={styles.sectionTitle}>Giới thiệu</Text>
                    <Text style={styles.description}>
                        NEWMWAY Teak Wood chuyên cung cấp các sản phẩm gỗ teak cao cấp, 
                        với chất lượng vượt trội và thiết kế tinh tế. Chúng tôi cam kết 
                        mang đến cho khách hàng những sản phẩm tốt nhất từ nguồn gỗ bền vững.
                    </Text>

                    <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>
                    
                    <TouchableOpacity 
                        style={styles.contactItem}
                        onPress={() => handleContactPress('phone')}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.contactLabel}>Điện thoại:</Text>
                        <Text style={styles.contactValue}>+84 96 439 7011</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.contactItem}
                        onPress={() => handleContactPress('email')}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.contactLabel}>Email:</Text>
                        <Text style={styles.contactValue}>newmwayteakwood@gmail.com</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.contactItem}
                        onPress={() => handleContactPress('website')}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.contactLabel}>Website:</Text>
                        <Text style={styles.contactValue}>https://newmwayteakwood.vn</Text>
                    </TouchableOpacity>
                    
                    <View style={styles.contactItem}>
                        <Text style={styles.contactLabel}>Địa chỉ:</Text>
                        <Text style={styles.contactValue}>
                           22G1,đường 63, phường Tân Phong, Quận 7, TP. Hồ Chí Minh
                        </Text>
                    </View>

                    <Text style={styles.sectionTitle}>Mạng xã hội</Text>

                    <TouchableOpacity 
                        style={styles.contactItem}
                        onPress={() => handleContactPress('facebook')}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.contactLabel}>Facebook:</Text>
                        <Text style={styles.contactValue}>thotgoteak.newwayteakwood</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.contactItem}
                        onPress={() => handleContactPress('tiktok')}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.contactLabel}>TikTok:</Text>
                        <Text style={styles.contactValue}>@newmway_teakwood</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.contactItem}
                        onPress={() => handleContactPress('shopee')}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.contactLabel}>Shopee:</Text>
                        <Text style={styles.contactValue}>newwayteakwood</Text>
                    </TouchableOpacity>

                    
                </View>
            </ScrollView>
        </View>
    )
}

export default AboutUsScreen

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
        paddingBottom: ifTablet(40, 60),
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: ifTablet(24, 20),
    },
    logo: {
        width: ifTablet(300, 240),
        height: ifTablet(250, 150),
        resizeMode: 'contain',
    },
    companyName: {
        fontSize: ifTablet(24, 20),
        fontFamily: 'Sora-Bold',
        color: Colors.primary,
        textAlign: 'center',
        marginBottom: ifTablet(32, 24),
    },
    sectionTitle: {
        fontSize: ifTablet(18, 16),
        fontFamily: 'Sora-Bold',
        color: Colors.textDark,
        marginBottom: ifTablet(12, 10),
        marginTop: ifTablet(20, 16),
    },
    description: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-Regular',
        color: Colors.primaryDark,
        lineHeight: ifTablet(24, 22),
        marginBottom: ifTablet(16, 12),
    },
    contactItem: {
        backgroundColor: Colors.textWhite,
        padding: ifTablet(16, 14),
        borderRadius: ifTablet(12, 10),
        marginBottom: ifTablet(12, 10),
    },
    contactLabel: {
        fontSize: ifTablet(13, 12),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textGray,
        marginBottom: ifTablet(4, 3),
    },
    contactValue: {
        fontSize: ifTablet(15, 14),
        fontFamily: 'Sora-Regular',
        color: Colors.textDark,
        lineHeight: ifTablet(22, 20),
    },
})
