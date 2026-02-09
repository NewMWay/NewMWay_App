import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import ChatListScreen from '../../features/chat/screens/ChatListScreen';
import { ChatStackParamList } from '../../types/navigation/navigation';
import withAuth from '../../components/hoc/withAuth';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native'

const Stack = createNativeStackNavigator<ChatStackParamList>();
const ChatStack = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['right', 'left', 'top']} style={style.safeArea}>

        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="ChatListScreen" component={withAuth(ChatListScreen)} />
        </Stack.Navigator>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default ChatStack

const style = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'white' },
})
