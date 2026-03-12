import React, { useState, useEffect } from 'react'
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
} from 'react-native'
import { Colors } from '../../../assets/styles/colorStyles'
import { ifTablet } from '../../../utils/responsives/responsive'
import { useProductQuery } from '../../shop/hooks/useProductQuery.hook'
import { ProductType } from '../../shop/types/product.type'
import { ProductContentMessageResponse } from '../types/ChatAdmin.type'

interface ProductSelectionModalProps {
    visible: boolean
    onClose: () => void
    onSelectProduct: (product: ProductContentMessageResponse) => void
}

const ProductSelectionModal: React.FC<ProductSelectionModalProps> = ({
    visible,
    onClose,
    onSelectProduct,
}) => {
    const [searchText, setSearchText] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchText)
        }, 500)

        return () => clearTimeout(timer)
    }, [searchText])

    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useProductQuery(
        {
            search: debouncedSearch || undefined,
            isActive: true,
        },
        { enabled: visible }
    )

    const products: ProductType[] = React.useMemo(() => {
        if (!data?.pages) return []
        return data.pages.flatMap(page => page.items)
    }, [data])

    const handleSelectProduct = (product: ProductType) => {
        const productMessage: ProductContentMessageResponse = {
            id: product.id,
            name: product.name,
            thumbnail: product.thumbnail,
            price: product.price,
            categoryName: product.categoryName,
            isActive: true,
            isHasVariants: product.isHasVariants,
            rating: product.rating,
        }
        onSelectProduct(productMessage)
        setSearchText('')
        onClose()
    }

    const handleClose = () => {
        setSearchText('')
        onClose()
    }

    const renderProduct = ({ item }: { item: ProductType }) => (
        <TouchableOpacity
            style={styles.productItem}
            onPress={() => handleSelectProduct(item)}
            activeOpacity={0.7}
        >
            <Image
                source={{ uri: item.thumbnail || 'https://placehold.co/100' }}
                style={styles.productImage}
                resizeMode="cover"
            />
            <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>
                    {item.name}
                </Text>
                <Text style={styles.productCategory} numberOfLines={1}>
                    {item.categoryName}
                </Text>
                <Text style={styles.productPrice}>
                    {item.price.toLocaleString('vi-VN')}₫
                </Text>
            </View>
        </TouchableOpacity>
    )

    const renderFooter = () => {
        if (!isFetchingNextPage) return null
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={Colors.primary} />
            </View>
        )
    }

    const renderSeparator = () => <View style={styles.separator} />

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không tìm thấy sản phẩm</Text>
        </View>
    )

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
                        <Text style={styles.modalTitle}>Chọn sản phẩm</Text>
                        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Tìm kiếm sản phẩm..."
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
                            data={products}
                            keyExtractor={(item) => item.id}
                            renderItem={renderProduct}
                            ItemSeparatorComponent={renderSeparator}
                            ListEmptyComponent={renderEmpty}
                            onEndReached={() => {
                                if (hasNextPage && !isFetchingNextPage) {
                                    fetchNextPage()
                                }
                            }}
                            onEndReachedThreshold={0.5}
                            ListFooterComponent={renderFooter}
                            keyboardShouldPersistTaps="handled"
                        />
                    )}
                </View>
            </KeyboardAvoidingView>
        </Modal>
    )
}

export default ProductSelectionModal

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: ifTablet(24, 20),
        borderTopRightRadius: ifTablet(24, 20),
        maxHeight: '85%',
        paddingBottom: ifTablet(20, 16),
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: ifTablet(20, 16),
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    modalTitle: {
        fontSize: ifTablet(20, 18),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
    },
    closeButton: {
        padding: ifTablet(8, 6),
    },
    closeButtonText: {
        fontSize: ifTablet(24, 20),
        color: Colors.gray,
        fontWeight: '300',
    },
    searchContainer: {
        padding: ifTablet(16, 12),
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    searchInput: {
        backgroundColor: '#f5f5f5',
        borderRadius: ifTablet(12, 10),
        padding: ifTablet(12, 10),
        fontSize: ifTablet(15, 14),
        fontFamily: 'Sora-Regular',
        color: Colors.textDark,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: ifTablet(40, 32),
    },
    productItem: {
        flexDirection: 'row',
        padding: ifTablet(16, 12),
        alignItems: 'center',
    },
    productImage: {
        width: ifTablet(70, 60),
        height: ifTablet(70, 60),
        borderRadius: ifTablet(12, 10),
        backgroundColor: '#f9fafb',
    },
    productInfo: {
        flex: 1,
        marginLeft: ifTablet(16, 12),
    },
    productName: {
        fontSize: ifTablet(15, 14),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
        marginBottom: ifTablet(4, 3),
    },
    productCategory: {
        fontSize: ifTablet(13, 12),
        fontFamily: 'Sora-Regular',
        color: Colors.gray,
        marginBottom: ifTablet(4, 3),
    },
    productPrice: {
        fontSize: ifTablet(16, 15),
        fontFamily: 'Sora-Bold',
        color: Colors.primary,
    },
    separator: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginLeft: ifTablet(102, 88),
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: ifTablet(60, 48),
    },
    emptyText: {
        fontSize: ifTablet(15, 14),
        fontFamily: 'Sora-Regular',
        color: Colors.gray,
    },
    footerLoader: {
        paddingVertical: ifTablet(16, 12),
        alignItems: 'center',
    },
})
