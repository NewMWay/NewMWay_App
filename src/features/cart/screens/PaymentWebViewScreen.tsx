import { ActivityIndicator, StyleSheet } from 'react-native'
import React, { useRef } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { CartStackNavigationProp } from '../../../types/navigation/navigation';
import { useDeleteCartItem } from '../hooks/useCart.hook';
import { Colors } from '../../../assets/styles/colorStyles';

const PaymentWebViewScreen = () => {
    const navigation = useNavigation<CartStackNavigationProp>();
    const route = useRoute();
    const { checkoutUrl, cartItems } = route.params as { checkoutUrl: string, cartItems: Array<{ id: string }> };
    const webViewRef = useRef<WebView>(null);

    const { mutate: deleteCartItem, isPending: isDeletingCartItem } = useDeleteCartItem();

    console.log('🌐 Navigated to PaymentWebViewScreen with URL:', checkoutUrl);
    if (isDeletingCartItem) {
        return <ActivityIndicator size="large" color={Colors.primary} />;
    }
    const deleteSelectedCartItems = () => {
        console.log('🗑️ Deleting selected cart items:', cartItems.length);
        cartItems.forEach((item) => {
            deleteCartItem({ id: item.id }, {
                onSuccess: () => {
                    console.log('✅ Deleted cart item:', item.id);
                },
                onError: (error) => {
                    console.error('❌ Failed to delete cart item:', item.id, error);
                }
            });
        });
    };


    const handleNavigationStateChange = (navState: any) => {
        console.log('🔄 WebView URL changed:', navState.url);
        console.log('📊 Navigation State:', {
            url: navState.url,
            title: navState.title,
            loading: navState.loading,
            canGoBack: navState.canGoBack,
            canGoForward: navState.canGoForward,
        });

        const url = navState.url;

        // Check if payment was successful
        if (url.includes('status=PAID') && url.includes('cancel=false')) {
            console.log('✅ Payment successful, navigating to ProfileScreen with OrderTab');
            deleteSelectedCartItems();
            // Navigate to Profile screen with Orders tab
            const parentNavigation = navigation.getParent();
            if (parentNavigation) {
                parentNavigation.reset({
                    index: 0,
                    routes: [{
                        name: 'Cá Nhân',
                        params: {
                            screen: 'ProfileScreen',
                            params: { activeTab: 1 }
                        }
                    }],
                });
            }
            return;
        }

        // Check if transaction was cancelled
        if (url.includes('cancel=true') || url.includes('status=CANCELLED')) {
            console.log('❌ Transaction cancelled, navigating to PaymentFailedScreen');
            navigation.replace('PaymentFailedScreen', { status: 'cancelled' });
        }
    };

    return (
        <WebView
            ref={webViewRef}
            source={{ uri: checkoutUrl || '' }}
            style={styles.container}
            onNavigationStateChange={handleNavigationStateChange}
        />
    )
}

export default PaymentWebViewScreen

const styles = StyleSheet.create({
    container: { flex: 1, paddingBottom: 60, }
})