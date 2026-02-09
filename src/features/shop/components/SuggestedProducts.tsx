import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import { ifTablet } from '../../../utils/responsives/responsive'
import { Colors } from '../../../assets/styles/colorStyles'
import ProductCard, { Product } from '../../home/components/ProductCard'
import { useNavigation } from '@react-navigation/native'

interface SuggestedProductsProps {
    products: Product[];
    onProductPress?: (product: Product) => void;
}

const SuggestedProducts = ({ products, onProductPress }: SuggestedProductsProps) => {
    const navigation = useNavigation();
    // Show max 4 products for "you might also like"
    const suggestedProducts = products.slice(0, 4);

    const renderProduct = ({ item }: { item: Product }) => (
        <View style={styles.productWrapper}>
            <ProductCard 
                product={item} 
                onPress={onProductPress} 
            />
        </View>
    );

    const renderViewAllButton = () => (
        <TouchableOpacity 
            style={styles.viewAllCard}
            onPress={() => {
                // Navigate to shop or category screen
                const parentNavigation = navigation.getParent();
                if (parentNavigation) {
                    parentNavigation.navigate('Trang Chủ');
                }
            }}
            activeOpacity={0.8}
        >
            <View style={styles.viewAllContent}>
                <Text style={styles.viewAllTitle}>Xem thêm</Text>
                <Text style={styles.viewAllSubtitle}>sản phẩm khác</Text>
                <View style={styles.viewAllIcon}>
                    <Text style={styles.arrowText}>→</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    if (suggestedProducts.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.titleText}>Có thể bạn cũng thích</Text>
            </View>
            
            <FlatList
                data={suggestedProducts}
                renderItem={renderProduct}
                keyExtractor={(item) => item.id}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={styles.row}
                // ItemSeparatorComponent={ItemSeparator}
                ListFooterComponent={renderViewAllButton}
                ListFooterComponentStyle={styles.footerStyle}
                scrollEnabled={false}
            />
        </View>
    )
}

export default SuggestedProducts

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: ifTablet(12, 8),
        padding: ifTablet(12, 6),
        marginVertical: ifTablet(8, 6),
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    headerContainer: {
        padding: 2,
        paddingBottom: ifTablet(12, 8),
        borderBottomWidth: 0.5,
        borderBottomColor: '#E0E0E0',
        marginBottom: ifTablet(16, 12),
    },
    titleText: {
        fontSize: ifTablet(16, 14),
        fontFamily: 'Sora-SemiBold',
        fontWeight: '600',
        color: Colors.textDark,
    },
    listContent: {
        paddingBottom: ifTablet(8, 6),
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: ifTablet(16, 12),
        // paddingHorizontal: ifTablet(2, 0),
    },
    productWrapper: {
        flex: 0.48,
        maxWidth: '48%',
    },
    viewAllCard: {
        width: '100%',
        height: ifTablet(80, 70),
        backgroundColor: 'rgba(238, 77, 45, 0.05)',
        borderRadius: ifTablet(20, 16),
        borderWidth: 1.5,
        borderColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: ifTablet(12, 8),
        flexDirection: 'row',
        shadowColor: Colors.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    viewAllContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    viewAllTitle: {
        fontSize: ifTablet(16, 14),
        fontFamily: 'Sora-SemiBold',
        fontWeight: '600',
        color: Colors.primary,
        marginRight: ifTablet(8, 6),
    },
    viewAllSubtitle: {
        fontSize: ifTablet(16, 14),
        fontFamily: 'Sora-SemiBold',
        fontWeight: '600',
        color: Colors.primary,
        marginRight: ifTablet(12, 10),
    },
    viewAllIcon: {
        width: ifTablet(40, 32),
        height: ifTablet(40, 32),
        borderRadius: ifTablet(20, 16),
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: ifTablet(8, 6),
    },
    arrowText: {
        fontSize: ifTablet(20, 16),
        color: 'white',
        fontWeight: 'bold',
    },
    footerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
    },
})