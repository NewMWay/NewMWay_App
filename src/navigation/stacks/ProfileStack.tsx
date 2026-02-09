import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ProfileStackParamList } from '../../types/navigation/navigation'
import ProfileScreen from '../../features/profile/screens/ProfileScreen'
import withAuth from '../../components/hoc/withAuth'
import OrderHistoryDetailScreen from '../../features/profile/screens/OrderHistoryDetailScreen'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native'
import CreateReviewScreen from '../../features/shop/screens/CreateReviewScreen'
import SettingsScreen from '../../features/profile/screens/SettingsScreen'
import ChangePasswordScreen from '../../features/profile/screens/ChangePasswordScreen'
import MyReviewsScreen from '../../features/profile/screens/MyReviewsScreen'
import RefundRequestScreen from '../../features/profile/screens/RefundRequestScreen'
import AboutUsScreen from '../../features/profile/screens/AboutUsScreen'
import TermsScreen from '../../features/profile/screens/TermsScreen'
import PrivacyPolicyScreen from '../../features/profile/screens/PrivacyPolicyScreen'
import AppVersionScreen from '../../features/profile/screens/AppVersionScreen'
import FAQScreen from '../../features/profile/screens/FAQScreen'
import UserBankingScreen from '../../features/profile/screens/UserBankingScreen'
import AddUserBankingScreen from '../../features/profile/screens/AddUserBankingScreen'
import EditUserBankingScreen from '../../features/profile/screens/EditUserBankingScreen'
import UpdateReviewScreen from '../../features/shop/screens/UpdateReviewScreen'
import CreateRefundRequestScreen from '../../features/profile/screens/CreateRefundRequestScreen'
import RefundRequestDetailScreen from '../../features/profile/screens/RefundRequestDetailScreen'


const Stack = createNativeStackNavigator<ProfileStackParamList>()

const ProfileStack = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['right', 'left', 'top']} style={style.safeArea}>

        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="ProfileScreen" component={withAuth(ProfileScreen)} />
          <Stack.Screen name="OrderHistoryDetailScreen" component={withAuth(OrderHistoryDetailScreen)} />
          <Stack.Screen name="CreateReviewScreen" component={withAuth(CreateReviewScreen)} />
          <Stack.Screen name="UpdateReviewScreen" component={withAuth(UpdateReviewScreen)} />
          <Stack.Screen name="SettingsScreen" component={withAuth(SettingsScreen)} />
          <Stack.Screen name="ChangePasswordScreen" component={withAuth(ChangePasswordScreen)} />
          <Stack.Screen name="MyReviewsScreen" component={withAuth(MyReviewsScreen)} />
          <Stack.Screen name="RefundRequestScreen" component={withAuth(RefundRequestScreen)} />
          <Stack.Screen name="RefundRequestDetailScreen" component={withAuth(RefundRequestDetailScreen)} />
          <Stack.Screen name="CreateRefundRequestScreen" component={withAuth(CreateRefundRequestScreen)} />
          <Stack.Screen name="UserBankingScreen" component={withAuth(UserBankingScreen)} />
          <Stack.Screen name="AddUserBankingScreen" component={withAuth(AddUserBankingScreen)} />
          <Stack.Screen name="EditUserBankingScreen" component={withAuth(EditUserBankingScreen)} />
          <Stack.Screen name="AboutUsScreen" component={AboutUsScreen} />
          <Stack.Screen name="TermsScreen" component={TermsScreen} />
          <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} />
          <Stack.Screen name="AppVersionScreen" component={AppVersionScreen} />
          <Stack.Screen name="FAQScreen" component={FAQScreen} />
        </Stack.Navigator>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default ProfileStack


const style = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'white' },
})