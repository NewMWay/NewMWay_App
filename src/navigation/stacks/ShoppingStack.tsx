import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react'
import { ShoppingStackParamList } from '../../types/navigation/navigation';
import ShoppingListScreen from '../../features/shop/screens/ShoppingListScreen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Platform, StyleSheet } from 'react-native';
import ProductDetailsScreen from '../../features/shop/screens/ProductDetailsScreen';
import { Colors } from '../../assets/styles/colorStyles';
import { ifTablet } from '../../utils/responsives/responsive';
import AllReviewsScreen from '../../features/shop/screens/AllReviewsScreen';
// import UpdateReviewScreen from '../../features/shop/screens/UpdateReviewScreen';

const Stack = createNativeStackNavigator<ShoppingStackParamList>();

const ShoppingStack = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['right', 'left', 'top']} style={style.safeArea}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'fade', // Tắt animation để tránh conflict
            contentStyle: { backgroundColor: 'white' },
            gestureEnabled: false, // Tắt gesture để tránh conflict
          }}
        >
          <Stack.Screen
            name="ShoppingListScreen"
            component={ShoppingListScreen}
            listeners={({ navigation }) => ({
              focus: () => {
                navigation.getParent()?.setOptions({
                  tabBarStyle: {
                    backgroundColor: Colors.primary,
                    height: Platform.OS === 'android' ? 105 : 90,
                    paddingTop: 10,
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
            //   animationDuration: 3000,
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
          <Stack.Screen
            name="AllReviewsScreen"
            component={AllReviewsScreen}
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

          {/* <Stack.Screen
            name="UpdateReviewScreen"
            component={UpdateReviewScreen}
            listeners={({ navigation }) => ({
              focus: () => {
                navigation.getParent()?.setOptions({
                  tabBarStyle: {
                    display: 'none',
                  },
                });
              },
            })}
          /> */}


        </Stack.Navigator>
      </SafeAreaView>
    </SafeAreaProvider>
  )

}

export default ShoppingStack

const style = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'white' },
})
