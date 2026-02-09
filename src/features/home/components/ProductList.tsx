import { StyleSheet, View, FlatList, Text } from 'react-native'
import React from 'react'
import ProductCard from './ProductCard'
import { ifTablet } from '../../../utils/responsives/responsive'
import { Colors } from '../../../assets/styles/colorStyles'
import { ProductType } from '../../shop/types/product.type'


interface ProductListProps {
  products: ProductType[]
  onProductPress?: (product: ProductType) => void
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  onProductPress,
}) => {
  const renderProduct = ({ item }: { item: ProductType }) => (
    <ProductCard product={item} onPress={onProductPress} />
  )

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Không tìm thấy sản phẩm nào</Text>
      <Text style={styles.emptySubText}>
        Vui lòng thử điều chỉnh bộ lọc hoặc tìm kiếm khác
      </Text>
    </View>
  )

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        ListEmptyComponent={renderEmptyState}
        numColumns={2}
        columnWrapperStyle={products.length > 0 ? styles.row : undefined}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        scrollEnabled={false}
      />
    </View>
  )
}

export default ProductList

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: ifTablet(20, 16),
    minHeight: ifTablet(800, 600), // Đảm bảo container có chiều cao tối thiểu
  },
  listContent: {
    paddingBottom: ifTablet(20, 16),
    flexGrow: 1, // Đảm bảo content có thể mở rộng
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    gap: ifTablet(16, 4),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: ifTablet(80, 60),
    paddingHorizontal: ifTablet(32, 24),
  },
  emptyText: {
    fontSize: ifTablet(18, 16),
    fontFamily: 'Sora-SemiBold',
    color: Colors.textDark,
    marginBottom: ifTablet(8, 6),
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: ifTablet(14, 12),
    fontFamily: 'Sora-Regular',
    color: '#666666',
    textAlign: 'center',
  },
})