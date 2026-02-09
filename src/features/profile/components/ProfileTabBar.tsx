import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Colors } from '../../../assets/styles/colorStyles'
import { ifTablet } from '../../../utils/responsives/responsive'

interface ProfileTabBarProps {
    scrollY: Animated.Value
    activeTab: number
    onTabChange: (index: number) => void
}

const tabs = [
    { id: 0, label: 'Thông tin' },
    { id: 1, label: 'Đơn Hàng' },
    { id: 2, label: 'Yêu Thích' },
    { id: 3, label: 'Địa Chỉ' },
]

const ProfileTabBar = ({ scrollY, activeTab, onTabChange }: ProfileTabBarProps) => {
    const SCROLL_THRESHOLD = ifTablet(150, 120)
    const HEADER_EXPANDED_HEIGHT = ifTablet(280, 200)
    const COLLAPSED_TOP = ifTablet(60, 0)

    const tabBarTop = scrollY.interpolate({
        inputRange: [0, SCROLL_THRESHOLD],
        outputRange: [HEADER_EXPANDED_HEIGHT, COLLAPSED_TOP],
        extrapolate: 'clamp',
    })

    const backgroundOpacity = scrollY.interpolate({
        inputRange: [0, SCROLL_THRESHOLD * 0.5, SCROLL_THRESHOLD],
        outputRange: [0, 0.5, 1],
        extrapolate: 'clamp',
    })

    return (
        <Animated.View style={[styles.container, { top: tabBarTop }]}>
            <Animated.View style={[styles.backgroundCover, { opacity: backgroundOpacity }]} />
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.id}
                        style={[
                            styles.tab,
                            activeTab === tab.id && styles.activeTab
                        ]}
                        onPress={() => onTabChange(tab.id)}
                    >
                        <Text style={[
                            styles.tabLabel,
                            activeTab === tab.id && styles.activeTabLabel
                        ]}>
                            {tab.label}
                        </Text>
                        {activeTab === tab.id && <View style={styles.activeIndicator} />}
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </Animated.View>
    )
}

export default ProfileTabBar

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 999,
        backgroundColor: Colors.textWhite,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray + '30',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    backgroundCover: {
        position: 'absolute',
        top: ifTablet(-60, -50),
        left: 0,
        right: 0,
        height: ifTablet(60, 50),
        backgroundColor: Colors.textWhite,
        zIndex: 1,
    },
    scrollContent: {
        paddingHorizontal: ifTablet(32, 16),
        paddingVertical: ifTablet(12, 8),
        gap: ifTablet(16, 12),
    },
    tab: {
        paddingHorizontal: ifTablet(20, 16),
        paddingVertical: ifTablet(12, 10),
        borderRadius: ifTablet(12, 10),
        position: 'relative',
    },
    activeTab: {
        backgroundColor: Colors.primary + '10',
    },
    tabLabel: {
        fontSize: ifTablet(16, 14),
        fontFamily: 'Sora-Regular',
        color: Colors.textGray,
    },
    activeTabLabel: {
        fontFamily: 'Sora-SemiBold',
        color: Colors.primary,
    },
    activeIndicator: {
        position: 'absolute',
        bottom: 0,
        left: ifTablet(20, 16),
        right: ifTablet(20, 16),
        height: 3,
        backgroundColor: Colors.primary,
        borderRadius: ifTablet(2, 1.5),
    },
})
