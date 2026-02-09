import { Button, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '../../../assets/styles/colorStyles'
import { ifTablet } from '../../../utils/responsives/responsive'

interface InfoTabProps {
    username: string
    fullName: string | null
    phone: string
    email: string
    createdDate: string
    lastModifiedDate: string
    isEditMode: boolean
    onSave: (data: { fullName: string; phone: string }) => void
    onCancel: () => void
}

const InfoTab = ({ username, fullName, phone, email, createdDate, lastModifiedDate, isEditMode, onSave, onCancel }: InfoTabProps) => {
    const [editedFullName, setEditedFullName] = useState(fullName || '')
    const [editedPhone, setEditedPhone] = useState(phone || '')
    const [showUsername, setShowUsername] = useState(false)
    const [showEmail, setShowEmail] = useState(false)

    const visibleIcon = require('../../../assets/icons/icons8-visible-48.png');
    const invisibleIcon = require('../../../assets/icons/icons8-invisible-48.png');

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const handlePressSave = () => {
        onSave({
            fullName: editedFullName,
            phone: editedPhone
        })
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Thông Tin Tài Khoản</Text>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Tên tài khoản</Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        value={username}
                        editable={false}
                        secureTextEntry={!showUsername}
                        placeholderTextColor={Colors.gray}
                    />
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => setShowUsername(!showUsername)}
                        activeOpacity={0.7}
                    >
                        <Image
                            source={showUsername ? visibleIcon : invisibleIcon}
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Họ và tên</Text>
                <View style={[styles.inputWrapper, isEditMode && styles.editableInput]}>
                    <TextInput
                        style={[styles.input, !fullName && !isEditMode && styles.placeholder]}
                        value={isEditMode ? editedFullName : fullName || ''}
                        placeholder="Chưa cập nhật"
                        editable={isEditMode}
                        onChangeText={setEditedFullName}
                        placeholderTextColor={Colors.gray}
                    />
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Số điện thoại</Text>
                <View style={[styles.inputWrapper, isEditMode && styles.editableInput]}>
                    <TextInput
                        style={[styles.input, !phone && !isEditMode && styles.placeholder]}
                        placeholder="Chưa cập nhật"
                        value={isEditMode ? editedPhone : phone || ''}
                        editable={isEditMode}
                        onChangeText={setEditedPhone}
                        placeholderTextColor={Colors.gray}
                    />
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        value={email}
                        editable={false}
                        secureTextEntry={!showEmail}
                        placeholderTextColor={Colors.gray}
                    />
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => setShowEmail(!showEmail)}
                        activeOpacity={0.7}
                    >
                        <Image
                            source={showEmail ? visibleIcon : invisibleIcon}
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Ngày tạo tài khoản</Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        value={formatDate(createdDate)}
                        editable={false}
                        placeholderTextColor={Colors.gray}
                    />
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Cập nhật lần cuối</Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        value={formatDate(lastModifiedDate)}
                        editable={false}
                        placeholderTextColor={Colors.gray}
                    />
                </View>
            </View>

            {isEditMode && (
                <View style={styles.buttonContainer}>
                    <View style={styles.buttonWrapperCancel}>
                        <Button
                            title="Hủy"
                            onPress={onCancel}
                            color={Colors.textWhite}
                        />
                    </View>
                    <View style={styles.buttonWrapperConfirm}>
                        <Button
                            title="Xác nhận"
                            onPress={handlePressSave}
                            color={Colors.textWhite}
                        />
                    </View>
                </View>
            )}
        </View>
    )
}

export default InfoTab

const styles = StyleSheet.create({
    container: {
        padding: ifTablet(24, 16),
    },
    title: {
        fontSize: ifTablet(20, 18),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
        marginBottom: ifTablet(24, 20),
    },
    inputGroup: {
        marginBottom: ifTablet(20, 16),
    },
    label: {
        fontSize: ifTablet(14, 12),
        fontFamily: 'Sora-Medium',
        color: Colors.textGray,
        marginBottom: ifTablet(8, 6),
    },
    inputWrapper: {
        borderRadius: ifTablet(12, 10),
        borderWidth: 1,
        borderColor: Colors.gray + '30',
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        paddingHorizontal: ifTablet(16, 14),
        paddingVertical: ifTablet(14, 12),
        fontSize: ifTablet(16, 14),
        fontFamily: 'Sora-Regular',
        color: Colors.textDark,
    },
    iconButton: {
        padding: ifTablet(12, 10),
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: ifTablet(20, 18),
        height: ifTablet(20, 18),
        tintColor: Colors.gray,
    },
    placeholder: {
        color: Colors.gray,
    },
    editableInput: {
        borderColor: Colors.primary,
        borderWidth: 2,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: ifTablet(16, 12),
        marginTop: ifTablet(32, 24),
        marginBottom: ifTablet(16, 12),
    },
    buttonWrapperCancel: {
        flex: 1,
        backgroundColor: Colors.grayDark,
        borderRadius: 10,
        overflow: 'hidden',
    },
    buttonWrapperConfirm: {
        flex: 1,
        backgroundColor: Colors.primary,
        borderRadius: 10,
        overflow: 'hidden',
    },

})
