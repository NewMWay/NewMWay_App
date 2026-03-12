import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    Text,
    ActivityIndicator,
    Modal,
    TextInput,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { Colors } from '../../../assets/styles/colorStyles'
import { ifTablet } from '../../../utils/responsives/responsive'
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { ProfileStackNavigationProp, ProfileStackParamList } from '../../../types/navigation/navigation'
import { useUpdateUserBanking, useUserBankingDetailQuery } from '../../refund/hooks/useBanking.hook'
import { useToast } from '../../../utils/toasts/useToast'
import { BankName } from '../../refund/enums/bankName.enum'
import { InputField } from '../../address/components/InputField'

type EditUserBankingScreenRouteProp = RouteProp<ProfileStackParamList, 'EditUserBankingScreen'>

interface BankOption {
    id: string
    name: string
}

const EditUserBankingScreen = () => {
    const navigation = useNavigation<ProfileStackNavigationProp>()
    const route = useRoute<EditUserBankingScreenRouteProp>()
    const { id } = route.params

    const { data: bankingDetail, isLoading: isLoadingDetail } = useUserBankingDetailQuery({ id })
    const { mutate: updateBanking, isPending } = useUpdateUserBanking()
    const { showError } = useToast()

    const [selectedBank, setSelectedBank] = useState<BankOption | null>(null)
    const [bankNumber, setBankNumber] = useState('')
    const [showBankModal, setShowBankModal] = useState(false)

    // Convert BankName enum to array of options
    const bankOptions: BankOption[] = Object.values(BankName).map((bank) => ({
        id: bank,
        name: bank,
    }))

    // Load existing data
    useEffect(() => {
        if (bankingDetail) {
            setSelectedBank({
                id: bankingDetail.bankName,
                name: bankingDetail.bankName,
            })
            setBankNumber(bankingDetail.bankNumber)
        }
    }, [bankingDetail])

    const handleGoBack = () => {
        navigation.goBack()
    }

    const handleSelectBank = (bank: BankOption) => {
        setSelectedBank(bank)
        setShowBankModal(false)
    }

    const handleSubmit = () => {
        // Validation
        if (!selectedBank) {
            showError('Vui lòng chọn ngân hàng')
            return
        }
        if (!bankNumber.trim()) {
            showError('Vui lòng nhập số tài khoản')
            return
        }

        const payload = {
            id,
            bankName: selectedBank.id as BankName,
            bankNumber: bankNumber.trim(),
        }

        updateBanking(payload, {
            onSuccess: () => {
                navigation.goBack()
            },
        })
    }

    if (isLoadingDetail) {
        return (
            <View style={styles.container}>
                <PrimaryHeader title="Cập nhật ngân hàng" onBackPress={handleGoBack} />
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <PrimaryHeader title="Cập nhật ngân hàng" onBackPress={handleGoBack} />

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.formContainer}>
                            {/* Bank Selection */}
                            <View style={styles.fieldContainer}>
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>Ngân hàng</Text>
                                    <Text style={styles.required}>*</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.selectField}
                                    onPress={() => setShowBankModal(true)}
                                >
                                    <Text
                                        style={[
                                            styles.selectFieldText,
                                            !selectedBank && styles.selectFieldPlaceholder,
                                        ]}
                                    >
                                        {selectedBank?.name || 'Chọn ngân hàng'}
                                    </Text>
                                    <Text style={styles.selectFieldArrow}>›</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Bank Number */}
                            <InputField
                                label="Số tài khoản"
                                required
                                placeholder="Nhập số tài khoản ngân hàng"
                                value={bankNumber}
                                onChangeText={setBankNumber}
                                keyboardType="number-pad"
                            />
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

            {/* Submit Button */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    style={[styles.submitButton, isPending && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={isPending}
                >
                    {isPending ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.submitButtonText}>Cập nhật</Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* Bank Selection Modal */}
            <BankSelectModal
                visible={showBankModal}
                data={bankOptions}
                onSelect={handleSelectBank}
                onClose={() => setShowBankModal(false)}
            />
        </View>
    )
}

export default EditUserBankingScreen

// Extracted components for FlatList
const ItemSeparator = () => <View style={modalStyles.separator} />

const EmptyList = () => (
    <View style={modalStyles.emptyContainer}>
        <Text style={modalStyles.emptyText}>Không tìm thấy kết quả</Text>
    </View>
)

// Bank Selection Modal Component
interface BankSelectModalProps {
    visible: boolean
    data: BankOption[]
    onSelect: (item: BankOption) => void
    onClose: () => void
}

const BankSelectModal: React.FC<BankSelectModalProps> = ({
    visible,
    data,
    onSelect,
    onClose,
}) => {
    const [searchText, setSearchText] = useState('')
    const [filteredData, setFilteredData] = useState<BankOption[]>(data)

    useEffect(() => {
        if (searchText.trim() === '') {
            setFilteredData(data)
        } else {
            const filtered = data.filter((item) =>
                item.name.toLowerCase().includes(searchText.toLowerCase())
            )
            setFilteredData(filtered)
        }
    }, [searchText, data])

    const handleSelect = (item: BankOption) => {
        onSelect(item)
        setSearchText('')
    }

    const handleClose = () => {
        setSearchText('')
        onClose()
    }

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={handleClose}
        >
            <View style={modalStyles.modalOverlay}>
                <View style={modalStyles.modalContent}>
                    <View style={modalStyles.modalHeader}>
                        <Text style={modalStyles.modalTitle}>Chọn ngân hàng</Text>
                        <TouchableOpacity onPress={handleClose} style={modalStyles.closeButton}>
                            <Text style={modalStyles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={modalStyles.searchContainer}>
                        <TextInput
                            style={modalStyles.searchInput}
                            placeholder="Tìm kiếm ngân hàng..."
                            value={searchText}
                            onChangeText={setSearchText}
                            placeholderTextColor="#999"
                        />
                    </View>

                    <FlatList
                        data={filteredData}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={modalStyles.optionItem}
                                onPress={() => handleSelect(item)}
                            >
                                <Text style={modalStyles.optionText}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                        ItemSeparatorComponent={ItemSeparator}
                        ListEmptyComponent={EmptyList}
                    />
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    flex: {
        flex: 1,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: ifTablet(100, 90),
    },
    formContainer: {
        marginHorizontal: ifTablet(32, 16),
        paddingTop: ifTablet(20, 16),
    },
    fieldContainer: {
        marginBottom: ifTablet(20, 16),
    },
    labelContainer: {
        flexDirection: 'row',
        marginBottom: ifTablet(8, 6),
    },
    label: {
        fontSize: ifTablet(15, 14),
        fontWeight: '500',
        color: '#333',
    },
    required: {
        fontSize: ifTablet(15, 14),
        fontWeight: '500',
        color: Colors.error,
        marginLeft: 4,
    },
    selectField: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        paddingHorizontal: ifTablet(16, 12),
        paddingVertical: ifTablet(12, 10),
        backgroundColor: '#F9F9F9',
    },
    selectFieldText: {
        fontSize: ifTablet(15, 14),
        color: '#333',
        flex: 1,
    },
    selectFieldPlaceholder: {
        color: '#999',
    },
    selectFieldArrow: {
        fontSize: ifTablet(24, 20),
        color: '#999',
        marginLeft: ifTablet(8, 6),
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 25,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingHorizontal: ifTablet(32, 16),
        paddingVertical: ifTablet(16, 12),
    },
    submitButton: {
        backgroundColor: Colors.primary || '#E53935',
        borderRadius: 8,
        paddingVertical: ifTablet(14, 12),
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        fontSize: ifTablet(16, 15),
        fontWeight: '600',
        color: 'white',
    },
})

const modalStyles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
        paddingBottom: ifTablet(20, 16),
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: ifTablet(20, 16),
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    modalTitle: {
        fontSize: ifTablet(18, 16),
        fontWeight: '600',
        color: '#333',
    },
    closeButton: {
        padding: ifTablet(4, 2),
    },
    closeButtonText: {
        fontSize: ifTablet(24, 22),
        color: '#666',
        fontWeight: '300',
    },
    searchContainer: {
        paddingHorizontal: ifTablet(20, 16),
        paddingVertical: ifTablet(12, 10),
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        paddingHorizontal: ifTablet(16, 12),
        paddingVertical: ifTablet(10, 8),
        fontSize: ifTablet(15, 14),
        backgroundColor: '#F9F9F9',
    },
    optionItem: {
        paddingHorizontal: ifTablet(20, 16),
        paddingVertical: ifTablet(14, 12),
    },
    optionText: {
        fontSize: ifTablet(15, 14),
        color: '#333',
    },
    separator: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginHorizontal: ifTablet(20, 16),
    },
    emptyContainer: {
        paddingVertical: ifTablet(40, 30),
        alignItems: 'center',
    },
    emptyText: {
        fontSize: ifTablet(15, 14),
        color: '#999',
    },
})