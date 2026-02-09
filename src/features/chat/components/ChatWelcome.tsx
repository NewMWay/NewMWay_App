import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { Colors } from '../../../assets/styles/colorStyles'
import { ifTablet, isTablet } from '../../../utils/responsives/responsive'

interface ChatWelcomeProps {
    onStartAIChat: () => void
    onStartAdminChat: () => void
}

const ChatWelcome: React.FC<ChatWelcomeProps> = ({ onStartAIChat, onStartAdminChat }) => {
    const logo = require('../../../assets/images/logo/LOGO-NEW-WAY-TEAK-WOOD-02-1.png')

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.card}>
                {/* Logo */}
                <View style={styles.logoContainer}>
                    <Image source={logo} style={styles.logo} resizeMode="contain" />
                </View>

                {/* Welcome Text */}
                <Text style={styles.greetingText}>Chào Bạn, chào mừng bạn đến với</Text>
                <Text style={styles.brandText}>NEWMWAY TEAKWOOD</Text>
                <Text style={styles.descriptionText}>
                    Chuyên cung cấp sản phẩm đồ{'\n'}dụng nhà bếp cao cấp
                </Text>
                <Text style={styles.questionText}>
                    Bạn cần hỗ trợ gì từ chúng tôi?
                </Text>

                {/* Action Buttons */}
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.startButton} onPress={onStartAIChat}>
                        <Text style={styles.startButtonText}>Chat với AI</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.startButton, styles.adminButton]} onPress={onStartAdminChat}>
                        <Text style={styles.startButtonText}>Chat với Admin</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

export default ChatWelcome

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.textWhite,
    },
    contentContainer: {
        flexGrow: 1,
        top: isTablet() ? '20%' : '10%',
        alignItems: 'center',
        paddingVertical: ifTablet(40, 20),
    },
    card: {
        width: '90%',
        maxWidth: ifTablet(400, 340),
        backgroundColor: Colors.textWhite,
        borderRadius: 16,
        padding: ifTablet(32, 24),
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    logoContainer: {
        width: ifTablet(100, 80),
        height: ifTablet(100, 80),
        borderRadius: ifTablet(50, 40),
        backgroundColor: Colors.textWhite,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: ifTablet(24, 20),
        borderWidth: 2,
        borderColor: Colors.grayLight,
    },
    logo: {
        width: '70%',
        height: '70%',
    },
    greetingText: {
        fontSize: ifTablet(16, 14),
        fontFamily: 'Sora-Regular',
        color: Colors.textDark,
        textAlign: 'center',
        marginBottom: ifTablet(8, 6),
    },
    brandText: {
        fontSize: ifTablet(18, 16),
        fontFamily: 'Sora-Bold',
        color: Colors.primary,
        textAlign: 'center',
        marginBottom: ifTablet(16, 12),
    },
    descriptionText: {
        fontSize: ifTablet(15, 13),
        fontFamily: 'Sora-Regular',
        color: Colors.grayDark,
        textAlign: 'center',
        lineHeight: ifTablet(22, 20),
        marginBottom: ifTablet(16, 12),
    },
    questionText: {
        fontSize: ifTablet(15, 13),
        fontFamily: 'Sora-Regular',
        color: Colors.textDark,
        textAlign: 'center',
        lineHeight: ifTablet(22, 20),
        marginBottom: ifTablet(24, 20),
    },
    buttonsContainer: {
        width: '100%',
        gap: ifTablet(12, 10),
    },
    startButton: {
        width: '100%',
        height: ifTablet(56, 48),
        backgroundColor: Colors.primary,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    adminButton: {
        backgroundColor: Colors.primaryDark,
    },
    startButtonText: {
        fontSize: ifTablet(16, 15),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textWhite,
        fontWeight: '600',
    },
})
