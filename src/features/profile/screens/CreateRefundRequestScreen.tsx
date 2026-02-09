import { ActivityIndicator, Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform } from 'react-native'
import React, { useState } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { ProfileStackNavigationProp, ProfileStackParamList } from '../../../types/navigation/navigation'
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader'
import { Colors } from '../../../assets/styles/colorStyles'
import { ifTablet } from '../../../utils/responsives/responsive'
import { useUserBankingQuery } from '../../refund/hooks/useBanking.hook'
import { useCreateRefund } from '../../refund/hooks/useRefund.hook'
import { launchImageLibrary } from 'react-native-image-picker'
import { useToast } from '../../../utils/toasts/useToast'

// Predefined reasons
const REFUND_REASONS = [
    'Sản phẩm không đúng mô tả',
    'Sản phẩm bị lỗi/hư hỏng',
    'Không nhận được hàng',
    'Muốn đổi sang sản phẩm khác',
    'Không còn nhu cầu sử dụng',
    'Khác'
]

const CreateRefundRequestScreen = () => {
    const navigation = useNavigation<ProfileStackNavigationProp>()
    const route = useRoute<RouteProp<ProfileStackParamList, 'CreateRefundRequestScreen'>>()
    const orderId = route.params?.orderId || ''
    const { showError } = useToast()

    const { data: bankingData, isLoading: isBankingLoading } = useUserBankingQuery()
    const { mutate: createRefund, isPending } = useCreateRefund()

    // Icons
    const downIcon = require('../../../assets/icons/icons8-down-48.png')
    const arrowIcon = require('../../../assets/icons/icons8-forward-48.png')
    const addIcon = require('../../../assets/icons/icons8-camera-48.png')
    const deleteIcon = require('../../../assets/icons/icons8-full-trash-48.png')

    // States
    const [selectedBankingId, setSelectedBankingId] = useState<string | null>(null)
    const [showBankingDropdown, setShowBankingDropdown] = useState(false)
    const [selectedReasonIndex, setSelectedReasonIndex] = useState<number | null>(null)
    const [customReason, setCustomReason] = useState('')
    const [selectedImages, setSelectedImages] = useState<Array<{ uri: string, name: string }>>([])

    const selectedBanking = bankingData?.find(b => b.id === selectedBankingId)
    const isOtherSelected = selectedReasonIndex === REFUND_REASONS.length - 1

    const handleBackPress = () => {
        navigation.goBack()
    }

    const handleToggleBankingDropdown = () => {
        setShowBankingDropdown(!showBankingDropdown)
    }

    const handleSelectBanking = (id: string) => {
        setSelectedBankingId(id)
        setShowBankingDropdown(false)
    }

    const handleAddBanking = () => {
        navigation.navigate('AddUserBankingScreen')
    }

    const handleSelectReason = (index: number) => {
        setSelectedReasonIndex(index)
        if (index !== REFUND_REASONS.length - 1) {
            setCustomReason('')
        }
    }

    const handleImagePick = async () => {
        if (selectedImages.length >= 5) {
            showError('Chỉ được chọn tối đa 5 hình ảnh')
            return
        }

        const result = await launchImageLibrary({
            mediaType: 'photo',
            quality: 0.8,
            selectionLimit: 5 - selectedImages.length,
        })

        if (result.assets && result.assets.length > 0) {
            const newImages = result.assets.map(asset => ({
                uri: asset.uri!,
                name: asset.fileName || `image_${Date.now()}.jpg`,
            }))
            setSelectedImages([...selectedImages, ...newImages])
        }
    }

    const handleRemoveImage = (index: number) => {
        const newImages = selectedImages.filter((_, i) => i !== index)
        setSelectedImages(newImages)
    }

    const handleSubmit = () => {
        // Validate banking
        if (!selectedBankingId) {
            showError('Vui lòng chọn tài khoản ngân hàng')
            return
        }

        // Validate reason
        if (selectedReasonIndex === null) {
            showError('Vui lòng chọn lý do hoàn tiền')
            return
        }

        if (isOtherSelected && !customReason.trim()) {
            showError('Vui lòng nhập lý do hoàn tiền')
            return
        }

        const reason = isOtherSelected ? customReason : REFUND_REASONS[selectedReasonIndex]

        // Prepare images for multipart upload
        const imageFiles = selectedImages.map(img => ({
            uri: img.uri,
            type: img.uri.endsWith('.png') ? 'image/png' : 'image/jpeg',
            name: img.name,
        }))

        const refundData = {
            id: orderId,
            UserBankingId: selectedBankingId,
            Reason: reason,
            Images: imageFiles
        }

        createRefund(refundData, {
            onSuccess: () => {
                navigation.goBack()
            }
        })
    }

    return (
        <View style={styles.container}>
            <PrimaryHeader
                title="Yêu Cầu Hoàn Tiền & Trả Hàng"
                onBackPress={handleBackPress}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardView}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Banking Selection */}
                    <View style={styles.section}>
                        <Text style={styles.label}>
                            Tài khoản nhận hoàn tiền <Text style={styles.required}>*</Text>
                        </Text>

                        {isBankingLoading ? (
                            <View style={styles.loadingBanking}>
                                <ActivityIndicator size="small" color={Colors.primary} />
                            </View>
                        ) : bankingData && bankingData.length > 0 ? (
                            <View>
                                <TouchableOpacity
                                    style={styles.bankingSelector}
                                    onPress={handleToggleBankingDropdown}
                                >
                                    {selectedBanking ? (
                                        <View>
                                            <Text style={styles.bankingName}>{selectedBanking.bankName}</Text>
                                            <Text style={styles.bankingNumber}>{selectedBanking.bankNumber}</Text>
                                        </View>
                                    ) : (
                                        <Text style={styles.bankingPlaceholder}>Chọn tài khoản ngân hàng</Text>
                                    )}
                                    <Image
                                        source={showBankingDropdown ? downIcon : arrowIcon}
                                        style={styles.arrowIcon}
                                    />
                                </TouchableOpacity>

                                {showBankingDropdown && (
                                    <View style={styles.dropdownContainer}>
                                        <ScrollView
                                            style={styles.dropdownScrollView}
                                            nestedScrollEnabled
                                        >
                                            {bankingData.map((banking) => (
                                                <TouchableOpacity
                                                    key={banking.id}
                                                    style={[
                                                        styles.dropdownItem,
                                                        selectedBankingId === banking.id && styles.dropdownItemSelected
                                                    ]}
                                                    onPress={() => handleSelectBanking(banking.id)}
                                                >
                                                    <View style={styles.dropdownItemContent}>
                                                        <Text style={styles.dropdownBankName}>{banking.bankName}</Text>
                                                        <Text style={styles.dropdownBankNumber}>{banking.bankNumber}</Text>
                                                    </View>
                                                    {selectedBankingId === banking.id && (
                                                        <View style={styles.selectedIndicator} />
                                                    )}
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </View>
                                )}
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={styles.emptyBankingContainer}
                                onPress={handleAddBanking}
                            >
                                <Text style={styles.emptyBankingText}>Bạn chưa có ngân hàng nào</Text>
                                <Text style={styles.emptyBankingLink}>Nhấn để thêm mới</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Reason Selection */}
                    <View style={styles.section}>
                        <Text style={styles.label}>
                            Lý do hoàn tiền <Text style={styles.required}>*</Text>
                        </Text>
                        <View style={styles.reasonsContainer}>
                            {REFUND_REASONS.map((reason, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.reasonChip,
                                        selectedReasonIndex === index && styles.reasonChipSelected
                                    ]}
                                    onPress={() => handleSelectReason(index)}
                                    activeOpacity={0.7}
                                >
                                    <Text
                                        style={[
                                            styles.reasonChipText,
                                            selectedReasonIndex === index && styles.reasonChipTextSelected
                                        ]}
                                    >
                                        {reason}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {isOtherSelected && (
                            <TextInput
                                style={styles.customReasonInput}
                                placeholder="Nhập lý do của bạn..."
                                placeholderTextColor={Colors.textGray}
                                value={customReason}
                                onChangeText={setCustomReason}
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                                maxLength={200}
                            />
                        )}
                    </View>

                    {/* Images Section */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Hình ảnh minh chứng (nếu có)</Text>
                        <View style={styles.imagesContainer}>
                            {selectedImages.map((image, index) => (
                                <View key={index} style={styles.imageWrapper}>
                                    <Image source={{ uri: image.uri }} style={styles.imagePreview} />
                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() => handleRemoveImage(index)}
                                        activeOpacity={0.7}
                                    >
                                        <Image source={deleteIcon} style={styles.deleteIcon} />
                                    </TouchableOpacity>
                                </View>
                            ))}

                            {selectedImages.length < 5 && (
                                <TouchableOpacity
                                    style={styles.addImageButton}
                                    onPress={handleImagePick}
                                    activeOpacity={0.7}
                                >
                                    <Image source={addIcon} style={styles.addIcon} />
                                </TouchableOpacity>
                            )}
                        </View>
                        <Text style={styles.imageHint}>Chọn tối đa 5 hình ảnh</Text>
                    </View>
                </ScrollView>

                {/* Submit Button */}
                <View style={styles.submitContainer}>
                    <TouchableOpacity
                        style={[styles.submitButton, isPending && styles.submitButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={isPending}
                        activeOpacity={0.7}
                    >
                        {isPending ? (
                            <ActivityIndicator size="small" color={Colors.textWhite} />
                        ) : (
                            <Text style={styles.submitButtonText}>Gửi Yêu Cầu</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}

export default CreateRefundRequestScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    keyboardView: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: ifTablet(16, 12),
    },
    section: {
        marginBottom: ifTablet(24, 20),
    },
    label: {
        fontSize: ifTablet(15, 14),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
        marginBottom: ifTablet(12, 10),
    },
    required: {
        color: Colors.error,
    },
    loadingBanking: {
        padding: ifTablet(20, 16),
        alignItems: 'center',
    },
    bankingSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: Colors.grayLight,
        borderRadius: ifTablet(12, 10),
        padding: ifTablet(14, 12),
        backgroundColor: Colors.textWhite,
    },
    bankingName: {
        fontSize: ifTablet(15, 14),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
    },
    bankingNumber: {
        fontSize: ifTablet(13, 12),
        fontFamily: 'Sora-Regular',
        color: Colors.primaryDark,
        marginTop: ifTablet(4, 3),
    },
    bankingPlaceholder: {
        fontSize: ifTablet(15, 14),
        fontFamily: 'Sora-Regular',
        color: Colors.primaryDark,
    },
    arrowIcon: {
        width: ifTablet(20, 18),
        height: ifTablet(20, 18),
        tintColor: Colors.primaryDark,
    },
    dropdownContainer: {
        marginTop: ifTablet(8, 6),
        borderWidth: 1,
        borderColor: Colors.grayLight,
        borderRadius: ifTablet(12, 10),
        backgroundColor: Colors.textWhite,
        maxHeight: ifTablet(200, 180),
    },
    dropdownScrollView: {
        maxHeight: ifTablet(200, 180),
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: ifTablet(14, 12),
        borderBottomWidth: 1,
        borderBottomColor: Colors.grayLight,
    },
    dropdownItemSelected: {
        backgroundColor: Colors.primary + '10',
    },
    dropdownItemContent: {
        flex: 1,
    },
    dropdownBankName: {
        fontSize: ifTablet(15, 14),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
    },
    dropdownBankNumber: {
        fontSize: ifTablet(13, 12),
        fontFamily: 'Sora-Regular',
        color: Colors.primaryDark,
        marginTop: ifTablet(2, 1),
    },
    selectedIndicator: {
        width: ifTablet(10, 8),
        height: ifTablet(10, 8),
        borderRadius: ifTablet(5, 4),
        backgroundColor: Colors.primary,
        marginLeft: ifTablet(8, 6),
    },
    emptyBankingContainer: {
        borderWidth: 1,
        borderColor: Colors.grayLight,
        borderRadius: ifTablet(12, 10),
        padding: ifTablet(20, 16),
        alignItems: 'center',
        backgroundColor: Colors.grayLight + '30',
    },
    emptyBankingText: {
        fontSize: ifTablet(15, 14),
        fontFamily: 'Sora-Regular',
        color: Colors.primaryDark,
        marginBottom: ifTablet(6, 5),
    },
    emptyBankingLink: {
        fontSize: ifTablet(15, 14),
        fontFamily: 'Sora-SemiBold',
        color: Colors.primary,
    },

    // Reason Styles
    reasonsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: ifTablet(10, 8),
    },
    reasonChip: {
        paddingHorizontal: ifTablet(16, 14),
        paddingVertical: ifTablet(10, 8),
        borderRadius: ifTablet(20, 18),
        borderWidth: 1,
        borderColor: Colors.grayLight,
        backgroundColor: Colors.textWhite,
    },
    reasonChipSelected: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primary + '15',
    },
    reasonChipText: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-Medium',
        color: Colors.primaryDark,
    },
    reasonChipTextSelected: {
        color: Colors.primary,
        fontFamily: 'Sora-SemiBold',
    },
    customReasonInput: {
        marginTop: ifTablet(12, 10),
        borderWidth: 1,
        borderColor: Colors.grayLight,
        borderRadius: ifTablet(12, 10),
        padding: ifTablet(14, 12),
        fontSize: ifTablet(15, 14),
        fontFamily: 'Sora-Regular',
        color: Colors.primaryDark,
        minHeight: ifTablet(100, 80),
        backgroundColor: Colors.textWhite,
    },

    // Images Styles
    imagesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: ifTablet(12, 10),
    },
    imageWrapper: {
        position: 'relative',
    },
    imagePreview: {
        width: ifTablet(100, 85),
        height: ifTablet(100, 85),
        borderRadius: ifTablet(12, 10),
        backgroundColor: Colors.gray,
    },
    deleteButton: {
        position: 'absolute',
        top: ifTablet(-6, -5),
        right: ifTablet(-6, -5),
        backgroundColor: Colors.textWhite,
        borderRadius: ifTablet(15, 13),
        padding: ifTablet(6, 2),
        borderWidth: 2,
        borderColor: Colors.textWhite,
    },
    deleteIcon: {
        width: ifTablet(16, 16),
        height: ifTablet(16, 16),
        tintColor: Colors.error,
    },
    addImageButton: {
        width: ifTablet(100, 85),
        height: ifTablet(100, 85),
        borderRadius: ifTablet(12, 10),
        borderWidth: 2,
        borderColor: Colors.primary,
        borderStyle: 'dashed',
        backgroundColor: Colors.textWhite,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addIcon: {
        width: ifTablet(40, 35),
        height: ifTablet(40, 35),
        tintColor: Colors.primary,
    },
    imageHint: {
        fontSize: ifTablet(12, 11),
        fontFamily: 'Sora-Regular',
        color: Colors.primaryDark,
        marginTop: ifTablet(8, 6),
    },

    // Submit Button
    submitContainer: {
        padding: ifTablet(16, 12),
        backgroundColor: Colors.textWhite,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingBottom: ifTablet(70, 50),
    },
    submitButton: {
        backgroundColor: Colors.primary,
        paddingVertical: ifTablet(16, 14),
        borderRadius: ifTablet(12, 10),
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        fontSize: ifTablet(16, 15),
        fontFamily: 'Sora-Bold',
        color: Colors.textWhite,
    },
})