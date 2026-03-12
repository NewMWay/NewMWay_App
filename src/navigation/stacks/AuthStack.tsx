import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AuthStackParamList } from '../../types/navigation/navigation'
import SpashScreen from '../../features/auth/screens/SplashScreen'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native'
import RegisterScreen from '../../features/auth/screens/RegisterScreen'
import ForgotPasswordScreen from '../../features/auth/screens/ForgotPasswordScreen'
import OtpVerificationScreen from '../../features/auth/screens/OtpVerificationScreen'
import ResetPasswordScreen from '../../features/auth/screens/ResetPasswordScreen'
import LoginScreen from '../../features/auth/screens/LoginScreen'
import { Platform } from 'react-native'

const Stack = createNativeStackNavigator<AuthStackParamList>()


const AuthStack = () => {
    return (
        <SafeAreaProvider>
            {/* với android thì bắt thêm cái bottom */}
            <SafeAreaView edges={Platform.OS === 'android' ? ['right', 'left', 'bottom'] : ['right', 'left']} style={styles.safeArea}>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: 'white' }
                    }}>
                    <Stack.Screen
                        name="SplashScreen"
                        component={SpashScreen}
                        options={{
                            animation: 'fade',
                            animationDuration: 800
                        }}
                    />
                    <Stack.Screen
                        name="LoginScreen"
                        component={LoginScreen}
                        options={{
                            animation: 'fade_from_bottom',
                            animationDuration: 300
                        }}
                    />
                    <Stack.Screen
                        name="RegisterScreen"
                        component={RegisterScreen}
                        options={{
                            animation: 'ios_from_right',
                            animationDuration: 400
                        }}
                    />
                    <Stack.Screen
                        name="ForgotPasswordScreen"
                        component={ForgotPasswordScreen}
                        options={{
                            animation: 'ios_from_right',
                            animationDuration: 400
                        }}
                    />
                    <Stack.Screen
                        name="OtpVerificationScreen"
                        component={OtpVerificationScreen}
                        options={{
                            animation: 'fade_from_bottom',
                            animationDuration: 400
                        }}
                    />
                    <Stack.Screen
                        name="ResetPasswordScreen"
                        component={ResetPasswordScreen}
                        options={{
                            animation: 'ios_from_right',
                            animationDuration: 400
                        }}
                    />

                </Stack.Navigator>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

export default AuthStack

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'white',
    },
})
