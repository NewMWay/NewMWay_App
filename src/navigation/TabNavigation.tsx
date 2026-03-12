import { Animated, Image, Platform, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ifTablet } from '../utils/responsives/responsive';
import { Colors } from '../assets/styles/colorStyles';
import HomeStack from './stacks/HomeStack';
import ChatStack from './stacks/ChatStack';
import ShoppingStack from './stacks/ShoppingStack';
import ProfileStack from './stacks/ProfileStack';
import FilterStack from './stacks/FilterStack';
import SearchStack from './stacks/SearchStack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import CartStack from './stacks/CartStack';
import { useGetCart } from '../features/cart/hooks/useCart.hook';
import { useAuthStore } from '../stores/authStore.zustand';
// import { useGetCart } from '../features/cart/hooks/useCart.hook';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const homeIcon = require('../assets/icons/icons8-home-48.png');
const chatIcon = require('../assets/icons/icons8-chat-48.png');
const shoppingIcon = require('../assets/icons/icons8-shop-48.png');
const cartIcon = require('../assets/icons/icons8-cart-48-3.png');
const profileIcon = require('../assets/icons/icons8-person-48-3.png');


const TabIcon: React.FC<{ focused: boolean; iconSource: any }> = ({ focused, iconSource }) => {
    // const {data: cartData} = useGetCart();

    const scale = new Animated.Value(focused ? 1.2 : 1);
    const translateY = new Animated.Value(focused ? -5 : 0);
    const iconSize = Platform.OS === 'android' ? 20 : ifTablet(30, 24);
    // React.useEffect(() => {
    //     Animated.timing(scale, {
    //         toValue: focused ? 1.2 : 1,
    //         duration: 200,
    //         useNativeDriver: true,
    //     }).start();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [focused]);

    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(scale, {
                toValue: focused ? 1.2 : 1,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: focused ? (Platform.OS === 'android' ? 0 : -10) : 0, // Android không đẩy lên vì không có text
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [focused]); // Chạy lại khi trạng thái focused thay đổi

    return (
        <Animated.View style={{ transform: [{ scale }, { translateY }] }}>
            <Image
                source={iconSource}
                style={{
                    width: iconSize,
                    height: iconSize,
                    tintColor: focused ? Colors.textWhite : Colors.textWhite,
                }}
            />
        </Animated.View>
    );
};


const getTabBarIcon = (iconSource: any) => ({ focused }: { focused: boolean }) => (
    <TabIcon focused={focused} iconSource={iconSource} />
)

const ShopIcon: React.FC<{ focused: boolean; iconSource: any }> = ({ focused, iconSource }) => {
    const scale = new Animated.Value(focused ? 1.1 : 1);

    React.useEffect(() => {
        Animated.timing(scale, {
            toValue: focused ? 1.1 : 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [focused]);

    return (
        <View style={styles.shopContainerWrapper}>
            {/* 1. Lớp Cong Màu Nâu (mô phỏng đường cắt) */}
            <View style={styles.semicircleBackground} />
            <View style={styles.glowCircle} />
            {/* 2. Nút Icon Trắng Nổi */}
            <View style={styles.shopButtonContainer}>
                <Animated.View style={{ transform: [{ scale }] }}>
                    <Image
                        source={iconSource}
                        style={styles.shopIconStyle}
                    />
                </Animated.View>
            </View>
        </View>
    );
};

const getShopTabBarIcon = (iconSource: any) => ({ focused }: { focused: boolean }) => (
    <ShopIcon focused={focused} iconSource={iconSource} />
)



const MainTab = () => {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const { data: cartData } = useGetCart({ enabled: isLoggedIn });
    const cartItemCount = cartData?.cartItems?.length || 0;
    const lastTabPressTime = React.useRef<number>(0);
    const TAB_PRESS_DEBOUNCE = 300; // 300ms debounce

    const handleTabPress = (callback: () => void) => {
        const now = Date.now();
        if (now - lastTabPressTime.current < TAB_PRESS_DEBOUNCE) {
            return; // Ignore rapid tab presses
        }
        lastTabPressTime.current = now;
        callback();
    };

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: true,
                // eslint-disable-next-line react/no-unstable-nested-components
                tabBarLabel: ({ focused }) => {
                    // Ẩn tên tab trên Android
                    if (Platform.OS === 'android') {
                        return null;
                    }
                    if (focused && !(route.name === 'Mua Sắm' && ifTablet(true, false))) {
                        return (
                            <Text style={styles.titleStyle}>
                                {route.name}
                            </Text>
                        )
                    }
                    // Trả về null khi không focused để ẩn tiêu đề
                    return null;
                },
                tabBarAccessibilityLabel: route.name,
                tabBarHideOnKeyboard: true, // Ẩn tab bar khi bàn phím xuất hiện
                animation: 'none', // Tắt animation để tránh conflict với scroll
                // tabBarLabelStyle: {
                //     fontSize: ifTablet(16, 12),
                //     fontFamily: 'Sora-Regular',
                //     marginTop: ifTablet(10, 5),
                // },
                tabBarStyle: {
                    backgroundColor: Colors.primary,
                    // backgroundColor: Colors.textWhite,
                    // position: 'absolute',
                    height: Platform.OS === 'android' ? 60 : 90,
                    paddingTop: Platform.OS === 'android' ? 8 : 10,
                    paddingBottom: Platform.OS === 'android' ? 8 : 0,
                    borderRadius: 10,
                    paddingHorizontal: ifTablet(50, 10),
                    // marginBottom: ifTablet(20, 10),
                    // display: route?.name === "Quét Mã" ? 'none' : 'flex',
                },
                tabBarActiveTintColor: Colors.textWhite,
                tabBarInactiveTintColor: Colors.textWhite,
                tabBarItemStyle: {
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    padding: 0,
                    paddingVertical: Platform.OS === 'android' ? 0 : 10,
                    flexDirection: ifTablet('column', 'column'),
                }
            })}
        >
            <Tab.Screen
                name="Trang Chủ"
                component={HomeStack}
                options={{
                    tabBarIcon: getTabBarIcon(homeIcon),
                    // ẩn safe area ở phần top cho tab này

                }}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        handleTabPress(() => {
                            navigation.navigate('Trang Chủ', {
                                screen: 'HomeScreen'
                            });
                        });
                    },
                })}
            />
            <Tab.Screen
                name="Tin Nhắn"
                component={ChatStack}
                options={{
                    tabBarIcon: getTabBarIcon(chatIcon),
                    // tabBarBadge: 3,
                    tabBarStyle: { display: 'none' }, // Hide this tab
                }}
            />
            <Tab.Screen
                name="Mua Sắm"
                component={ShoppingStack}
                options={{
                    tabBarIcon: getShopTabBarIcon(shoppingIcon),
                }}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        handleTabPress(() => {
                            navigation.navigate('Mua Sắm', {
                                screen: 'ShoppingListScreen'
                            });
                        });
                    },
                })}
            />
            <Tab.Screen
                name="Giỏ Hàng"
                component={CartStack}
                options={{
                    tabBarIcon: getTabBarIcon(cartIcon),
                    tabBarBadge: cartItemCount > 0 ? cartItemCount : undefined,
                    tabBarStyle: { display: 'none' }, // Hide this tab
                }}
            />
            <Tab.Screen
                name="Cá Nhân"
                component={ProfileStack}
                options={{
                    tabBarIcon: getTabBarIcon(profileIcon),
                    tabBarStyle: { display: 'none' }, // Hide this tab
                }}
            />
        </Tab.Navigator>
    )
}

const TabNavigation = () => {
    return (
        <SafeAreaProvider>
            {/* <LinearGradient colors={Gradients.backgroundPrimary} style={styles.safeArea}> */}

            <SafeAreaView edges={Platform.OS === 'android' ? ['right', 'left', 'bottom'] : ['right', 'left']} style={styles.safeArea}>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="MainTabs" component={MainTab} />
                    <Stack.Screen
                        name="FilterStack"
                        component={FilterStack}
                        options={{
                            // presentation: 'modal',
                            animation: 'fade_from_bottom',
                            animationDuration: 300
                        }}
                    />
                    <Stack.Screen
                        name="SearchStack"
                        component={SearchStack}
                        options={{
                            // presentation: 'modal',
                            animation: 'fade_from_bottom',
                            animationDuration: 300
                        }}
                    />
                </Stack.Navigator>
            </SafeAreaView>
            {/* </LinearGradient> */}
        </SafeAreaProvider>
    )
}

export default TabNavigation

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    titleStyle: {
        fontSize: Platform.OS === 'android' ? 9 : ifTablet(14, 10),
        color: Colors.textWhite,
        fontFamily: 'Sora-SemiBold',
        marginTop: Platform.OS === 'android' ? 1 : ifTablet(0, 2),
        marginLeft: ifTablet(5, 0),
        zIndex: 10,
    },
    glowCircle: {
        width: Platform.OS === 'android' ? 65 : ifTablet(90, 80),
        height: Platform.OS === 'android' ? 65 : ifTablet(90, 80),
        // borderTopLeftRadius: 50,
        // borderTopRightRadius: 50,
        // borderBottomLeftRadius: 2,
        // borderBottomRightRadius: 2,
        borderRadius: Platform.OS === 'android' ? 32.5 : ifTablet(45, 40),
        backgroundColor: Colors.textWhite,
        opacity: 0.6,
        position: 'absolute',
        top: Platform.OS === 'android' ? -17 : -30,
        zIndex: 1.5,
    },

    shopButtonContainer: {
        width: Platform.OS === 'android' ? 50 : ifTablet(70, 60),
        height: Platform.OS === 'android' ? 50 : ifTablet(70, 60),
        borderRadius: Platform.OS === 'android' ? 25 : ifTablet(35, 30),
        backgroundColor: Colors.textWhite,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: Platform.OS === 'android' ? -10 : -20,
        zIndex: 2,
        shadowColor: '#ffffffff',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 10,
        borderWidth: Platform.OS === 'android' ? 3 : 5,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },

    shopContainerWrapper: {
        width: Platform.OS === 'android' ? 50 : ifTablet(70, 60),
        height: Platform.OS === 'android' ? 60 : 75,
        alignItems: 'center',
        position: 'relative',
    },

    semicircleBackground: {
        width: Platform.OS === 'android' ? 75 : ifTablet(100, 90),
        height: Platform.OS === 'android' ? 75 : ifTablet(100, 90),
        backgroundColor: Colors.primary,
        borderRadius: Platform.OS === 'android' ? 37.5 : ifTablet(50, 45),
        position: 'absolute',
        top: Platform.OS === 'android' ? -22 : -35,
        zIndex: 1,
    },

    shopIconStyle: {
        width: Platform.OS === 'android' ? 24 : ifTablet(35, 28),
        height: Platform.OS === 'android' ? 24 : ifTablet(35, 28),
        tintColor: Colors.primary,
    },
})
