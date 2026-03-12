import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Colors } from '../../../assets/styles/colorStyles';
import { ifTablet } from '../../../utils/responsives/responsive';

interface OrderNoteModalProps {
  visible: boolean;
  note: string;
  onClose: () => void;
  onSave: (note: string) => void;
}

export const OrderNoteModal: React.FC<OrderNoteModalProps> = ({
  visible,
  note,
  onClose,
  onSave
}) => {
  const [tempNote, setTempNote] = useState(note);

  const handleSave = () => {
    onSave(tempNote);
    onClose();
  };

  const handleClose = () => {
    setTempNote(note);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 30 : 0}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Ghi chú đơn hàng</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Nhập ghi chú cho đơn hàng (tùy chọn)"
              value={tempNote}
              onChangeText={setTempNote}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              placeholderTextColor="#999"
            />
            <Text style={styles.helperText}>
              Ví dụ: Giao hàng giờ hành chính, gọi trước khi đến...
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
            >
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Lưu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: ifTablet(30, 20),
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
    fontFamily: 'Sora-SemiBold',
  },
  closeButton: {
    padding: ifTablet(4, 2),
  },
  closeButtonText: {
    fontSize: ifTablet(24, 22),
    color: '#666',
    fontWeight: '300',
  },
  inputContainer: {
    paddingHorizontal: ifTablet(20, 16),
    paddingVertical: ifTablet(16, 12),
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: ifTablet(16, 12),
    paddingVertical: ifTablet(12, 10),
    fontSize: ifTablet(15, 14),
    fontFamily: 'Sora-Regular',
    color: '#333',
    backgroundColor: 'white',
    minHeight: ifTablet(120, 100),
  },
  helperText: {
    fontSize: ifTablet(13, 12),
    color: '#999',
    fontFamily: 'Sora-Regular',
    marginTop: ifTablet(8, 6),
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: ifTablet(20, 16),
    gap: ifTablet(12, 10),
  },
  button: {
    flex: 1,
    paddingVertical: ifTablet(14, 12),
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cancelButtonText: {
    fontSize: ifTablet(16, 14),
    fontWeight: '600',
    fontFamily: 'Sora-SemiBold',
    color: '#666',
  },
  saveButton: {
    backgroundColor: Colors.primary || '#E53935',
  },
  saveButtonText: {
    fontSize: ifTablet(16, 14),
    fontWeight: '600',
    fontFamily: 'Sora-SemiBold',
    color: 'white',
  },
});
