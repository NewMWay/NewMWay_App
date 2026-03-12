import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View, Text, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { Colors } from '../../../assets/styles/colorStyles'
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader'
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { ifTablet } from '../../../utils/responsives/responsive';
import ButtonAction from '../../auth/components/Button/ButtonAction';
import FilterSection, { FilterOption } from '../components/Filter/FilterSection';
import PriceRangeSection from '../components/Filter/PriceRangeSection';
import useFilterStore from '../../../services/stores/filterStore.zustand';
import { useCategoryQuery } from '../../shop/hooks/useCategory.hook';
import { useSupplierQuery } from '../../shop/hooks/useSupplierQuery.hook';

export default function FilterScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const isFocused = useIsFocused();
    const isMountedRef = useRef(true);
    const filterStore = useFilterStore();
    const { setActiveCategory } = filterStore;

    // Cleanup on unmount
    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const {
        data: categoryDataResponse,
        isLoading: isCategoryLoading,
        isError: isCategoryError,
    } = useCategoryQuery({});

    const {
        data: supplierDataResponse,
        isLoading: isSupplierLoading,
        isError: isSupplierError,
    } = useSupplierQuery({});

    // Get the previous tab from route params
    const previousTab = (route.params as any)?.previousTab;

    const navigateBackToPreviousTab = () => {
        if (previousTab) {
            // Navigate back to the specific tab
            navigation.getParent()?.navigate('MainTabs', {
                screen: previousTab
            });
        } else {
            // Fallback to regular goBack
            navigation.goBack();
        }
    };

    // Transform API data to FilterOption format
    const supplierData: FilterOption[] = isSupplierError ? [] :
        supplierDataResponse?.pages.flatMap(page =>
            page.items
                .filter(supplier => supplier.isActive)
                .map(supplier => ({
                    id: supplier.id,
                    name: supplier.name,
                }))
        ) || [];

    const categoryData: FilterOption[] = isCategoryError ? [] :
        categoryDataResponse?.pages.flatMap(page =>
            page.items
                .filter(category => category.isActive)
                .map(category => ({
                    id: category.id,
                    name: category.name,
                    quantityProduct: category.quantityProduct
                }))
        ) || [];


    const ratingData: FilterOption[] = [
        { id: '5', name: '5 sao', quantityProduct: 12 },
        { id: '4', name: '4 sao trở lên', quantityProduct: 38 },
        { id: '3', name: '3 sao trở lên', quantityProduct: 67 },
        { id: '2', name: '2 sao trở lên', quantityProduct: 89 },
    ];

    const handleBackPress = () => {
        if (!isMountedRef.current || !isFocused) return;
        const hasChanges = filterStore.getSelectedFiltersCount() > 0;

        if (hasChanges) {
            Alert.alert(
                "Chưa áp dụng thay đổi",
                "Bạn có chắc muốn thoát mà không lưu không?",
                [
                    { text: "Hủy", style: "cancel" },
                    { text: "Thoát", onPress: () => navigateBackToPreviousTab() }
                ]
            );
        } else {
            navigateBackToPreviousTab();
        }
    }

    const handleDeletePress = () => {
        if (!isMountedRef.current || !isFocused) return;
        filterStore.clearAllFilters();
        setActiveCategory('all'); // Reset active category to "Tất cả"
    }

    const handleApplyPress = () => {
        if (!isMountedRef.current || !isFocused) return;
        // Apply filters and go back to previous tab
        navigateBackToPreviousTab();
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 30 : 0}
        >
            <PrimaryHeader
                title="Bộ Lọc"
                onBackPress={handleBackPress}
                deleteButton={true}
                onDeleteButtonPress={handleDeletePress}
            />
            <ScrollView style={styles.scrollContent}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.mainContent}>
                    {/* Filter Summary */}
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summaryText}>
                            {filterStore.getFilterSummary()}
                        </Text>
                    </View>

                    {/* Nhà cung cấp */}
                    {isSupplierError ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>
                                Không thể tải nhà cung cấp. Vui lòng thử lại sau.
                            </Text>
                        </View>
                    ) : (
                        <FilterSection
                            title="Nhà Cung Cấp"
                            data={supplierData}
                            selectedItems={filterStore.suppliers}
                            onSelectionChange={filterStore.setSuppliers}
                            showQuantity={false}
                        />
                    )}

                    {/* Giá cả */}
                    <PriceRangeSection
                        title="Giá Cả"
                        priceRange={filterStore.priceRange}
                        onPriceRangeChange={filterStore.setPriceRange}
                        maxPrice={10000000}
                    />

                    {/* Loại */}
                    {isCategoryError ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>
                                Không thể tải danh mục. Vui lòng thử lại sau.
                            </Text>
                        </View>
                    ) : (
                        <FilterSection
                            title="Loại"
                            data={categoryData}
                            selectedItems={filterStore.categories}
                            onSelectionChange={(selectedCategories) => {
                                // Update multi-select categories in filterStore.zustand
                                filterStore.setCategories(selectedCategories);

                                // Sync activeCategory for HomeScreen CategoryList
                                if (selectedCategories.length > 0) {
                                    // Set to first selected category
                                    setActiveCategory(selectedCategories[0]);
                                } else {
                                    // Reset to "all" when no category selected
                                    setActiveCategory('all');
                                }
                            }}
                            showQuantity={true}
                        />
                    )}

                    {/* Đánh giá */}
                    <FilterSection
                        title="Đánh Giá"
                        data={ratingData}
                        selectedItems={filterStore.ratings.map(String)}
                        onSelectionChange={(selected) =>
                            filterStore.setRatings(selected.map(Number))
                        }
                        multiSelect={false}
                        showQuantity={true}
                    />
                </View>

                <View style={styles.applyButtonContainer}>
                    <ButtonAction
                        title="Áp dụng"
                        onPress={handleApplyPress}
                        backgroundColor={Colors.primary}
                        color={Colors.textWhite}
                    />
                </View>

            </ScrollView>
            {(isCategoryLoading || isSupplierLoading) && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            )}
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.textWhite,
        marginTop: 60,
    },
    scrollContent: {
        flexGrow: 1,
    },
    mainContent: {
        flex: 1,
        padding: 16,
        marginTop: ifTablet(20, 30),
    },
    applyButtonContainer: {
        padding: 16,
        alignItems: 'center',
        marginBottom: ifTablet(20, 30),
    },
    summaryContainer: {
        backgroundColor: '#F8F9FA',
        padding: ifTablet(16, 12),
        borderRadius: ifTablet(12, 8),
        marginBottom: ifTablet(20, 16),
        borderLeftWidth: 4,
        borderLeftColor: Colors.primary,
    },
    summaryText: {
        fontSize: ifTablet(14, 12),
        fontFamily: 'Sora-Regular',
        color: '#666666',
        lineHeight: ifTablet(20, 18),
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        zIndex: 1000,
    },
    errorContainer: {
        backgroundColor: '#FFF2F2',
        padding: ifTablet(16, 12),
        borderRadius: ifTablet(12, 8),
        marginBottom: ifTablet(20, 16),
        borderLeftWidth: 4,
        borderLeftColor: '#FF4444',
    },
    errorText: {
        fontSize: ifTablet(14, 12),
        fontFamily: 'Sora-Regular',
        color: '#CC0000',
        textAlign: 'center',
    },
})