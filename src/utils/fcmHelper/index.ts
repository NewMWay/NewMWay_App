import notifee, { EventType, Event } from '@notifee/react-native';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { PermissionsAndroid, PermissionStatus } from 'react-native';
import type { NavigationContainerRef } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';

// Store navigation reference globally
let navigationRef: React.RefObject<NavigationContainerRef<any> | null> | null = null;

// Function to set navigation ref from App.tsx
export const setNavigationRef = (ref: React.RefObject<NavigationContainerRef<any> | null>) => {
    navigationRef = ref;
    console.log('Navigation ref set in fcmHelper');
};

// Helper function to navigate to chat screen
const navigateToChatScreen = () => {
    console.log('Attempting to navigate to ChatListScreen...');
    console.log('Navigation ref exists:', !!navigationRef?.current);

    if (navigationRef?.current) {
        try {
            // First, get current route to understand navigation state
            const currentRoute = (navigationRef.current as any).getCurrentRoute();
            console.log('Current route:', currentRoute?.name);

            // Strategy 1: Try nested navigation
            console.log('Trying Strategy 1: Nested navigation');
            (navigationRef.current as any).navigate('TabNavigation', {
                screen: 'MainTabs',
                params: {
                    screen: 'Tin Nhắn',
                    params: {
                        screen: 'ChatListScreen',
                        params: {
                            autoOpenAdmin: true, // Auto open admin chat
                        },
                    },
                },
            });

            // If navigation doesn't work after 500ms, try reset
            setTimeout(() => {
                if (navigationRef?.current) {
                    console.log('Trying Strategy 2: Reset navigation');
                    navigationRef.current.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [
                                {
                                    name: 'TabNavigation',
                                    state: {
                                        routes: [
                                            {
                                                name: 'MainTabs',
                                                state: {
                                                    routes: [
                                                        { name: 'Trang Chủ' },
                                                        { name: 'Tin Nhắn' },
                                                        { name: 'Mua Sắm' },
                                                        { name: 'Giỏ Hàng' },
                                                        { name: 'Cá Nhân' },
                                                    ],
                                                    index: 1, // Focus on "Tin Nhắn" tab (index 1)
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        })
                    );
                    console.log('Reset navigation dispatched');
                }
            }, 500);

            console.log('Navigation to ChatListScreen initiated');
        } catch (error) {
            console.error('Navigation error:', error);
        }
    } else {
        console.log('Navigation ref not available yet');
    }
};

// Định nghĩa kiểu trả về là Promise<string | null>
export const getFcmToken = async (): Promise<string | null> => {
    let token: string | null = null;
    await checkApplicationNotificationPermission();
    await registerAppWithFCM();
    try {
        token = await messaging().getToken();
        console.log('getFcmToken-->', token);
    } catch (error) {
        console.log('getFcmToken Device Token error ', error);
    }
    return token;
};

export async function registerAppWithFCM(): Promise<void> {
    if (!messaging().isDeviceRegisteredForRemoteMessages) {
        try {
            const status = await messaging().registerDeviceForRemoteMessages();
            console.log('registerDeviceForRemoteMessages status', status);
        } catch (error) {
            console.log('registerDeviceForRemoteMessages error ', error);
        }
    }
}

export async function unRegisterAppWithFCM(): Promise<void> {
    if (messaging().isDeviceRegisteredForRemoteMessages) {
        try {
            await messaging().unregisterDeviceForRemoteMessages();
        } catch (error) {
            console.log('unregisterDeviceForRemoteMessages error ', error);
        }
    }
    await messaging().deleteToken();
}

export const checkApplicationNotificationPermission = async (): Promise<void> => {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('Authorization status:', authStatus);
    }

    // Thêm kiểu PermissionStatus cho kết quả trả về
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)
        .then((result: PermissionStatus) => {
            console.log('POST_NOTIFICATIONS status:', result);
        })
        .catch(error => {
            console.log('POST_NOTIFICATIONS error ', error);
        });
};

export function registerListenerWithFCM(): () => void {
    const unsubscribe = messaging().onMessage(async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        console.log('onMessage Received : ', JSON.stringify(remoteMessage));
        if (
            remoteMessage?.notification?.title &&
            remoteMessage?.notification?.body
        ) {
            onDisplayNotification(
                remoteMessage.notification.title,
                remoteMessage.notification.body,
                remoteMessage?.data,
            );
        }
    });

    // Sử dụng destructing với kiểu Event từ Notifee
    notifee.onForegroundEvent(({ type, detail }: Event) => {
        switch (type) {
            case EventType.DISMISSED:
                console.log('User dismissed notification', detail.notification);
                break;
            case EventType.PRESS:
                console.log('User pressed notification', detail.notification);

                const dataRaw = detail.notification?.data;
                if (dataRaw?.JsonData) {
                    try {
                        // 1. Parse chuỗi JSON string ra object thật
                        const parsedData = JSON.parse(String(dataRaw.JsonData));
                        console.log('Dữ liệu sau khi parse:', parsedData);

                        // 2. Kiểm tra và điều hướng
                        if (parsedData.type === 'chat_message') {
                            // Chuyển sang màn hình chat với admin
                            setTimeout(() => {
                                navigateToChatScreen();
                            }, 100);
                        }
                    } catch (e) {
                        console.error("Lỗi parse JSON:", e);
                    }
                } else {
                    // Fallback: navigate anyway if no specific data
                    setTimeout(() => {
                        navigateToChatScreen();
                    }, 100);
                }
                break;
        }
    });

    messaging().onNotificationOpenedApp(async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        console.log('onNotificationOpenedApp Received', JSON.stringify(remoteMessage));

        const dataRaw = remoteMessage.data;
        if (dataRaw?.JsonData) {
            try {
                const parsedData = JSON.parse(dataRaw.JsonData as string);
                console.log('Background notification data:', parsedData);

                if (parsedData.type === 'chat_message') {
                    setTimeout(() => {
                        navigateToChatScreen();
                    }, 500);
                }
            } catch (e) {
                console.error('Error parsing background notification:', e);
            }
        } else {
            // Fallback: navigate anyway
            setTimeout(() => {
                navigateToChatScreen();
            }, 500);
        }
    });

    messaging()
        .getInitialNotification()
        .then((remoteMessage: FirebaseMessagingTypes.RemoteMessage | null) => {
            if (remoteMessage) {
                console.log('Notification caused app to open from quit state:', remoteMessage.notification);
                const dataRaw = remoteMessage.data;
                if (dataRaw?.JsonData) {
                    try {
                        const parsedData = JSON.parse(dataRaw.JsonData as string);
                        console.log('Quit state notification data:', parsedData);

                        // Delay để Navigation Container kịp mount
                        setTimeout(() => {
                            if (parsedData.type === 'chat_message') {
                                navigateToChatScreen();
                            }
                        }, 1500);
                    } catch (e) {
                        console.error('Error parsing quit state notification:', e);
                    }
                } else {
                    // Fallback: navigate anyway
                    setTimeout(() => {
                        navigateToChatScreen();
                    }, 1500);
                }
            }
        });

    return unsubscribe;
}

async function onDisplayNotification(
    title: string,
    body: string,
    data?: { [key: string]: any }
): Promise<void> {
    await notifee.requestPermission();

    const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
    });

    await notifee.displayNotification({
        title: title,
        body: body,
        data: data,
        android: {
            channelId,
            pressAction: {
                id: 'default',
            },
        },
    });
}