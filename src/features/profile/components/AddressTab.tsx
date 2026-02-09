import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Colors } from '../../../assets/styles/colorStyles'
import { ifTablet } from '../../../utils/responsives/responsive'
import { GetUserAddressResponse } from '../../address/types/address.types'
import { useNavigation } from '@react-navigation/native'
import { ProfileStackNavigationProp } from '../../../types/navigation/navigation'

interface AddressTabProps {
    addresses: GetUserAddressResponse[] | undefined
    isLoading: boolean
}

const AddressTab = ({ addresses, isLoading }: AddressTabProps) => {
    const navigation = useNavigation<ProfileStackNavigationProp>()

    const handleEditAddress = (id: string) => {
        const parentNavigation = navigation.getParent();
        if (parentNavigation) {
            parentNavigation.navigate('MainTabs', {
                screen: 'Giỏ Hàng',
                params: {
                    screen: 'EditAddressScreen', params: { id }
                }
            });
        }
    }

    const handleAddAddress = () => {
        const parentNavigation = navigation.getParent();
        if (parentNavigation) {
            parentNavigation.navigate('MainTabs', {
                screen: 'Giỏ Hàng',
                params: {
                    screen: 'AddAddressScreen'
                }
            });
        }
    }

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        )
    }

    if (!addresses || addresses.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.emptyText}>Bạn chưa lưu địa chỉ nào.</Text>
            </View>
        )
    }

    const getFullAddress = (item: GetUserAddressResponse) => {
        return [item.address, item.ward, item.district, item.province]
            .filter(Boolean)
            .join(', ')
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Địa Chỉ Của Tôi</Text>

            {(!addresses || addresses.length === 0) ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Bạn chưa lưu địa chỉ nào.</Text>
                </View>
            ) : (
                addresses.map((address) => (
                    <View key={address.id} style={styles.addressCard}>
                        <View style={styles.addressHeader}>
                            <View style={styles.nameContainer}>
                                <Text style={styles.fullName}>{address.receiverName}</Text>
                                {address.isDefault && (
                                    <View style={styles.defaultBadge}>
                                        <Text style={styles.defaultText}>Mặc định</Text>
                                    </View>
                                )}
                            </View>

                            {/* Nút Sửa Địa Chỉ */}
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={() => handleEditAddress(address.id)}
                                activeOpacity={0.6}
                            >
                                <Text style={styles.editText}>Sửa</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.phone}>{address.receiverPhone}</Text>
                        <Text style={styles.address}>{getFullAddress(address)}</Text>
                    </View>
                ))
            )}

            {/* Nút Thêm Địa Chỉ Mới */}
            <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddAddress}
                activeOpacity={0.8}
            >
                <Text style={styles.addButtonText}>+ Thêm địa chỉ mới</Text>
            </TouchableOpacity>
        </View>
    )
}

export default AddressTab

const styles = StyleSheet.create({
    container: {
        padding: ifTablet(24, 16),
        paddingBottom: 40,
    },
    centerContainer: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    emptyText: {
        fontFamily: 'Sora-Regular',
        color: Colors.textGray,
        fontSize: ifTablet(16, 14),
    },
    title: {
        fontSize: ifTablet(20, 18),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
        marginBottom: ifTablet(20, 16),
    },
    addressCard: {
        backgroundColor: Colors.textWhite,
        borderRadius: ifTablet(12, 10),
        padding: ifTablet(16, 14),
        marginBottom: ifTablet(16, 12),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 3,
        borderWidth: 1,
        borderColor: Colors.gray + '10',
    },
    addressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: ifTablet(8, 6),
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        flexWrap: 'wrap',
        gap: 8,
    },
    fullName: {
        fontSize: ifTablet(16, 14),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
        textTransform: 'capitalize'
    },
    defaultBadge: {
        backgroundColor: Colors.primary + '20',
        paddingHorizontal: ifTablet(8, 6),
        paddingVertical: ifTablet(2, 2),
        borderRadius: ifTablet(4, 4),
    },
    defaultText: {
        fontSize: ifTablet(11, 10),
        fontFamily: 'Sora-Medium',
        color: Colors.primary,
    },
    editButton: {
        paddingLeft: 12,
        paddingBottom: 4,
    },
    editText: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-Medium',
        color: Colors.primary,
        textDecorationLine: 'underline',
    },
    phone: {
        fontSize: ifTablet(14, 12),
        fontFamily: 'Sora-Regular',
        color: Colors.textGray,
        marginBottom: ifTablet(8, 6),
    },
    address: {
        fontSize: ifTablet(14, 12),
        fontFamily: 'Sora-Regular',
        color: Colors.textDark,
        lineHeight: ifTablet(20, 18),
    },
    addButton: {
        marginTop: 8,
        backgroundColor: Colors.textWhite,
        borderWidth: 1,
        borderColor: Colors.primary,
        borderStyle: 'dashed',
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addButtonText: {
        fontSize: ifTablet(16, 14),
        fontFamily: 'Sora-SemiBold',
        color: Colors.primary,
    }
})