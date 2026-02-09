import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import { Colors } from '../../../assets/styles/colorStyles';
import { ifTablet } from '../../../utils/responsives/responsive';

export interface LocationOption {
    id: string;
    name: string;
}

interface SelectModalProps {
    visible: boolean;
    title: string;
    data: LocationOption[];
    onSelect: (item: LocationOption) => void;
    onClose: () => void;
    isLoading?: boolean;
}

export const SelectModal: React.FC<SelectModalProps> = ({
    visible,
    title,
    data,
    onSelect,
    onClose,
    isLoading
}) => {
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState<LocationOption[]>(data);

    useEffect(() => {
        if (searchText.trim() === '') {
            setFilteredData(data);
        } else {
            const filtered = data.filter(item =>
                item.name.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredData(filtered);
        }
    }, [searchText, data]);

    const handleSelect = (item: LocationOption) => {
        onSelect(item);
        setSearchText('');
    };

    const handleClose = () => {
        setSearchText('');
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={handleClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{title}</Text>
                        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Tìm kiếm..."
                            value={searchText}
                            onChangeText={setSearchText}
                            placeholderTextColor="#999"
                        />
                    </View>

                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={Colors.primary} />
                        </View>
                    ) : (
                        <FlatList
                            data={filteredData}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.optionItem}
                                    onPress={() => handleSelect(item)}
                                >
                                    <Text style={styles.optionText}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                            ItemSeparatorComponent={() => <View style={styles.separator} />}
                            ListEmptyComponent={() => (
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyText}>Không tìm thấy kết quả</Text>
                                </View>
                            )}
                        />
                    )}
                </View>
            </View>
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
    loadingContainer: {
        paddingVertical: ifTablet(40, 30),
        alignItems: 'center',
    },
    emptyContainer: {
        paddingVertical: ifTablet(40, 30),
        alignItems: 'center',
    },
    emptyText: {
        fontSize: ifTablet(15, 14),
        color: '#999',
    },
});
