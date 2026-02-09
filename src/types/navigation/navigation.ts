import { NativeStackNavigationProp } from '@react-navigation/native-stack';


export type AuthStackParamList = {
    'SplashScreen': undefined;
    'LoginScreen': undefined;
    'RegisterScreen': undefined;
    'ForgotPasswordScreen': undefined;
    'OtpVerificationScreen': { email: string, type: 'register' | 'forgotPassword', dataRegister?: any };
    'ResetPasswordScreen': { email: string };
};

export type HomeStackParamList = {
    'HomeScreen': undefined;
    'ProductDetailsScreen': { productId: string };
}

export type ChatStackParamList = {
    'ChatListScreen': undefined;
    'ChatScreen': { userId: string; userName: string };
}


export type ShoppingStackParamList = {
    'ShoppingListScreen': undefined;
    'ProductDetailsScreen': { productId: string };
    'AllReviewsScreen': { productId: string; productName: string };
    // 'UpdateReviewScreen': { reviewId: string; productVariantId: string };
}

export type CartStackParamList = {
    'CartScreen': undefined;
    'ConfirmCheckoutScreen': {
        selectedAddressId?: string | null;
        selectedItems?: Array<{
            id: string;
            name: string;
            price: number;
            originalPrice?: number;
            image: string;
            quantity: number;
            supplier?: string;
            variant?: string;
            totalPrice?: number;
            productVariantId: string;
            productVariantOptionValueStockId: string;
            productVariantName: string;
            optionValueId?: string | null;
            optionValueName?: string | null;
            optionId?: string | null;
            optionName?: string | null;
        }>;
    } | undefined;
    'ListAddressScreen': { fromCheckout?: boolean } | undefined;
    'AddAddressScreen': undefined;
    'EditAddressScreen': { id: string };
    'CheckoutScreen': undefined;
    'PaymentWebViewScreen': { checkoutUrl: string, cartItems: Array<{ id: string }> };
    'PaymentSuccessScreen': { id: string };
    'PaymentFailedScreen': { status: 'failed' | 'cancelled' };
}

export type ProfileStackParamList = {
    'ProfileScreen': { activeTab?: number } | undefined;
    'OrderHistoryDetailScreen': { id: string; selectedBankingId?: string };
    'CreateReviewScreen': { productVariantId: string };
    'UpdateReviewScreen': { reviewId: string; productVariantId: string };
    'SettingsScreen': undefined;
    'ChangePasswordScreen': undefined;
    'MyReviewsScreen': undefined;
    'RefundRequestScreen': undefined;
    'RefundRequestDetailScreen': { refundRequestId: string };
    'CreateRefundRequestScreen': { orderId: string };
    'UserBankingScreen': { fromCancelOrder?: boolean; orderId?: string } | undefined;
    'AddUserBankingScreen': undefined;
    'EditUserBankingScreen': { id: string };
    'AboutUsScreen': undefined;
    'TermsScreen': undefined;
    'PrivacyPolicyScreen': undefined;
    'AppVersionScreen': undefined;
    'FAQScreen': undefined;
}

export type FilterStackParamList = {
    'FilterScreen': { previousTab: keyof TabParamList } | undefined;
}

export type SearchStackParamList = {
    'SearchScreen': { previousTab: keyof TabParamList } | undefined;
    'ProductDetailsScreen': { productId: string }; // Share route with ShoppingStack
}

export type TabParamList = {
    'Trang Chủ': undefined;
    'Tin Nhắn': undefined;
    'Mua Sắm': undefined;
    'Giỏ Hàng': undefined;
    'Cá Nhân': { activeTab?: number } | undefined;
}

export type TabStackParamList = {
    MainTabs: { screen?: keyof TabParamList; params?: any };
}

export type RootStackParamList = {
    AuthStack: undefined;
    TabNavigation: { screen?: keyof TabStackParamList; params?: any } | undefined;
}

export type AuthStackNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
export type HomeStackNavigationProp = NativeStackNavigationProp<HomeStackParamList>;
export type ChatStackNavigationProp = NativeStackNavigationProp<ChatStackParamList>;
export type ShoppingStackNavigationProp = NativeStackNavigationProp<ShoppingStackParamList>;
export type CartStackNavigationProp = NativeStackNavigationProp<CartStackParamList>;
export type ProfileStackNavigationProp = NativeStackNavigationProp<ProfileStackParamList>;
export type TabStackNavigationProp = NativeStackNavigationProp<TabStackParamList>;
export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;