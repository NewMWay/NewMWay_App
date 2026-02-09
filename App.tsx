import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, StatusBar, useColorScheme, View, ActivityIndicator, StyleSheet } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { RootStackParamList } from './src/types/navigation/navigation';
import TabNavigation from './src/navigation/TabNavigation';
import AuthStack from './src/navigation/stacks/AuthStack';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/utils/toasts/toastConfig';
import { useSyncQueriesExternal } from "react-query-external-sync";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './src/stores/authStore.zustand';
import { useEffect, useRef } from 'react';
import { Colors } from './src/assets/styles/colorStyles';
import type { NavigationContainerRef } from '@react-navigation/native';
import { SignalRProvider } from './src/services/signalr/SignalRProvider';
import { getAuthToken, getRefreshAuthToken } from './src/services/stores/authStore.mmkv';
import { useProfileQuery } from './src/features/profile/hooks/useProfile.hook';
import { getFcmToken, registerListenerWithFCM, setNavigationRef } from './src/utils/fcmHelper';
// import { storage } from "./mmkv";

const queryClient = new QueryClient();


if (__DEV__) {
  require("./ReactotronConfig");
}


function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <AppContent />
        <Toast config={toastConfig} />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
const Stack = createNativeStackNavigator<RootStackParamList>();

function AppContent() {
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const userProfile = useAuthStore((state) => state.userProfile);
  const setUserProfile = useAuthStore((state) => state.setUserProfile);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);

  const { data: profileData, isSuccess: isProfileSuccess } = useProfileQuery();

  useEffect(() => {
    getFcmToken();
  }, []);

  useEffect(() => {
    // Set navigation ref for FCM helper
    setNavigationRef(navigationRef);

    const unsubscribe = registerListenerWithFCM();
    return unsubscribe;
  }, []);


  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);
  useEffect(() => {
    if (isProfileSuccess && profileData && isLoggedIn) {
      setUserProfile(profileData);
    }
  }, [isProfileSuccess, profileData, isLoggedIn, setUserProfile]);

  // Prepare SignalR user object
  const signalRUser = isLoggedIn && userProfile ? {
    username: userProfile.username,
    accessToken: getAuthToken() || '',
    refreshToken: getRefreshAuthToken(),
    role: 'User',
  } : null;

  useSyncQueriesExternal({
    queryClient,
    socketURL: "http://localhost:42831", // Default port for React Native DevTools
    deviceName: Platform?.OS || "web", // Platform detection
    platform: Platform?.OS || "web", // Use appropriate platform identifier
    deviceId: Platform?.OS || "web", // Use a PERSISTENT identifier (see note below)
    extraDeviceInfo: {
      // Optional additional info about your device
      appVersion: "1.0.0",
      // Add any relevant platform info
    },
    enableLogs: false,
    // Storage monitoring with CRUD operations
    // mmkvStorage: storage, // MMKV storage for ['#storage', 'mmkv', 'key'] queries + monitoring
    // asyncStorage: AsyncStorage, // AsyncStorage for ['#storage', 'async', 'key'] queries + monitoring
    // secureStorage: SecureStore, // SecureStore for ['#storage', 'secure', 'key'] queries + monitoring
    // secureStorageKeys: [
    //   "userToken",
    //   "refreshToken",
    //   "biometricKey",
    //   "deviceId",
    // ], // SecureStore keys to monitor
  });

  // Hiển thị loading khi đang khởi tạo auth state
  if (!isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.textWhite} />
      </View>
    );
  }

  return (
    <SignalRProvider user={signalRUser}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'white' }
          }}
          initialRouteName="TabNavigation">
          <Stack.Screen
            name="TabNavigation"
            component={TabNavigation}
            options={{
              animation: 'fade',
              animationDuration: 500,
              gestureEnabled: false // Disable gesture navigation for this transition
            }}
          />

          <Stack.Screen
            name="AuthStack"
            component={AuthStack}
            options={{
              animation: 'fade',
              animationDuration: 500
            }}
          />
        </Stack.Navigator>
        {/* <Toast /> */}
      </NavigationContainer>
    </SignalRProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
});

export default App;
