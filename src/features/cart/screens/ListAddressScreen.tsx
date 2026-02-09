import { ScrollView, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { ifTablet } from '../../../utils/responsives/responsive'
import { Colors } from '../../../assets/styles/colorStyles'
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader'
import { CartStackNavigationProp } from '../../../types/navigation/navigation'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { useUserAddressQuery } from '../../address/hooks/useAddress.hook'
import { CartStackParamList } from '../../../types/navigation/navigation'
import { setSelectedAddressForCheckout, getSelectedAddressForCheckout } from '../stores/addressSelectionStore'

type ListAddressScreenRouteProp = RouteProp<CartStackParamList, 'ListAddressScreen'>;

interface AddressItemProps {
    id: string;
    receiverName: string;
    receiverPhone: string;
    province: string;
    district: string;
    ward: string;
    address: string;
    isDefault: boolean;
    isSelected: boolean;
    onSelect: () => void;
    onEdit: () => void;
}

const AddressItem: React.FC<AddressItemProps> = ({
    receiverName,
    receiverPhone,
    province,
    district,
    ward,
    address,
    isDefault,
    isSelected,
    onSelect,
    onEdit
}) => {
    const fullAddress = `${address}, ${ward}, ${district}, ${province}`;

    return (
        <TouchableOpacity
            style={styles.addressItem}
            onPress={onSelect}
            activeOpacity={0.7}
        >
            <View style={styles.addressItemContent}>
                {/* Radio Button */}
                <View style={styles.radioContainer}>
                    <View style={[
                        styles.radioButton,
                        isSelected && styles.radioButtonSelected
                    ]}>
                        {isSelected && <View style={styles.radioButtonInner} />}
                    </View>
                </View>

                {/* Address Info */}
                <View style={styles.addressInfo}>
                    <View style={styles.headerRow}>
                        <Text style={styles.receiverName}>{receiverName}</Text>
                        <Text style={styles.receiverPhone}>({receiverPhone})</Text>
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={onEdit}
                        >
                            <Text style={styles.editButtonText}>Sửa</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.addressText}>{fullAddress}</Text>

                    {isDefault && (
                        <View style={styles.defaultBadge}>
                            <Text style={styles.defaultBadgeText}>Mặc định</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const ListAddressScreen = () => {
    const navigation = useNavigation<CartStackNavigationProp>();
    const route = useRoute<ListAddressScreenRouteProp>();
    const fromCheckout = route.params?.fromCheckout || false;

    const { data: userAddresses, error, isLoading } = useUserAddressQuery();

    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

    // Initialize selectedAddressId when data loads
    React.useEffect(() => {
        if (userAddresses && userAddresses.length > 0 && !selectedAddressId) {
            // Get initial selected address: prioritize selected from checkout, then default, then first
            const fromStore = getSelectedAddressForCheckout();
            if (fromStore) {
                setSelectedAddressId(fromStore);
            } else {
                const defaultAddr = userAddresses.find(addr => addr.isDefault);
                const initialId = defaultAddr?.id || userAddresses[0]?.id || null;
                setSelectedAddressId(initialId);
            }
        }
    }, [userAddresses, selectedAddressId]);

    console.log("User Addresses:", userAddresses);

    const handleGoBack = () => {
        navigation.goBack();
    }

    const handleAddAddress = () => {
        navigation.navigate('AddAddressScreen');
    }

    const handleEditAddress = (addressId: string) => {
        navigation.navigate('EditAddressScreen', { id: addressId });
    }

    const handleSelectAddress = (addressId: string) => {
        setSelectedAddressId(addressId);

        // If coming from checkout, save to store and go back
        if (fromCheckout) {
            setSelectedAddressForCheckout(addressId);
            navigation.goBack();
        }
    }

    if (isLoading) {
        return (
            <View style={styles.container}>
                <PrimaryHeader
                    title="Chọn địa chỉ nhận hàng"
                    onBackPress={handleGoBack}
                />
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <PrimaryHeader
                    title="Chọn địa chỉ nhận hàng"
                    onBackPress={handleGoBack}
                />
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>Không thể tải địa chỉ</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <PrimaryHeader
                title="Chọn địa chỉ nhận hàng"
                onBackPress={handleGoBack}
            />

            <ScrollView
                contentContainerStyle={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.contentContainer}>
                    {/* Address List */}
                    {userAddresses && userAddresses.length > 0 ? (
                        userAddresses.map((address) => (
                            <AddressItem
                                key={address.id}
                                id={address.id}
                                receiverName={address.receiverName}
                                receiverPhone={address.receiverPhone}
                                province={address.province}
                                district={address.district}
                                ward={address.ward}
                                address={address.address}
                                isDefault={address.isDefault}
                                isSelected={selectedAddressId === address.id}
                                onSelect={() => handleSelectAddress(address.id)}
                                onEdit={() => handleEditAddress(address.id)}
                            />
                        ))
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Chưa có địa chỉ nào</Text>
                        </View>
                    )}
                </View>
            </ScrollView>


            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleAddAddress}
                    activeOpacity={0.7}
                >
                    <Text style={styles.addButtonIcon}>⊕</Text>
                    <Text style={styles.addButtonText}>Thêm Địa Chỉ Mới</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default ListAddressScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollView: {
        flexGrow: 1,
        paddingBottom: 80,
    },
    contentContainer: {
        marginHorizontal: ifTablet(32, 16),
        paddingTop: ifTablet(16, 12),
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: ifTablet(16, 14),
        color: Colors.error || '#E53935',
    },
    addressItem: {
        marginBottom: ifTablet(20, 16),
        paddingBottom: ifTablet(20, 16),
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    addressItemContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    radioContainer: {
        paddingTop: 2,
        marginRight: ifTablet(12, 10),
    },
    radioButton: {
        width: ifTablet(20, 18),
        height: ifTablet(20, 18),
        borderRadius: ifTablet(10, 9),
        borderWidth: 2,
        borderColor: '#DDD',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    radioButtonSelected: {
        borderColor: Colors.primary || '#E53935',
    },
    radioButtonInner: {
        width: ifTablet(10, 9),
        height: ifTablet(10, 9),
        borderRadius: ifTablet(5, 4.5),
        backgroundColor: Colors.primary || '#E53935',
    },
    addressInfo: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: ifTablet(8, 6),
    },
    receiverName: {
        fontSize: ifTablet(16, 14),
        fontWeight: '600',
        color: '#000',
        marginRight: ifTablet(8, 6),
    },
    receiverPhone: {
        fontSize: ifTablet(14, 12),
        color: '#666',
        flex: 1,
    },
    editButton: {
        paddingHorizontal: ifTablet(12, 8),
        paddingVertical: ifTablet(4, 2),
    },
    editButtonText: {
        fontSize: ifTablet(14, 13),
        color: '#666',
    },
    addressText: {
        fontSize: ifTablet(14, 13),
        color: '#666',
        lineHeight: ifTablet(20, 18),
        marginBottom: ifTablet(8, 6),
    },
    defaultBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: ifTablet(10, 8),
        paddingVertical: ifTablet(4, 3),
        borderWidth: 1,
        borderColor: Colors.primary || '#E53935',
        borderRadius: 4,
        marginTop: ifTablet(4, 2),
    },
    defaultBadgeText: {
        fontSize: ifTablet(12, 11),
        color: Colors.primary || '#E53935',
    },
    emptyContainer: {
        paddingVertical: ifTablet(40, 30),
        alignItems: 'center',
    },
    emptyText: {
        fontSize: ifTablet(16, 14),
        color: '#999',
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
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: ifTablet(14, 12),
    },
    addButtonIcon: {
        fontSize: ifTablet(22, 20),
        color: Colors.primary || '#E53935',
        marginRight: ifTablet(8, 6),
    },
    addButtonText: {
        fontSize: ifTablet(16, 14),
        color: Colors.primary || '#E53935',
        fontWeight: '500',
    },
})