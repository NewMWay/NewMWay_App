import {
    StyleSheet,
    Text,
    View,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { Colors } from '../../../assets/styles/colorStyles'
import { ifTablet } from '../../../utils/responsives/responsive'
import { useNavigation, useRoute } from '@react-navigation/native'
import ProductList from '../components/ProductList'
import useFilterStore from '../../../services/stores/filterStore.zustand'
import { searchHistoryService } from '../../../services/storage/searchHistory'
import { useProductQuery } from '../../shop/hooks/useProductQuery.hook'
import { ProductType } from '../../shop/types/product.type'

const SearchScreen = () => {
    const navigation = useNavigation()
    const route = useRoute()
    const filterStore = useFilterStore()

    const previousTab = (route.params as any)?.previousTab;

    const navigateBackToPreviousTab = () => {
        if (previousTab) {
            navigation.getParent()?.navigate('MainTabs', {
                screen: previousTab
            });
        } else {
            navigation.goBack();
        }
    };

    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [searchHistory, setSearchHistory] = useState<string[]>([])
    const [showHistory, setShowHistory] = useState(false)
    const [isSearchFocused, setIsSearchFocused] = useState(false)

    const iconBack = require('../../../assets/icons/icons8-back-48.png')
    const iconSearch = require('../../../assets/icons/icons8-search-48.png')
    const iconFilter = require('../../../assets/icons/filter.png')
    const iconClear = require('../../../assets/icons/icons8-close-48.png')

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery.trim())
        }, 500)
        return () => clearTimeout(timer)
    }, [searchQuery])

    // Prepare filter parameters for API
    const filterParams = React.useMemo(() => ({
        search: debouncedSearch || undefined,
        supplierId: filterStore.suppliers.length === 1 ? filterStore.suppliers[0] : undefined,
        categoryId: filterStore.categories.length === 1 ? filterStore.categories[0] : undefined,
        minPrice: filterStore.priceRange.min > 0 ? filterStore.priceRange.min : undefined,
        maxPrice: filterStore.priceRange.max < 10000000 ? filterStore.priceRange.max : undefined,
        rating: filterStore.ratings.length > 0 ? Math.max(...filterStore.ratings) : undefined,
    }), [debouncedSearch, filterStore.suppliers, filterStore.categories, filterStore.priceRange, filterStore.ratings])

    const {
        data: productData,
        isLoading: isProductLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
    } = useProductQuery(filterParams)

    const searchResults = React.useMemo<ProductType[]>(() => {
        if (!productData?.pages) return [];

        return productData.pages.flatMap(page =>
            page.items.map(item => ({
                id: item.id,
                name: item.name,
                categoryID: item.categoryID,
                categoryName: item.categoryName,
                price: item.price,
                oldPrice: item.oldPrice,
                thumbnail: item.thumbnail,
                rating: item.rating,
                hot: item.isHot,
                isHot: item.isHot,
                sold: item.sold,
                description: item.description || '',
                warranty: typeof item.warranty === 'number' ? item.warranty : Number(item.warranty) || 0,
                createdDate: item.createdDate || new Date().toISOString(),
                lastModifiedDate: item.lastModifiedDate || new Date().toISOString(),
                categoryDescription: item.categoryDescription || '',
                categoryIcon: item.categoryIcon || '',
                isActive: item.isActive ?? true,
                isHasVariants: item.isHasVariants ?? false,
            }))
        );
    }, [productData])
        }

        if (filterStore.categories.length > 0) {
            filtered = filtered.filter(product =>
                filterStore.categories.includes(product.categoryID)
            )
        }

        if (filterStore.sizes.length > 0) {
            filtered = filtered.filter(product =>
                product.size && filterStore.sizes.includes(product.size)
            )
        }

        if (filterStore.ratings.length > 0) {
            const minRating = Math.max(...filterStore.ratings)
            filtered = filtered.filter(product =>
                product.rating && product.rating >= minRating
            )
        }

        filtered = filtered.filter(product =>
            product.price >= filterStore.priceRange.min &&
            product.price <= filterStore.priceRange.max
        )

        setSearchResults(filtered)
    }, [searchQuery, filterStore.suppliers, filterStore.categories,
        filterStore.sizes, filterStore.ratings, filterStore.priceRange, allProducts])

    const handleBack = () => {
        navigateBackToPreviousTab()
    }

    const handleClearSearch = () => {
        setSearchQuery('')
    }

    const handleSearch = (query: string) => {
        if (query.trim()) {
            searchHistoryService.addToHistory(query);
            const history = searchHistoryService.getHistory();
            setSearchHistory(history.map(item => item.query));
        }
    }

    const handleSearchSubmit = () => {
        if (searchQuery.trim()) {
            handleSearch(searchQuery);
            setShowHistory(false);
        }
    }

    const handleHistoryItemPress = (query: string) => {
        setSearchQuery(query);
        handleSearch(query);
        setShowHistory(false);
    }

    const handleRemoveHistoryItem = (query: string) => {
        searchHistoryService.removeFromHistory(query);
        const history = searchHistoryService.getHistory();
        setSearchHistory(history.map(item => item.query));
    }

    const handleClearAllHistory = () => {
        searchHistoryService.clearHistory();
        setSearchHistory([]);
    }

    const handleClearAllFilters = () => {
        filterStore.clearAllFilters()
    }

    const toggleFilters = () => {
        setShowFilters(!showFilters)
    }

    const activeFiltersCount = filterStore.getSelectedFiltersCount()

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Image source={iconBack} style={styles.backIcon} />
                </TouchableOpacity>

                <View style={styles.searchContainer}>
                    <Image source={iconSearch} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={handleSearchSubmit}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        placeholderTextColor="#999999"
                        returnKeyType="search"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
                            <Image source={iconClear} style={styles.clearIcon} />
                        </TouchableOpacity>
                    )}
                </View>

                <TouchableOpacity onPress={toggleFilters} style={styles.filterButton}>
                    <Image source={iconFilter} style={styles.filterIcon} />
                    {activeFiltersCount > 0 && (
                        <View style={styles.filterBadge}>
                            <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            {/* Filter Summary */}
            {activeFiltersCount > 0 && (
                <View style={styles.filterSummary}>
                    <Text style={styles.filterSummaryText}>
                        {filterStore.getFilterSummary()}
                    </Text>
                    <TouchableOpacity onPress={handleClearAllFilters} style={styles.clearFiltersButton}>
                        <Text style={styles.clearFiltersText}>Xóa bộ lọc</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Results Count */}
            <View style={styles.resultsHeader}>
                <Text style={styles.resultsCount}>
                    {searchResults.length} sản phẩm
                    {searchQuery.trim() && ` cho "${searchQuery}"`}
                </Text>
            </View>

            {/* Search History */}
            {showHistory && searchHistory.length > 0 && (
                <View style={styles.historyContainer}>
                    <View style={styles.historyHeader}>
                        <Text style={styles.historyTitle}>Lịch sử tìm kiếm</Text>
                        <TouchableOpacity onPress={handleClearAllHistory}>
                            <Text style={styles.clearHistoryText}>Xóa tất cả</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={searchHistory}
                        keyExtractor={(item, index) => `${item}-${index}`}
                        renderItem={({ item }) => (
                            <View style={styles.historyItem}>
                                <TouchableOpacity
                                    style={styles.historyItemContent}
                                    onPress={() => handleHistoryItemPress(item)}
                                >
                                    <Image source={iconSearch} style={styles.historyIcon} />
                                    <Text style={styles.historyItemText}>{item}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => handleRemoveHistoryItem(item)}
                                    style={styles.removeHistoryButton}
                                >
                                    <Image source={iconClear} style={styles.removeHistoryIcon} />
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                </View>
            )}

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Filters Section */}
                {showFilters && (
                    <View style={styles.filtersContainer}>
                        <Text style={styles.filtersTitle}>Bộ lọc</Text>

                        <FilterSection
                            title="Nhà Cung Cấp"
                            data={supplierData}
                            selectedItems={filterStore.suppliers}
                            onSelectionChange={filterStore.setSuppliers}
                        />

                        <PriceRangeSection
                            title="Giá Cả"
                            priceRange={filterStore.priceRange}
                            onPriceRangeChange={filterStore.setPriceRange}
                            maxPrice={10000000}
                        />

                        <FilterSection
                            title="Loại"
                            data={categoryData}
                            selectedItems={filterStore.categories}
                            onSelectionChange={filterStore.setCategories}
                        />

                        <FilterSection
                            title="Kích Thước"
                            data={sizeData}
                            selectedItems={filterStore.sizes}
                            onSelectionChange={filterStore.setSizes}
                        />

                        <FilterSection
                            title="Đánh Giá"
                            data={ratingData}
                            selectedItems={filterStore.ratings.map(String)}
                            onSelectionChange={(selected) =>
                                filterStore.setRatings(selected.map(Number))
                            }
                            multiSelect={false}
                        />
                    </View>
                )}

                {/* Search Results - Only show when NOT showing history */}
                {!showHistory && (
                    <View style={styles.resultsContainer}>
                        {searchResults.length > 0 ? (
                            <ProductList
                                products={searchResults}
                                activeCategory="all"
                                onProductPress={(product) => {
                                    console.log('Selected product:', product)
                                    // Navigate to ShoppingStack -> ProductDetailsScreen
                                    navigation.getParent()?.navigate('MainTabs', {
                                        screen: 'Mua Sắm',
                                        params: {
                                            screen: 'ProductDetailsScreen',
                                            params: { productId: product.id }
                                        }
                                    });
                                }}
                            />
                        ) : (
                            <View style={styles.noResultsContainer}>
                                <Text style={styles.noResultsTitle}>Không tìm thấy sản phẩm</Text>
                                <Text style={styles.noResultsText}>
                                    {searchQuery.trim()
                                        ? `Không có sản phẩm nào phù hợp với "${searchQuery}"`
                                        : 'Hãy thử tìm kiếm hoặc điều chỉnh bộ lọc'
                                    }
                                </Text>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>
            <LoadingOverlay visible={isProductLoading || isCategoryLoading} />
        </KeyboardAvoidingView>
    )
}

export default SearchScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.textWhite,
        marginTop: 60,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ifTablet(24, 16),
        paddingVertical: ifTablet(16, 12),
        backgroundColor: Colors.textWhite,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
        gap: ifTablet(16, 12),
    },
    backButton: {
        padding: ifTablet(8, 6),
    },
    backIcon: {
        width: ifTablet(24, 20),
        height: ifTablet(24, 20),
        tintColor: Colors.textDark,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: ifTablet(12, 8),
        paddingHorizontal: ifTablet(16, 12),
        height: ifTablet(48, 40),
    },
    searchIcon: {
        width: ifTablet(20, 16),
        height: ifTablet(20, 16),
        tintColor: '#666666',
        marginRight: ifTablet(12, 8),
    },
    searchInput: {
        flex: 1,
        fontSize: ifTablet(16, 14),
        fontFamily: 'Sora-Regular',
        color: Colors.textDark,
        padding: 0,
    },
    clearButton: {
        padding: ifTablet(4, 2),
    },
    clearIcon: {
        width: ifTablet(16, 14),
        height: ifTablet(16, 14),
        tintColor: '#999999',
    },
    filterButton: {
        position: 'relative',
        padding: ifTablet(8, 6),
        backgroundColor: '#F5F5F5',
        borderRadius: ifTablet(8, 6),
    },
    filterIcon: {
        width: ifTablet(24, 20),
        height: ifTablet(24, 20),
        tintColor: Colors.textDark,
    },
    filterBadge: {
        position: 'absolute',
        top: -ifTablet(4, 2),
        right: -ifTablet(4, 2),
        backgroundColor: Colors.primary,
        borderRadius: ifTablet(10, 8),
        minWidth: ifTablet(20, 16),
        height: ifTablet(20, 16),
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterBadgeText: {
        color: Colors.textWhite,
        fontSize: ifTablet(12, 10),
        fontFamily: 'Sora-SemiBold',
    },
    filterSummary: {
        backgroundColor: '#F8F9FA',
        paddingHorizontal: ifTablet(24, 16),
        paddingVertical: ifTablet(12, 8),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    filterSummaryText: {
        flex: 1,
        fontSize: ifTablet(14, 12),
        fontFamily: 'Sora-Regular',
        color: '#666666',
        marginRight: ifTablet(12, 8),
    },
    clearFiltersButton: {
        paddingHorizontal: ifTablet(12, 8),
        paddingVertical: ifTablet(6, 4),
        backgroundColor: Colors.primary,
        borderRadius: ifTablet(6, 4),
    },
    clearFiltersText: {
        fontSize: ifTablet(12, 10),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textWhite,
    },
    resultsHeader: {
        paddingHorizontal: ifTablet(24, 16),
        paddingVertical: ifTablet(16, 12),
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    resultsCount: {
        fontSize: ifTablet(16, 14),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
    },
    content: {
        flex: 1,
    },
    filtersContainer: {
        backgroundColor: '#F8F9FA',
        padding: ifTablet(20, 16),
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    filtersTitle: {
        fontSize: ifTablet(18, 16),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
        marginBottom: ifTablet(16, 12),
    },
    resultsContainer: {
        flex: 1,
        paddingHorizontal: ifTablet(24, 16),
    },
    noResultsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: ifTablet(80, 60),
        paddingHorizontal: ifTablet(40, 20),
    },
    noResultsTitle: {
        fontSize: ifTablet(20, 18),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
        marginBottom: ifTablet(12, 8),
        textAlign: 'center',
    },
    noResultsText: {
        fontSize: ifTablet(16, 14),
        fontFamily: 'Sora-Regular',
        color: '#666666',
        textAlign: 'center',
        lineHeight: ifTablet(24, 20),
    },
    historyContainer: {
        backgroundColor: Colors.textWhite,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
        maxHeight: 300,
    },
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: ifTablet(24, 16),
        paddingVertical: ifTablet(12, 8),
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    historyTitle: {
        fontSize: ifTablet(16, 14),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
    },
    clearHistoryText: {
        fontSize: ifTablet(14, 12),
        fontFamily: 'Sora-Regular',
        color: Colors.primary,
    },
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: ifTablet(24, 16),
        paddingVertical: ifTablet(12, 10),
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    historyItemContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    historyIcon: {
        width: ifTablet(18, 16),
        height: ifTablet(18, 16),
        tintColor: '#999999',
        marginRight: ifTablet(12, 10),
    },
    historyItemText: {
        fontSize: ifTablet(15, 13),
        fontFamily: 'Sora-Regular',
        color: Colors.textDark,
        flex: 1,
    },
    removeHistoryButton: {
        padding: ifTablet(8, 6),
    },
    removeHistoryIcon: {
        width: ifTablet(16, 14),
        height: ifTablet(16, 14),
        tintColor: '#CCCCCC',
    },
})
