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
} from 'react-native'
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Colors } from '../../../assets/styles/colorStyles'
import { ifTablet, isTablet } from '../../../utils/responsives/responsive'
import ImageUploadPreview from './ImageUploadPreview'
import TypingIndicator from './TypingIndicator'
import ProductAICard from './ProductAICard'
import { launchImageLibrary } from 'react-native-image-picker'
import { useAIMessageHook } from '../hooks/useAIMessage.hook'
import { useUploadFileAI } from '../hooks/useUploadFileAI.hook'
import { ChatAIProduct } from '../types/ChatAi.type'
import { chatAIHistoryService, ChatAIMessage } from '../../../services/storage/chatAIHistory'
import { useFocusEffect } from '@react-navigation/native'
import { CHAT_CONSTANTS } from '../../../constants/chat.constants'

interface Message {
    id: string
    text: string
    sender: 'user' | 'ai'
    timestamp: string
    timestampMs: number
    images?: { uri: string; name: string }[]
    products?: ChatAIProduct[]
    imageDescription?: string
}

interface ChatWithAIProps {
    onStartChat?: () => void
    showWelcome?: boolean
    navigation: NativeStackNavigationProp<any>
    onClearHistory?: () => void
}

export interface ChatWithAIRef {
    handleClearHistory: () => void
}

const ChatWithAI = forwardRef<ChatWithAIRef, ChatWithAIProps>(({ onStartChat, showWelcome = true, navigation, onClearHistory }, ref) => {
    const logo = require('../../../assets/images/logo/LOGO-NEW-WAY-TEAK-WOOD-02-1.png')
    const attachIcon = require('../../../assets/icons/icons8-paper-clip-48.png')
    const emojiIcon = require('../../../assets/icons/icons8-smile-48.png')
    const sendIcon = require('../../../assets/icons/icons8-forward-48.png')

    const [messages, setMessages] = useState<Message[]>([])
    const [inputText, setInputText] = useState('')
    const [selectedImages, setSelectedImages] = useState<{ uri: string; name: string }[]>([])
    const [isTyping, setIsTyping] = useState(false)
    const [isUploadingImage, setIsUploadingImage] = useState(false)
    const scrollViewRef = useRef<ScrollView>(null)
    const hasAutoStartedRef = useRef(false)

    const { mutate: sendAIMessage } = useAIMessageHook()
    const { mutate: uploadFileToAI } = useUploadFileAI()

    // Clear chat history handler
    const handleClearHistory = () => {
        Alert.alert(
            'Xóa lịch sử chat',
            'Bạn có chắc muốn xóa toàn bộ lịch sử chat với AI?',
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: () => {
                        chatAIHistoryService.clearHistory()
                        setMessages([])
                        onClearHistory?.()
                    },
                },
            ]
        )
    }

    // Load chat history when component mounts or comes into focus
    useFocusEffect(
        React.useCallback(() => {
            const history = chatAIHistoryService.getHistory()
            if (history.length > 0) {
                setMessages(history)
                // Auto-start chat ONLY on first mount with history
                if (showWelcome && !hasAutoStartedRef.current) {
                    hasAutoStartedRef.current = true
                    onStartChat?.()
                }
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    )

    // Reset auto-start flag when showWelcome changes to true (user backed to welcome)
    useEffect(() => {
        if (showWelcome) {
            hasAutoStartedRef.current = false
        }
    }, [showWelcome])

    // Save messages to storage whenever they change
    useEffect(() => {
        if (messages.length > 0) {
            chatAIHistoryService.saveHistory(messages as ChatAIMessage[])
        }
    }, [messages])

    // Auto-scroll when messages or typing state changes
    useEffect(() => {
        if (messages.length > 0 || isTyping || isUploadingImage) {
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true })
            }, 100)
        }
    }, [messages, isTyping, isUploadingImage])

    // Expose handleClearHistory to parent via ref
    useImperativeHandle(ref, () => ({
        handleClearHistory,
    }))

    const handleStartChat = () => {
        // Check if there's existing history
        const existingHistory = chatAIHistoryService.getHistory()

        if (existingHistory.length > 0) {
            // Has history, load it instead of welcome message
            setMessages(existingHistory)
        } else {
            // No history, show welcome message
            const now = Date.now()
            const welcomeMessage: Message = {
                id: 'welcome',
                text: 'Chào mừng bạn đến với Chat bot của NEWMWAY TEAKWOOD. Tôi có thể giúp gì cho bạn hôm nay?',
                sender: 'ai',
                timestamp: new Date(now).toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
                timestampMs: now,
            }
            setMessages([welcomeMessage])
        }

        onStartChat?.()
    }

    const pickImage = async () => {
        try {
            const result = await launchImageLibrary({
                mediaType: 'photo',
                quality: CHAT_CONSTANTS.MAX_IMAGE_QUALITY,
                selectionLimit: CHAT_CONSTANTS.MAX_IMAGE_SELECTION,
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
                const validImages = result.assets.filter(asset => asset.uri)
                if (validImages.length === 0) {
                    Alert.alert('Lỗi', 'Không có ảnh hợp lệ được chọn')
                    return
                }
                const newImages = validImages.map(asset => ({
                    uri: asset.uri!,
                    name: asset.fileName || `image_${Date.now()}.jpg`
                }))
                setSelectedImages(prev => [...prev, ...newImages])
            }
        } catch {
            Alert.alert('Lỗi', 'Không thể mở thư viện ảnh. Vui lòng kiểm tra quyền truy cập.')
        }
    }

    const removeImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index))
    }

    const handleUploadImages = () => {
        if (selectedImages.length === 0) return

        // Notify if user selected multiple images
        if (selectedImages.length > 1) {
            Alert.alert(
                'Thông báo',
                `Bạn đã chọn ${selectedImages.length} ảnh, nhưng AI chỉ phân tích 1 ảnh đầu tiên.`,
                [{ text: 'Đồng ý' }]
            )
        }

        const now = Date.now()
        const userMessageText = inputText.trim()
        const userMessage: Message = {
            id: now.toString(),
            text: userMessageText || '📷 Đã gửi ảnh',
            sender: 'user',
            timestamp: new Date(now).toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
            }),
            timestampMs: now,
            images: selectedImages,
        }

        setMessages(prev => [...prev, userMessage])
        setInputText('')
        const imagesToUpload = selectedImages
        setSelectedImages([])
        setIsUploadingImage(true)

        // Upload first image only (API accepts single file)
        const firstImage = imagesToUpload[0]

        // Create file object for FormData
        const file = {
            uri: firstImage.uri,
            type: 'image/jpeg',
            name: firstImage.name,
        } as any

        uploadFileToAI(
            { file },
            {
                onSuccess: (data) => {
                    setIsUploadingImage(false)
                    const responseNow = Date.now()
                    const aiResponse: Message = {
                        id: responseNow.toString(),
                        text: data.response,
                        sender: 'ai',
                        timestamp: new Date(responseNow).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                        }),
                        timestampMs: responseNow,
                        products: data.products || undefined,
                        imageDescription: data.image_description,
                    }
                    setMessages(prev => [...prev, aiResponse])
                },
                onError: () => {
                    setIsUploadingImage(false)
                    Alert.alert(
                        'Lỗi tìm kiếm ảnh',
                        'Không thể xử lý ảnh. Vui lòng thử lại hoặc gửi tin nhắn văn bản.',
                        [{ text: 'OK' }]
                    )
                },
            }
        )
    }

    const handleSendMessage = () => {
        if (selectedImages.length > 0) {
            handleUploadImages()
            return
        }

        if (inputText.trim()) {
            const userMessageText = inputText.trim()
            const now = Date.now()
            const newMessage: Message = {
                id: now.toString(),
                text: userMessageText,
                sender: 'user',
                timestamp: new Date(now).toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
                timestampMs: now,
            }
            setMessages(prev => [...prev, newMessage])
            setInputText('')
            setIsTyping(true)

            // Call AI API
            sendAIMessage(
                { message: userMessageText },
                {
                    onSuccess: (data) => {
                        setIsTyping(false)
                        const responseNow = Date.now()
                        const aiResponse: Message = {
                            id: responseNow.toString(),
                            text: data.response,
                            sender: 'ai',
                            timestamp: new Date(responseNow).toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit',
                            }),
                            timestampMs: responseNow,
                            products: data.products || undefined,
                        }
                        setMessages(prev => [...prev, aiResponse])
                    },
                    onError: () => {
                        setIsTyping(false)
                        Alert.alert('Lỗi', 'Không thể gửi tin nhắn đến AI. Vui lòng thử lại.')
                    },
                }
            )
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
                    <Text style={styles.greetingText}>Chào Bạn, tôi là Chat Bot của</Text>
                    <Text style={styles.brandText}>NEWMWAY TEAKWOOD</Text>
                    <Text style={styles.descriptionText}>
                        Chuyên cung cấp sản phẩm đồ{'\n'}dụng nhà bếp cao cấp
                    </Text>
                    <Text style={styles.questionText}>
                        Bạn có sản phẩm nào cần tìm hoặc{'\n'}có câu hỏi nào cho tôi không ?
                    </Text>

                    {/* Start Button */}
                    <TouchableOpacity style={styles.startButton} onPress={handleStartChat}>
                        <Text style={styles.startButtonText}>Bắt Đầu</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }

    const handleProductPress = (productId: string) => {
        const parentNavigation = navigation.getParent();
        if (parentNavigation) {
            parentNavigation.navigate('Mua Sắm', {
                screen: 'ProductDetailsScreen',
                params: { productId }
            });
        }
    }

    // Chat Interface
    return (
        <KeyboardAvoidingView
            style={styles.chatContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
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
                        {message.sender === 'ai' && (
                            <View style={styles.aiMessageContainer}>
                                {/* AI Info */}
                                <View style={styles.aiInfoHeader}>
                                    <Image source={logo} style={styles.aiAvatar} resizeMode="contain" />
                                    <View style={styles.aiInfo}>
                                        <Text style={styles.aiName}>NEWMWAY AI</Text>
                                    </View>
                                </View>

                                {/* AI Message Bubble */}
                                <View style={styles.aiMessageBubble}>
                                    {message.imageDescription && (
                                        <Text style={styles.imageDescriptionText}>
                                            🖼️ {message.imageDescription}
                                        </Text>
                                    )}
                                    <Text style={styles.aiMessageText}>{message.text}</Text>
                                </View>

                                {/* Products List */}
                                {message.products && message.products.length > 0 && (
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        style={styles.productsScroll}
                                        contentContainerStyle={styles.productsContent}
                                    >
                                        {message.products.map((product) => (
                                            <ProductAICard
                                                key={product.id}
                                                product={product}
                                                onPress={(productId) => { handleProductPress(productId) }}
                                            />
                                        ))}
                                    </ScrollView>
                                )}

                                <Text style={styles.messageTimestamp}>{message.timestamp}</Text>
                            </View>
                        )}

                        {message.sender === 'user' && (
                            <View style={styles.userMessageContainer}>
                                {message.images && message.images.length > 0 ? (
                                    <View style={styles.userImageMessageContainer}>
                                        {message.images.map((image, imgIndex) => (
                                            <Image
                                                key={imgIndex}
                                                source={{ uri: image.uri }}
                                                style={styles.sentImage}
                                                resizeMode="cover"
                                            />
                                        ))}
                                        {message.text ? (
                                            <Text style={styles.imageMessageText}>{message.text}</Text>
                                        ) : null}
                                        <Text style={styles.imageTimestamp}>{message.timestamp}</Text>
                                    </View>
                                ) : (
                                    <>
                                        <View style={styles.userMessageBubble}>
                                            <Text style={styles.userMessageText}>{message.text}</Text>
                                        </View>
                                        <Text style={styles.userMessageTimestamp}>{message.timestamp}</Text>
                                    </>
                                )}
                            </View>
                        )}
                    </View>
                ))}

                {isTyping && (
                    <View style={styles.aiMessageContainer}>
                        <View style={styles.aiInfoHeader}>
                            <Image source={logo} style={styles.aiAvatar} resizeMode="contain" />
                            <View style={styles.aiInfo}>
                                <Text style={styles.aiName}>NEWMWAY AI</Text>
                            </View>
                        </View>
                        <TypingIndicator />
                    </View>
                )}

                {isUploadingImage && (
                    <View style={styles.aiMessageContainer}>
                        <View style={styles.aiInfoHeader}>
                            <Image source={logo} style={styles.aiAvatar} resizeMode="contain" />
                            <View style={styles.aiInfo}>
                                <Text style={styles.aiName}>NEWMWAY AI</Text>
                            </View>
                        </View>
                        <View style={styles.aiMessageBubble}>
                            <Text style={styles.aiMessageText}>🔍 Đang phân tích ảnh...</Text>
                        </View>
                    </View>
                )}
            </ScrollView>


            <View style={styles.inputContainer}>
                {selectedImages.length > 0 && (
                    <View style={styles.previewContainer}>
                        <ImageUploadPreview
                            images={selectedImages}
                            message={inputText}
                            onRemove={removeImage}
                        />
                    </View>
                )}

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
                        <TouchableOpacity style={styles.iconButton}>
                            <Image source={emojiIcon} style={styles.actionIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton} onPress={pickImage}>
                            <Image source={attachIcon} style={styles.actionIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.sendButton,
                                ((!inputText.trim() && selectedImages.length === 0) || isTyping || isUploadingImage) && styles.sendButtonDisabled
                            ]}
                            onPress={handleSendMessage}
                            disabled={(!inputText.trim() && selectedImages.length === 0) || isTyping || isUploadingImage}
                        >
                            <Image
                                source={sendIcon}
                                style={[
                                    styles.sendIcon,
                                    ((!inputText.trim() && selectedImages.length === 0) || isTyping || isUploadingImage) && styles.sendIconDisabled
                                ]}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
})

ChatWithAI.displayName = 'ChatWithAI'

export default ChatWithAI

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
        paddingBottom: ifTablet(100, 80),
    },
    aiMessageContainer: {
        marginBottom: ifTablet(20, 16),
        alignItems: 'flex-start',
    },
    aiInfoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: ifTablet(8, 6),
    },
    aiAvatar: {
        width: ifTablet(32, 28),
        height: ifTablet(32, 28),
        borderRadius: ifTablet(16, 14),
        marginRight: ifTablet(8, 6),
    },
    aiInfo: {
        flex: 1,
    },
    aiName: {
        fontSize: ifTablet(14, 12),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
    },
    aiMessageBubble: {
        backgroundColor: Colors.grayLight,
        borderRadius: 12,
        borderTopLeftRadius: 4,
        padding: ifTablet(14, 12),
        maxWidth: '80%',
    },
    aiMessageText: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-Regular',
        color: Colors.textDark,
        lineHeight: ifTablet(20, 18),
    },
    imageDescriptionText: {
        fontSize: ifTablet(13, 12),
        fontFamily: 'Sora-Italic',
        color: Colors.grayDark,
        lineHeight: ifTablet(18, 16),
        marginBottom: ifTablet(8, 6),
        fontStyle: 'italic',
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
    imageMessageText: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-Regular',
        color: Colors.textWhite,
        lineHeight: ifTablet(20, 18),
    },
    imageTimestamp: {
        fontSize: ifTablet(10, 9),
        fontFamily: 'Sora-Regular',
        color: 'rgba(255, 255, 255, 0.7)',
        marginTop: ifTablet(2, 1),
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
    productsScroll: {
        marginTop: ifTablet(12, 10),
    },
    productsContent: {
        paddingRight: ifTablet(8, 6),
    },
})
