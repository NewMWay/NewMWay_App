import React from 'react'
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
} from 'react-native'
import { Colors } from '../../../assets/styles/colorStyles'
import { ifTablet } from '../../../utils/responsives/responsive'

interface ConfirmSendProductModalProps {
    visible: boolean
    onClose: () => void
    onConfirm: () => void
    productName: string
    productImage: string
    productPrice: number
}

const ConfirmSendProductModal: React.FC<ConfirmSendProductModalProps> = ({
    visible,
    onClose,
    onConfirm,
    productName,
    productImage,
    productPrice,
}) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Gửi sản phẩm cho Admin</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Product Info */}
                    <View style={styles.productContainer}>
                        <Image
                            source={{ uri: productImage }}
                            style={styles.productImage}
                            resizeMode="cover"
                        />
                        <View style={styles.productInfo}>
                            <Text style={styles.productName} numberOfLines={2}>
                                {productName}
                            </Text>
                            <Text style={styles.productPrice}>
                                {productPrice.toLocaleString('vi-VN')}₫
                            </Text>
                        </View>
                    </View>

                    {/* Description */}
                    <Text style={styles.description}>
                        Bạn muốn gửi sản phẩm này cho Admin để được tư vấn?
                    </Text>

                    {/* Actions */}
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.cancelButtonText}>Hủy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.confirmButton]}
                            onPress={onConfirm}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.confirmButtonText}>Gửi ngay</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default ConfirmSendProductModal

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: ifTablet(20, 16),
    },
    modalContent: {
        backgroundColor: Colors.textWhite,
        borderRadius: ifTablet(20, 16),
        width: '100%',
        maxWidth: ifTablet(450, 380),
        padding: ifTablet(24, 20),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: ifTablet(20, 16),
    },
    title: {
        fontSize: ifTablet(20, 18),
        fontFamily: 'Sora-Bold',
        color: Colors.textDark,
    },
    closeButton: {
        padding: ifTablet(4, 2),
    },
    closeText: {
        fontSize: ifTablet(24, 20),
        color: Colors.gray,
        fontWeight: '300',
    },
    productContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.grayLight,
        borderRadius: ifTablet(12, 10),
        padding: ifTablet(12, 10),
        marginBottom: ifTablet(16, 12),
    },
    productImage: {
        width: ifTablet(80, 70),
        height: ifTablet(80, 70),
        borderRadius: ifTablet(8, 6),
        backgroundColor: '#f9fafb',
    },
    productInfo: {
        flex: 1,
        marginLeft: ifTablet(12, 10),
        justifyContent: 'center',
    },
    productName: {
        fontSize: ifTablet(15, 14),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
        marginBottom: ifTablet(6, 4),
    },
    productPrice: {
        fontSize: ifTablet(16, 15),
        fontFamily: 'Sora-Bold',
        color: Colors.primary,
    },
    description: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-Regular',
        color: Colors.gray,
        textAlign: 'center',
        marginBottom: ifTablet(20, 16),
        lineHeight: ifTablet(20, 18),
    },
    actions: {
        flexDirection: 'row',
        gap: ifTablet(12, 10),
    },
    button: {
        flex: 1,
        height: ifTablet(48, 44),
        borderRadius: ifTablet(12, 10),
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: Colors.grayLight,
    },
    confirmButton: {
        backgroundColor: Colors.primary,
    },
    cancelButtonText: {
        fontSize: ifTablet(15, 14),
        fontFamily: 'Sora-SemiBold',
        color: Colors.gray,
    },
    confirmButtonText: {
        fontSize: ifTablet(15, 14),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textWhite,
    },
})
