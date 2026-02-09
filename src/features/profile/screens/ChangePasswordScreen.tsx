import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader'
import { Colors } from '../../../assets/styles/colorStyles'
import { ifTablet } from '../../../utils/responsives/responsive'
import { ProfileStackNavigationProp } from '../../../types/navigation/navigation'
import { useUpdateProfile } from '../hooks/useProfile.hook'
import { useToast } from '../../../utils/toasts/useToast'
import LoadingOverlay from '../../auth/components/Loading/LoadingOverlay'

const ChangePasswordScreen = () => {
    const navigation = useNavigation<ProfileStackNavigationProp>()
    const { mutate: updateProfile, isPending } = useUpdateProfile()
    const { showSuccess, showError } = useToast()

    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleSavePassword = () => {
        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            showError('Vui lòng điền đầy đủ thông tin')
            return
        }

        if (newPassword.length < 6) {
            showError('Mật khẩu mới phải có ít nhất 6 ký tự')
            return
        }

        if (newPassword !== confirmPassword) {
            showError('Mật khẩu xác nhận không khớp')
            return
        }

        Alert.alert(
            'Xác nhận',
            'Bạn có chắc chắn muốn đổi mật khẩu?',
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xác nhận',
                    onPress: () => {
                        updateProfile(
                            { password: newPassword },
                            {
                                onSuccess: () => {
                                    showSuccess('Đổi mật khẩu thành công')
                                    navigation.goBack()
                                },
                                onError: (error: any) => {
                                    showError(error?.message || 'Đổi mật khẩu thất bại')
                                }
                            }
                        )
                    }
                }
            ]
        )
    }

    return (
        <View style={styles.container}>
            <PrimaryHeader title="Đổi Mật Khẩu" onBackPress={() => navigation.goBack()} />
            
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <Text style={styles.description}>
                        Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
                    </Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Mật khẩu hiện tại</Text>
                        <TextInput
                            style={styles.input}
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            placeholder="Nhập mật khẩu hiện tại"
                            secureTextEntry
                            placeholderTextColor={Colors.textGray}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Mật khẩu mới</Text>
                        <TextInput
                            style={styles.input}
                            value={newPassword}
                            onChangeText={setNewPassword}
                            placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                            secureTextEntry
                            placeholderTextColor={Colors.textGray}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Xác nhận mật khẩu mới</Text>
                        <TextInput
                            style={styles.input}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="Nhập lại mật khẩu mới"
                            secureTextEntry
                            placeholderTextColor={Colors.textGray}
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSavePassword}
                        activeOpacity={0.7}
                        disabled={isPending}
                    >
                        <Text style={styles.saveButtonText}>Lưu Thay Đổi</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            
            <LoadingOverlay visible={isPending} />
        </View>
    )
}

export default ChangePasswordScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.grayLight,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: ifTablet(24, 20),
    },
    description: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-Regular',
        color: Colors.textGray,
        marginBottom: ifTablet(24, 20),
        lineHeight: ifTablet(22, 20),
    },
    inputContainer: {
        marginBottom: ifTablet(20, 18),
    },
    label: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
        marginBottom: ifTablet(8, 6),
    },
    input: {
        backgroundColor: Colors.textWhite,
        borderRadius: ifTablet(12, 10),
        padding: ifTablet(16, 14),
        fontSize: ifTablet(15, 14),
        fontFamily: 'Sora-Regular',
        color: Colors.textDark,
        borderWidth: 1,
        borderColor: Colors.grayLight,
    },
    saveButton: {
        backgroundColor: Colors.primary,
        borderRadius: ifTablet(12, 10),
        padding: ifTablet(16, 14),
        alignItems: 'center',
        marginTop: ifTablet(20, 16),
    },
    saveButtonText: {
        fontSize: ifTablet(16, 15),
        fontFamily: 'Sora-Bold',
        color: Colors.textWhite,
    },
})
