import React from 'react'
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet, Image, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native'
import { Colors } from '../../../assets/styles/colorStyles'
import { ifTablet } from '../../../utils/responsives/responsive'
import { UserBankingItem } from '../../refund/types/bank.type'

interface CancelOrderModalProps {
    visible: boolean
    onClose: () => void
    cancelReason: string
    onChangeCancelReason: (text: string) => void
    bankingData?: UserBankingItem[]
    selectedBankingId: string | null
    selectedBanking?: UserBankingItem
    showBankingDropdown: boolean
    onToggleDropdown: () => void
    onSelectBankingItem: (id: string) => void
    onAddNewBanking: () => void
    onSubmit: () => void
    isPending?: boolean
}

const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
    visible,
    onClose,
    cancelReason,
    onChangeCancelReason,
    bankingData,
    selectedBankingId,
    selectedBanking,
    showBankingDropdown,
    onToggleDropdown,
    onSelectBankingItem,
    onAddNewBanking,
    onSubmit,
    isPending = false
}) => {
    const arrowIcon = require('../../../assets/icons/icons8-forward-48.png')
    const downIcon = require('../../../assets/icons/icons8-down-48.png')

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Hủy Đơn Hàng</Text>

                            {/* Reason Input */}
                            <Text style={styles.modalLabel}>
                                Lý do hủy đơn <Text style={styles.required}>*</Text>
                            </Text>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="Nhập lý do hủy đơn hàng"
                                value={cancelReason}
                                onChangeText={onChangeCancelReason}
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                            />

                            {/* Banking Selection */}
                            <Text style={[styles.modalLabel, { marginTop: ifTablet(16, 12) }]}>
                                Tài khoản hoàn tiền
                            </Text>

                            {bankingData && bankingData.length > 0 ? (
                                <View>
                                    <TouchableOpacity
                                        style={styles.bankingSelector}
                                        onPress={onToggleDropdown}
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
                                            style={styles.arrowIconSmall}
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
                                                        onPress={() => onSelectBankingItem(banking.id)}
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
                                    onPress={onAddNewBanking}
                                >
                                    <Text style={styles.emptyBankingText}>Bạn chưa có ngân hàng nào</Text>
                                    <Text style={styles.emptyBankingLink}>Nhấn để thêm mới</Text>
                                </TouchableOpacity>
                            )}

                            {/* Action Buttons */}
                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.modalButtonCancel]}
                                    onPress={onClose}
                                >
                                    <Text style={styles.modalButtonTextCancel}>Đóng</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.modalButtonSubmit, isPending && styles.modalButtonDisabled]}
                                    onPress={onSubmit}
                                    disabled={isPending}
                                    activeOpacity={isPending ? 1 : 0.7}
                                >
                                    <Text style={styles.modalButtonTextSubmit}>
                                        {isPending ? 'Đang xử lý...' : 'Tiếp tục'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

export default CancelOrderModal

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: ifTablet(20, 16),
    },
    modalContainer: {
        backgroundColor: Colors.textWhite,
        borderRadius: ifTablet(12, 10),
        padding: ifTablet(20, 16),
        width: '100%',
        maxWidth: ifTablet(500, 400),
    },
    modalTitle: {
        fontSize: ifTablet(18, 16),
        fontFamily: 'Sora-Bold',
        color: Colors.textDark,
        marginBottom: ifTablet(16, 12),
    },
    modalLabel: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
        marginBottom: ifTablet(8, 6),
    },
    required: {
        color: Colors.error,
    },
    modalInput: {
        borderWidth: 1,
        borderColor: Colors.grayLight,
        borderRadius: ifTablet(8, 6),
        padding: ifTablet(12, 10),
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-Regular',
        color: Colors.textDark,
        minHeight: ifTablet(100, 80),
    },
    bankingSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: Colors.grayLight,
        borderRadius: ifTablet(8, 6),
        padding: ifTablet(12, 10),
        backgroundColor: Colors.textWhite,
    },
    bankingName: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
    },
    bankingNumber: {
        fontSize: ifTablet(12, 11),
        fontFamily: 'Sora-Regular',
        color: Colors.textGray,
        marginTop: ifTablet(2, 1),
    },
    bankingPlaceholder: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-Regular',
        color: Colors.textGray,
    },
    arrowIconSmall: {
        width: ifTablet(20, 18),
        height: ifTablet(20, 18),
        tintColor: Colors.textGray,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: ifTablet(12, 10),
        marginTop: ifTablet(20, 16),
    },
    modalButton: {
        flex: 1,
        paddingVertical: ifTablet(12, 10),
        borderRadius: ifTablet(8, 6),
        alignItems: 'center',
    },
    modalButtonCancel: {
        backgroundColor: Colors.grayLight,
    },
    modalButtonSubmit: {
        backgroundColor: Colors.primary,
    },
    modalButtonDisabled: {
        backgroundColor: Colors.primary,
        opacity: 0.6,
    },
    modalButtonTextCancel: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
    },
    modalButtonTextSubmit: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textWhite,
    },
    dropdownContainer: {
        marginTop: ifTablet(8, 6),
        borderWidth: 1,
        borderColor: Colors.grayLight,
        borderRadius: ifTablet(8, 6),
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
        padding: ifTablet(12, 10),
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
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
    },
    dropdownBankNumber: {
        fontSize: ifTablet(12, 11),
        fontFamily: 'Sora-Regular',
        color: Colors.textGray,
        marginTop: ifTablet(2, 1),
    },
    selectedIndicator: {
        width: ifTablet(8, 6),
        height: ifTablet(8, 6),
        borderRadius: ifTablet(4, 3),
        backgroundColor: Colors.primary,
        marginLeft: ifTablet(8, 6),
    },
    emptyBankingContainer: {
        borderWidth: 1,
        borderColor: Colors.grayLight,
        borderRadius: ifTablet(8, 6),
        padding: ifTablet(16, 14),
        alignItems: 'center',
        backgroundColor: Colors.grayLight + '30',
    },
    emptyBankingText: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-Regular',
        color: Colors.textGray,
        marginBottom: ifTablet(4, 3),
    },
    emptyBankingLink: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-SemiBold',
        color: Colors.primary,
    },
})
