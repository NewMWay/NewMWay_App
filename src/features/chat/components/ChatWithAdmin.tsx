import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Keyboard,
} from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { Colors } from '../../../assets/styles/colorStyles'
import { ifTablet, isTablet } from '../../../utils/responsives/responsive'
import TypingIndicator from './TypingIndicator'
import { launchImageLibrary } from 'react-native-image-picker'
import { useSignalR } from '../../../services/signalr/SignalRProvider'
import { useAuthStore } from '../../../stores/authStore.zustand'
import { CHAT_CONSTANTS } from '../../../constants/chat.constants'
import { MessageTypeEnum, ProductContentMessageResponse } from '../types/ChatAdmin.type'
import ProductSelectionModal from './ProductSelectionModal'
import { useUploadImage } from '../../shop/hooks/useMediaUpload.hook'
import { useNavigation } from '@react-navigation/native'

interface Message {
    id: string
    text: string
    sender: 'user' | 'admin'
    timestamp: string
    type: MessageTypeEnum
    imageUrl?: string
    product?: ProductContentMessageResponse
}

interface ChatWithAdminProps {
    initialMessages?: Message[]
    onSendMessage?: (message: string) => void
    onStartChat?: () => void
    showWelcome?: boolean
    initialProduct?: ProductContentMessageResponse | null
}

const ChatWithAdmin: React.FC<ChatWithAdminProps> = ({
    initialMessages = [],
    onSendMessage,
    onStartChat,
    showWelcome = true,
    initialProduct = null
}) => {
    const logo = require('../../../assets/images/logo/LOGO-NEW-WAY-TEAK-WOOD-02-1.png')
    // Using available icons as alternatives
    const attachIcon = require('../../../assets/icons/icons8-paper-clip-48.png')
    const packageIcon = require('../../../assets/icons/icons8-shop-48.png') // Icon for product
    const sendIcon = require('../../../assets/icons/icons8-forward-48.png')

    // Get user profile
    const userProfile = useAuthStore((state) => state.userProfile)
    const currentUsername = userProfile?.username || 'user'

    // SignalR integration
    const { messages: signalRMessages, sendMessage: sendSignalRMessage } = useSignalR()
    const scrollViewRef = useRef<ScrollView>(null)
    const navigation = useNavigation()

    // Upload image mutation
    const uploadImageMutation = useUploadImage()

    // Fetch last messages (optional - for reference)
    // Disabled for now, can be enabled when needed for pagination
    // const { data: lastMessagesData } = useLastMessageChat({
    //     username: null,
    //     page: 1,
    //     size: 20,
    //     enabled: false,
    // })

    const [messages, setMessages] = useState<Message[]>(initialMessages)
    const [inputText, setInputText] = useState('')
    const [isInitialLoad, setIsInitialLoad] = useState(true)
    const [isSendingMessage, setIsSendingMessage] = useState(false)
    const [productModalVisible, setProductModalVisible] = useState(false)
    const [shouldSendProduct, setShouldSendProduct] = useState<ProductContentMessageResponse | null>(null)

    // Auto-send product when initialProduct is provided
    useEffect(() => {
        if (initialProduct && !showWelcome) {
            // Small delay to ensure SignalR is connected
            const timer = setTimeout(() => {
                setShouldSendProduct(initialProduct)
            }, 500)
            return () => clearTimeout(timer)
        }
    }, [initialProduct, showWelcome])

    // Handle sending the product when shouldSendProduct is set
    useEffect(() => {
        if (shouldSendProduct && !isSendingMessage) {
            handleSendProduct(shouldSendProduct)
            setShouldSendProduct(null)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shouldSendProduct])

    // Sync SignalR messages to local state
    useEffect(() => {
        if (signalRMessages && signalRMessages.length > 0) {
            const formattedMessages: Message[] = signalRMessages.map(msg => {
                const messageType = msg.type === 0 ? MessageTypeEnum.Text : msg.type === 1 ? MessageTypeEnum.Image : MessageTypeEnum.Product
                let product: ProductContentMessageResponse | undefined
                let imageUrl: string | undefined
                let text = msg.content

                if (messageType === MessageTypeEnum.Product) {
                    try {
                        product = JSON.parse(msg.content)
                        text = ''
                    } catch (error) {
                        console.error('Failed to parse product message:', error)
                    }
                } else if (messageType === MessageTypeEnum.Image) {
                    imageUrl = msg.content
                    text = '' // Clear text for image messages
                }

                return {
                    id: msg.id,
                    text,
                    sender: msg.senderUsername === currentUsername ? 'user' : 'admin',
                    timestamp: new Date(msg.messageSent).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                    type: messageType,
                    imageUrl,
                    product,
                }
            })
            setMessages(formattedMessages)
        }
    }, [signalRMessages, currentUsername])

    // Auto-scroll to bottom when new messages arrive OR on initial load
    useEffect(() => {
        if (messages.length > 0 && !showWelcome) {
            const delay = isInitialLoad ? 300 : 100
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: !isInitialLoad })
                if (isInitialLoad) {
                    setIsInitialLoad(false)
                }
            }, delay)
        }
    }, [messages, showWelcome, isInitialLoad])

    // Handle keyboard show/hide to scroll messages
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true })
                }, 100)
            }
        )

        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true })
                }, 100)
            }
        )

        return () => {
            keyboardDidShowListener.remove()
            keyboardDidHideListener.remove()
        }
    }, [])

    // Scroll when transitioning from welcome to chat
    useEffect(() => {
        if (!showWelcome && messages.length > 0) {
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true })
            }, 200)
        }
    }, [showWelcome, messages.length])

    const pickImage = async () => {
        try {
            const result = await launchImageLibrary({
                mediaType: 'photo',
                quality: CHAT_CONSTANTS.MAX_IMAGE_QUALITY,
                selectionLimit: 1, // Chỉ cho chọn 1 ảnh
            })

            if (result.didCancel) {
                return
            }

            if (result.errorCode) {
                const errorMessages: { [key: string]: string } = {
                    'camera_unavailable': 'Camera không khả dụng trên thiết bị này',
                    'permission': 'Vui lòng cấp quyền truy cập thư viện ảnh',
                    'others': result.errorMessage || 'Không thể chọn ảnh'
                }
                Alert.alert('Lỗi', errorMessages[result.errorCode] || errorMessages.others)
                return
            }

            if (result.assets && result.assets.length > 0) {
                const asset = result.assets[0]
                if (!asset.uri) {
                    Alert.alert('Lỗi', 'Không có ảnh hợp lệ được chọn')
                    return
                }
                await handleSendImage(asset.uri, asset.fileName || `image_${Date.now()}.jpg`)
            }
        } catch {
            Alert.alert('Lỗi', 'Không thể mở thư viện ảnh. Vui lòng kiểm tra quyền truy cập.')
        }
    }

    const handleSendImage = async (uri: string, fileName: string) => {
        if (isSendingMessage) return
        setIsSendingMessage(true)

        try {
            // Create File object for upload
            const file: any = {
                uri,
                type: 'image/jpeg',
                name: fileName,
            }

            const response = await uploadImageMutation.mutateAsync({ Image: file })
            const imageUrl = response

            // Send image message via SignalR
            await sendSignalRMessage(CHAT_CONSTANTS.ADMIN_USERNAME, imageUrl, MessageTypeEnum.Image)
        } catch {
            Alert.alert('Lỗi', 'Không thể gửi ảnh. Vui lòng thử lại.')
        } finally {
            setIsSendingMessage(false)
        }
    }

    const handleSendProduct = async (product: ProductContentMessageResponse) => {
        if (isSendingMessage) return
        setIsSendingMessage(true)

        try {
            const productContent = JSON.stringify(product)
            await sendSignalRMessage(CHAT_CONSTANTS.ADMIN_USERNAME, productContent, MessageTypeEnum.Product)
        } catch {
            Alert.alert('Lỗi', 'Không thể gửi sản phẩm. Vui lòng thử lại.')
        } finally {
            setIsSendingMessage(false)
        }
    }

    const handleSendMessage = async () => {
        if (inputText.trim() && !isSendingMessage) {
            const messageText = inputText.trim()
            setIsSendingMessage(true)
            setInputText('') // Clear input immediately for better UX

            try {
                // Send via SignalR with Text type
                await sendSignalRMessage(CHAT_CONSTANTS.ADMIN_USERNAME, messageText, MessageTypeEnum.Text)
                onSendMessage?.(messageText)
            } catch {
                // Restore message if sending failed
                setInputText(messageText)
                Alert.alert(
                    'Lỗi gửi tin nhắn',
                    'Không thể gửi tin nhắn. Vui lòng kiểm tra kết nối và thử lại.',
                    [
                        { text: 'OK', style: 'default' }
                    ]
                )
            } finally {
                setIsSendingMessage(false)
            }
        }
    }

    // Welcome Card
    if (showWelcome) {
        return (
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <View style={styles.card}>
                    {/* Logo */}
                    <View style={styles.logoContainer}>
                        <Image source={logo} style={styles.logo} resizeMode="contain" />
                    </View>

                    {/* Welcome Text */}
                    <Text style={styles.greetingText}>Chào Bạn, tôi là Admin của</Text>
                    <Text style={styles.brandText}>NEWMWAY TEAKWOOD</Text>
                    <Text style={styles.descriptionText}>
                        Chuyên cung cấp sản phẩm đồ{'\n'}dụng nhà bếp cao cấp
                    </Text>
                    <Text style={styles.questionText}>
                        Tôi có thể hỗ trợ bạn điều gì?
                    </Text>

                    {/* Start Button */}
                    <TouchableOpacity style={styles.startButton} onPress={onStartChat}>
                        <Text style={styles.startButtonText}>Bắt Đầu</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }

    // Chat Interface
    return (
        <KeyboardAvoidingView
            style={styles.chatContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 30 : 30}
        >
            {/* Messages Area */}
            <ScrollView
                ref={scrollViewRef}
                style={styles.messagesContainer}
                contentContainerStyle={styles.messagesContent}
                showsVerticalScrollIndicator={false}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="handled"
            >
                {messages.map((message) => (
                    <View key={message.id}>
                        {message.sender === 'admin' && (
                            <View style={styles.adminMessageContainer}>
                                {/* Admin Info */}
                                <View style={styles.adminInfoHeader}>
                                    <Image source={logo} style={styles.adminAvatar} resizeMode="contain" />
                                    <View style={styles.adminInfo}>
                                        <Text style={styles.adminName}>NEWMWAY Admin</Text>
                                    </View>
                                </View>

                                {/* Admin Message Bubble */}
                                {message.type === MessageTypeEnum.Text && (
                                    <View style={styles.adminMessageBubble}>
                                        <Text style={styles.adminMessageText}>{message.text}</Text>
                                    </View>
                                )}

                                {message.type === MessageTypeEnum.Image && message.imageUrl && (
                                    <TouchableOpacity activeOpacity={0.9}>
                                        <Image
                                            source={{ uri: message.imageUrl }}
                                            style={styles.messageImage}
                                            resizeMode="cover"
                                        />
                                    </TouchableOpacity>
                                )}

                                {message.type === MessageTypeEnum.Product && message.product && (
                                    <TouchableOpacity
                                        style={styles.productCard}
                                        onPress={() => {
                                            const parentNavigation = navigation.getParent()
                                            if (parentNavigation) {
                                                parentNavigation.navigate('Mạa Sắm', {
                                                    screen: 'ProductDetailsScreen',
                                                    params: { productId: message.product!.id }
                                                })
                                            }
                                        }}
                                    >
                                        <Image
                                            source={{ uri: message.product.thumbnail || 'https://placehold.co/100' }}
                                            style={styles.productImage}
                                            resizeMode="cover"
                                        />
                                        <View style={styles.productInfo}>
                                            <Text style={styles.productName} numberOfLines={2}>
                                                {message.product.name}
                                            </Text>
                                            <Text style={styles.productCategory} numberOfLines={1}>
                                                {message.product.categoryName}
                                            </Text>
                                            <Text style={styles.productPrice}>
                                                {message.product.price.toLocaleString('vi-VN')}₫
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                )}

                                <Text style={styles.messageTimestamp}>{message.timestamp}</Text>
                            </View>
                        )}

                        {message.sender === 'user' && (
                            <View style={styles.userMessageContainer}>
                                {message.type === MessageTypeEnum.Text && (
                                    <>
                                        <View style={styles.userMessageBubble}>
                                            <Text style={styles.userMessageText}>{message.text}</Text>
                                        </View>
                                        <Text style={styles.userMessageTimestamp}>{message.timestamp}</Text>
                                    </>
                                )}

                                {message.type === MessageTypeEnum.Image && message.imageUrl && (
                                    <View style={styles.userImageMessageContainer}>
                                        <TouchableOpacity activeOpacity={0.9}>
                                            <Image
                                                source={{ uri: message.imageUrl }}
                                                style={styles.sentImage}
                                                resizeMode="cover"
                                            />
                                        </TouchableOpacity>
                                        <Text style={styles.imageTimestamp}>{message.timestamp}</Text>
                                    </View>
                                )}

                                {message.type === MessageTypeEnum.Product && message.product && (
                                    <View style={styles.userProductContainer}>
                                        <TouchableOpacity
                                            style={styles.productCard}
                                            onPress={() => {
                                                const parentNavigation = navigation.getParent()
                                                if (parentNavigation) {
                                                    parentNavigation.navigate('Mạa Sắm', {
                                                        screen: 'ProductDetailsScreen',
                                                        params: { productId: message.product!.id }
                                                    })
                                                }
                                            }}
                                        >
                                            <Image
                                                source={{ uri: message.product.thumbnail || 'https://placehold.co/100' }}
                                                style={styles.productImage}
                                                resizeMode="cover"
                                            />
                                            <View style={styles.productInfo}>
                                                <Text style={styles.productName} numberOfLines={2}>
                                                    {message.product.name}
                                                </Text>
                                                <Text style={styles.productCategory} numberOfLines={1}>
                                                    {message.product.categoryName}
                                                </Text>
                                                <Text style={styles.productPrice}>
                                                    {message.product.price.toLocaleString('vi-VN')}₫
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                        <Text style={styles.userMessageTimestamp}>{message.timestamp}</Text>
                                    </View>
                                )}
                            </View>
                        )}
                    </View>
                ))}

                {isSendingMessage && (
                    <View style={styles.adminMessageContainer}>
                        <View style={styles.adminInfoHeader}>
                            <Image source={logo} style={styles.adminAvatar} resizeMode="contain" />
                            <View style={styles.adminInfo}>
                                <Text style={styles.adminName}>NEWMWAY Admin</Text>
                            </View>
                        </View>
                        <TypingIndicator />
                    </View>
                )}
            </ScrollView>

            {/* Input Area */}
            <View
                style={styles.inputContainer}
            >
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder="Chat ở đây..."
                        placeholderTextColor={Colors.gray}
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                        maxLength={500}
                    />
                    <View style={styles.inputActions}>
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => setProductModalVisible(true)}
                            disabled={isSendingMessage}
                        >
                            <Image source={packageIcon} style={styles.actionIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={pickImage}
                            disabled={isSendingMessage}
                        >
                            <Image source={attachIcon} style={styles.actionIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.sendButton, (!inputText.trim() || isSendingMessage) && styles.sendButtonDisabled]}
                            onPress={handleSendMessage}
                            disabled={!inputText.trim() || isSendingMessage}
                        >
                            <Image
                                source={sendIcon}
                                style={[styles.sendIcon, (!inputText.trim() || isSendingMessage) && styles.sendIconDisabled]}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Product Selection Modal */}
            <ProductSelectionModal
                visible={productModalVisible}
                onClose={() => setProductModalVisible(false)}
                onSelectProduct={handleSendProduct}
            />
        </KeyboardAvoidingView>
    )
}

export default ChatWithAdmin

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.textWhite,
    },
    contentContainer: {
        flexGrow: 1,
        top: isTablet() ? '20%' : '10%',
        alignItems: 'center',
        paddingVertical: ifTablet(40, 20),
    },
    card: {
        width: '90%',
        maxWidth: ifTablet(400, 340),
        backgroundColor: Colors.textWhite,
        borderRadius: 16,
        padding: ifTablet(32, 24),
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    logoContainer: {
        width: ifTablet(100, 80),
        height: ifTablet(100, 80),
        borderRadius: ifTablet(50, 40),
        backgroundColor: Colors.textWhite,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: ifTablet(24, 20),
        borderWidth: 2,
        borderColor: Colors.grayLight,
    },
    logo: {
        width: '70%',
        height: '70%',
    },
    greetingText: {
        fontSize: ifTablet(16, 14),
        fontFamily: 'Sora-Regular',
        color: Colors.textDark,
        textAlign: 'center',
        marginBottom: ifTablet(8, 6),
    },
    brandText: {
        fontSize: ifTablet(18, 16),
        fontFamily: 'Sora-Bold',
        color: Colors.primary,
        textAlign: 'center',
        marginBottom: ifTablet(16, 12),
    },
    descriptionText: {
        fontSize: ifTablet(15, 13),
        fontFamily: 'Sora-Regular',
        color: Colors.grayDark,
        textAlign: 'center',
        lineHeight: ifTablet(22, 20),
        marginBottom: ifTablet(16, 12),
    },
    questionText: {
        fontSize: ifTablet(15, 13),
        fontFamily: 'Sora-Regular',
        color: Colors.textDark,
        textAlign: 'center',
        lineHeight: ifTablet(22, 20),
        marginBottom: ifTablet(24, 20),
    },
    startButton: {
        width: '100%',
        height: ifTablet(56, 48),
        backgroundColor: Colors.primary,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    startButtonText: {
        fontSize: ifTablet(16, 15),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textWhite,
        fontWeight: '600',
    },

    // Chat Interface Styles
    chatContainer: {
        flex: 1,
        backgroundColor: Colors.textWhite,
    },
    messagesContainer: {
        flex: 1,
    },
    messagesContent: {
        padding: ifTablet(20, 16),
        paddingBottom: ifTablet(60, 10),
    },
    adminMessageContainer: {
        marginBottom: ifTablet(20, 16),
        alignItems: 'flex-start',
    },
    adminInfoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: ifTablet(8, 6),
    },
    adminAvatar: {
        width: ifTablet(32, 28),
        height: ifTablet(32, 28),
        borderRadius: ifTablet(16, 14),
        marginRight: ifTablet(8, 6),
    },
    adminInfo: {
        flex: 1,
    },
    adminName: {
        fontSize: ifTablet(14, 12),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
    },
    adminMessageBubble: {
        backgroundColor: Colors.grayLight,
        borderRadius: 12,
        borderTopLeftRadius: 4,
        padding: ifTablet(14, 12),
        maxWidth: '80%',
    },
    adminMessageText: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-Regular',
        color: Colors.textDark,
        lineHeight: ifTablet(20, 18),
    },
    messageTimestamp: {
        fontSize: ifTablet(10, 9),
        fontFamily: 'Sora-Regular',
        color: Colors.gray,
        marginTop: ifTablet(4, 3),
        marginLeft: ifTablet(8, 6),
    },
    userMessageContainer: {
        marginBottom: ifTablet(20, 16),
        alignItems: 'flex-end',
    },
    userMessageBubble: {
        backgroundColor: Colors.primary,
        borderRadius: 12,
        borderTopRightRadius: 4,
        padding: ifTablet(14, 12),
        maxWidth: '80%',
    },
    userMessageText: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-Regular',
        color: Colors.textWhite,
        lineHeight: ifTablet(20, 18),
    },
    userMessageTimestamp: {
        fontSize: ifTablet(10, 9),
        fontFamily: 'Sora-Regular',
        color: Colors.gray,
        marginTop: ifTablet(4, 3),
        marginRight: ifTablet(8, 6),
        textAlign: 'right',
    },
    userImageMessageContainer: {
        backgroundColor: Colors.primary,
        borderRadius: 12,
        borderTopRightRadius: 4,
        padding: ifTablet(10, 8),
        maxWidth: '75%',
        gap: ifTablet(8, 6),
    },
    sentImage: {
        width: ifTablet(240, 200),
        height: ifTablet(240, 200),
        borderRadius: 8,
    },
    messageImage: {
        width: ifTablet(240, 200),
        height: ifTablet(240, 200),
        borderRadius: 8,
    },
    imageTimestamp: {
        fontSize: ifTablet(10, 9),
        fontFamily: 'Sora-Regular',
        color: 'rgba(255, 255, 255, 0.7)',
        marginTop: ifTablet(2, 1),
    },
    userProductContainer: {
        alignItems: 'flex-end',
    },
    productCard: {
        flexDirection: 'row',
        backgroundColor: Colors.textWhite,
        borderRadius: 12,
        padding: ifTablet(12, 10),
        maxWidth: '80%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    productImage: {
        width: ifTablet(70, 60),
        height: ifTablet(70, 60),
        borderRadius: ifTablet(8, 6),
        backgroundColor: '#f9fafb',
    },
    productInfo: {
        flex: 1,
        marginLeft: ifTablet(12, 10),
        justifyContent: 'center',
    },
    productName: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
        marginBottom: ifTablet(4, 3),
    },
    productCategory: {
        fontSize: ifTablet(12, 11),
        fontFamily: 'Sora-Regular',
        color: Colors.gray,
        marginBottom: ifTablet(4, 3),
    },
    productPrice: {
        fontSize: ifTablet(15, 14),
        fontFamily: 'Sora-Bold',
        color: Colors.primary,
    },
    previewContainer: {
        paddingHorizontal: ifTablet(16, 12),
        paddingTop: ifTablet(12, 10),
        backgroundColor: Colors.textWhite,
    },
    inputContainer: {
        backgroundColor: Colors.textWhite,
        borderTopWidth: 1,
        borderTopColor: Colors.grayLight,
        paddingHorizontal: ifTablet(16, 12),
        paddingVertical: ifTablet(12, 10),
        paddingBottom: Platform.OS === 'ios' ? ifTablet(40, 40) : ifTablet(60, 40),
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: Colors.grayLight,
        borderRadius: 24,
        paddingHorizontal: ifTablet(16, 12),
        paddingVertical: ifTablet(8, 6),
    },
    input: {
        flex: 1,
        fontSize: ifTablet(15, 14),
        fontFamily: 'Sora-Regular',
        color: Colors.textDark,
        maxHeight: ifTablet(100, 80),
        paddingVertical: ifTablet(8, 6),
    },
    inputActions: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: ifTablet(8, 6),
    },
    iconButton: {
        padding: ifTablet(6, 4),
        marginLeft: ifTablet(4, 2),
    },
    actionIcon: {
        width: ifTablet(24, 20),
        height: ifTablet(24, 20),
        tintColor: Colors.gray,
    },
    sendButton: {
        width: ifTablet(36, 32),
        height: ifTablet(36, 32),
        borderRadius: ifTablet(18, 16),
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: ifTablet(6, 4),
    },
    sendButtonDisabled: {
        backgroundColor: Colors.gray,
        opacity: 0.5,
    },
    sendIcon: {
        width: ifTablet(20, 18),
        height: ifTablet(20, 18),
        tintColor: Colors.textWhite,
    },
    sendIconDisabled: {
        opacity: 0.6,
    },
})
