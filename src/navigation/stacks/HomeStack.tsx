import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../types/navigation/navigation';
import HomeScreen from '../../features/home/screens/HomeScreen';
import ProductDetailsScreen from '../../features/shop/screens/ProductDetailsScreen';
import { Platform } from 'react-native';
import { Colors } from '../../assets/styles/colorStyles';
import { ifTablet } from '../../utils/responsives/responsive';

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
      animation: 'fade', // Tắt animation để tránh conflict với scroll animations
      contentStyle: { backgroundColor: 'white' },
      gestureEnabled: false, // Tắt gesture để tránh conflict
    }}>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        listeners={({ navigation }) => ({
          focus: () => {
            navigation.getParent()?.setOptions({
              tabBarStyle: {
                backgroundColor: Colors.primary,
                height: Platform.OS === 'android' ? 60 : 90,
                paddingTop: Platform.OS === 'android' ? 8 : 10,
                paddingBottom: Platform.OS === 'android' ? 8 : 0,
                borderRadius: 10,
                paddingHorizontal: ifTablet(50, 10),
                display: 'flex',
              },
            });
          },
        })}
      />

      <Stack.Screen
        name="ProductDetailsScreen"
        component={ProductDetailsScreen}
        // options={{
        //   animation: 'slide_from_right',
        //   animationDuration: 300,
        // }}
        listeners={({ navigation }) => ({
          focus: () => {
            navigation.getParent()?.setOptions({
              tabBarStyle: {
                display: 'none',
              },
            });
          },
        })}
      />

    </Stack.Navigator>
  )
}

export default HomeStack

