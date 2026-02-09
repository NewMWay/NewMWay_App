import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { CartStackParamList } from '../../types/navigation/navigation';
import CartScreen from '../../features/cart/screens/CartScreen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { Colors } from '../../assets/styles/colorStyles';
import ConfirmCheckoutScreen from '../../features/cart/screens/ConfirmCheckoutScreen';
import withAuth from '../../components/hoc/withAuth';
import ListAddressScreen from '../../features/cart/screens/ListAddressScreen';
import AddAddressScreen from '../../features/cart/screens/AddAddressScreen';
import EditAddressScreen from '../../features/cart/screens/EditAddressScreen';
import PaymentWebViewScreen from '../../features/cart/screens/PaymentWebViewScreen';
import PaymentSuccessScreen from '../../features/cart/screens/PaymentSuccessScreen';
import PaymentFailedScreen from '../../features/cart/screens/PaymentFailedScreen';

const Stack = createNativeStackNavigator<CartStackParamList>();
const CartStack = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['right', 'left', 'top']} style={style.safeArea}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="CartScreen" component={withAuth(CartScreen)} />
          <Stack.Screen name="ConfirmCheckoutScreen" component={withAuth(ConfirmCheckoutScreen)} />
          <Stack.Screen name="ListAddressScreen" component={withAuth(ListAddressScreen)} />
          <Stack.Screen name="AddAddressScreen" component={withAuth(AddAddressScreen)} />
          <Stack.Screen name="EditAddressScreen" component={withAuth(EditAddressScreen)} />
          <Stack.Screen name="PaymentWebViewScreen" component={withAuth(PaymentWebViewScreen)} />
          <Stack.Screen name="PaymentSuccessScreen" component={withAuth(PaymentSuccessScreen)} />
          <Stack.Screen name="PaymentFailedScreen" component={withAuth(PaymentFailedScreen)} />
        </Stack.Navigator>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default CartStack

const style = StyleSheet.create({
  safeArea: {
    flex: 1, backgroundColor: Colors.textWhite,
  },
})
