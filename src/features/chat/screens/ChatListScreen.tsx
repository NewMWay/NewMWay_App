import { StyleSheet, View } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader'
import { Colors } from '../../../assets/styles/colorStyles'
import ChatWithAI from '../components/ChatWithAI'
import ChatWithAdmin from '../components/ChatWithAdmin'
import ChatWelcome from '../components/ChatWelcome'
import ConnectionStatusBadge from '../components/ConnectionStatusBadge'
import ClearHistoryButton from '../components/ClearHistoryButton'
import { useNavigation, useRoute } from '@react-navigation/native'
import { ChatStackNavigationProp } from '../../../types/navigation/navigation'
import { ProductContentMessageResponse } from '../types/ChatAdmin.type'

type ChatType = 'ai' | 'admin' | 'welcome'

interface ProductParams {
  productId?: string
  productName?: string
  productImage?: string
  productPrice?: number
  productCategoryName?: string
  autoOpenAdmin?: boolean
}

const ChatListScreen = () => {
  const [chatType, setChatType] = useState<ChatType>('welcome')
  const [showChatInterface, setShowChatInterface] = useState(false)
  const [productToSend, setProductToSend] = useState<ProductContentMessageResponse | null>(null)
  const chatAIRef = useRef<any>(null)

  const navigation = useNavigation<ChatStackNavigationProp>()
  const route = useRoute()
  const params = route.params as ProductParams | undefined

  // Auto-open admin chat when notification is pressed
  useEffect(() => {
    if (params?.autoOpenAdmin) {
      console.log('Auto-opening admin chat from notification');
      setChatType('admin')
      setShowChatInterface(true)
    }
  }, [params?.autoOpenAdmin])

  // Auto-start admin chat when product params are received
  useEffect(() => {
    if (params?.productId && params?.productName) {
      const product: ProductContentMessageResponse = {
        id: params.productId,
        name: params.productName,
        thumbnail: params.productImage || '',
        price: params.productPrice || 0,
        categoryName: params.productCategoryName || '',
        isActive: true,
        isHasVariants: false,
        rating: 0,
      }
      setProductToSend(product)
      setChatType('admin')
      setShowChatInterface(true)
    }
  }, [params])

  const handleGoBack = () => {
    if (showChatInterface) {
      // If in chat interface, go back to AI/Admin welcome screen
      setShowChatInterface(false)
    } else if (chatType !== 'welcome') {
      // If in AI/Admin welcome screen, go back to main welcome
      setChatType('welcome')
    } else {
      // If in main welcome screen, go back to previous screen (Home)
      navigation.goBack()
    }
  }

  const handleStartAIChat = () => {
    setChatType('ai')
    setShowChatInterface(false)
  }

  const handleStartAdminChat = () => {
    setChatType('admin')
    setShowChatInterface(false)
  }

  const handleBeginChat = () => {
    setShowChatInterface(true)
  }

  const handleClearAIHistory = () => {
    // Callback from ChatWithAI when history is cleared
  }

  const getHeaderTitle = () => {
    if (chatType === 'welcome') {
      return 'Hỗ Trợ Khách Hàng'
    }
    if (chatType === 'ai') {
      return showChatInterface ? 'NEWMWAY AI' : 'NEWMWAY AI'
    }
    return showChatInterface ? 'NewMWay Admin' : 'NewMWay Admin'
  }

  return (
    <View style={styles.container}>
      <PrimaryHeader
        title={getHeaderTitle()}
        onBackPress={handleGoBack}
        rightComponent={
          chatType === 'admin' && showChatInterface ? (
            <ConnectionStatusBadge />
          ) : chatType === 'ai' && showChatInterface ? (
            <ClearHistoryButton onPress={() => chatAIRef.current?.handleClearHistory()} />
          ) : undefined
        }
      />

      {chatType === 'welcome' && (
        <ChatWelcome
          onStartAIChat={handleStartAIChat}
          onStartAdminChat={handleStartAdminChat}
        />
      )}

      {chatType === 'ai' && (
        <ChatWithAI
          ref={chatAIRef}
          showWelcome={!showChatInterface}
          onStartChat={handleBeginChat}
          navigation={navigation}
          onClearHistory={handleClearAIHistory}
        />
      )}

      {chatType === 'admin' && (
        <ChatWithAdmin
          showWelcome={!showChatInterface}
          onStartChat={handleBeginChat}
          initialProduct={productToSend}
        />
      )}
    </View>
  )
}

export default ChatListScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.textWhite,
  },
})