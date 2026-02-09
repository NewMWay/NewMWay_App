import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Colors } from '../../../assets/styles/colorStyles'
import { ifTablet } from '../../../utils/responsives/responsive'

interface ProfileHeaderProps {
    scrollY: Animated.Value
    isHeaderCollapsed: boolean
    avatar: string | null
    fullName: string | null
    username: string
    email: string
    phone: string
    isEditMode: boolean
    onSettingsPress: () => void
    onChangeAvatar: () => void
    onBackPress?: () => void
}

const ProfileHeader = ({
    scrollY,
    avatar,
    fullName,
    username,
    onSettingsPress,
    isEditMode,
    onChangeAvatar,
    onBackPress,
}: ProfileHeaderProps) => {
    const logo = require('../../../assets/images/logo/LOGO-NEW-WAY-TEAK-WOOD-02.png')
    const settingsIcon = require('../../../assets/icons/icons8-settings-48.png')
    const cameraIcon = require('../../../assets/icons/icons8-camera-48.png')
    const backIcon = require('../../../assets/icons/icons8-back-48.png')
    const SCROLL_THRESHOLD = ifTablet(150, 120)
    const HEADER_EXPANDED_HEIGHT = ifTablet(280, 200)
    const HEADER_COLLAPSED_HEIGHT = 0

    const headerBackgroundColor = scrollY.interpolate({
        inputRange: [0, SCROLL_THRESHOLD],
        outputRange: ['#FFFFFF', '#FFFFFF'],
        extrapolate: 'clamp',
    })

    const headerHeight = scrollY.interpolate({
        inputRange: [0, SCROLL_THRESHOLD],
        outputRange: [HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT],
        extrapolate: 'clamp',
    })

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, SCROLL_THRESHOLD * 0.7, SCROLL_THRESHOLD],
        outputRange: [1, 0.3, 0],
        extrapolate: 'clamp',
    })

    return (
        <Animated.View style={[
            styles.animatedHeader,
            {
                height: headerHeight,
                backgroundColor: headerBackgroundColor,
                opacity: headerOpacity,
            }
        ]}>
            {onBackPress && (
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={onBackPress}
                >
                    <Image source={backIcon} style={styles.backIcon} />
                </TouchableOpacity>
            )}

            {!isEditMode && (
                <TouchableOpacity
                    style={styles.settingsButton}
                    onPress={onSettingsPress}
                >
                    <Image source={settingsIcon} style={styles.settingsIcon} />
                </TouchableOpacity>
            )}

            <View style={styles.logoContainer}>
                <Image source={logo} style={styles.headerLogo} />
            </View>

            <View style={styles.avatarContainer}>
                <View style={styles.avatarWrapper}>
                    {avatar ? (
                        <Image
                            source={{ uri: avatar }}
                            style={styles.avatar}
                        />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarPlaceholderText}>
                                {(fullName || username).charAt(0).toUpperCase()}
                            </Text>
                        </View>
                    )}
                    {isEditMode && (
                        <TouchableOpacity
                            style={styles.cameraOverlay}
                            onPress={onChangeAvatar}
                            activeOpacity={0.7}
                        >
                            <Image
                                source={cameraIcon}
                                style={styles.cameraIcon}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </Animated.View>
    )
}

export default ProfileHeader

const styles = StyleSheet.create({
    animatedHeader: {
        width: '100%',
        overflow: 'visible',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerLogo: {
        width: ifTablet(300, 240),
        height: ifTablet(180, 180),
        resizeMode: 'contain',
        marginBottom: ifTablet(8, 6),
    },
    brand: {
        fontSize: ifTablet(20, 16),
        fontFamily: 'Sora-SemiBold',
        fontWeight: '600',
        color: Colors.textDark,
        textAlign: 'center',
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: ifTablet(12, 10),
        fontFamily: 'Sora-Regular',
        color: Colors.textGray,
        marginTop: ifTablet(2, 1),
        textAlign: 'center',
        letterSpacing: 2,
    },
    backButton: {
        position: 'absolute',
        top: ifTablet(60, 10),
        left: ifTablet(24, 16),
        padding: ifTablet(12, 8),
        zIndex: 10,
    },
    backIcon: {
        width: ifTablet(28, 24),
        height: ifTablet(28, 24),
        tintColor: Colors.textDark,
    },
    settingsButton: {
        position: 'absolute',
        top: ifTablet(60, 10),
        right: ifTablet(24, 16),
        padding: ifTablet(12, 8),
        zIndex: 10,
    },
    settingsIcon: {
        width: ifTablet(28, 24),
        height: ifTablet(28, 24),
        tintColor: Colors.textDark,
    },
    avatarContainer: {
        position: 'absolute',
        bottom: ifTablet(20, 16),
        left: ifTablet(24, 16),
        zIndex: 5,
    },
    avatarWrapper: {
        width: ifTablet(80, 70),
        height: ifTablet(80, 70),
        borderRadius: ifTablet(40, 35),
        backgroundColor: Colors.textWhite,
        padding: ifTablet(3, 2),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 5,
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: ifTablet(37, 33),
        backgroundColor: Colors.gray,
    },
    avatarPlaceholder: {
        width: '100%',
        height: '100%',
        borderRadius: ifTablet(37, 33),
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarPlaceholderText: {
        fontSize: ifTablet(32, 28),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textWhite,
    },
    cameraOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: ifTablet(40, 35),
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    cameraIcon: {
        width: ifTablet(32, 24),
        height: ifTablet(32, 24),
        tintColor: Colors.textWhite,
    },
})
