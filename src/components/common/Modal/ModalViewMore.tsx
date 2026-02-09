import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import { Colors } from '../../../assets/styles/colorStyles';



// Định nghĩa kiểu cho props của ModalViewMore
interface ModalViewMoreProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  buttons: { text: string; onPress: () => void }[];
}

const ModalViewMore: React.FC<ModalViewMoreProps> = ({ visible, title, onClose, buttons }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          onPress={onClose}
          activeOpacity={1} // Đảm bảo overlay không ảnh hưởng khi nhấn
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{title}</Text>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={styles.modalButton}
                onPress={() => {
                  button.onPress();
                  onClose();
                }}
              >
                <Text style={styles.modalButtonText}>{button.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default ModalViewMore;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayTouchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: 300,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButton: {
    paddingVertical: 10,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalButtonText: {
    fontSize: 16,
    color: Colors.textDark,
    textAlign: 'center',
  },
});