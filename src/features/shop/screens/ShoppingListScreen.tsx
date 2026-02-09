import { ActivityIndicator, Animated, Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View, InteractionManager } from 'react-native'
import React, { useCallback, useRef, useState, useEffect } from 'react'
import { useNavigation, useIsFocused } from '@react-navigation/native'
import { Colors } from '../../../assets/styles/colorStyles';
import { ifTablet } from '../../../utils/responsives/responsive';
import CategoryList from '../../home/components/CategoryList';
import ProductList from '../../home/components/ProductList';
import { ShoppingStackNavigationProp } from '../../../types/navigation/navigation';
import { useProductQuery } from '../hooks/useProductQuery.hook';
import { useCategoryQuery } from '../hooks/useCategory.hook';
import useFilterStore from '../../../services/stores/filterStore.zustand';
import { ProductType } from '../types/product.type';

const ShoppingListScreen = () => {
  const navigation = useNavigation<ShoppingStackNavigationProp>();
  const isFocused = useIsFocused();
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const currentScrollY = useRef(0);
  const isMountedRef = useRef(true);
  const [isReady, setIsReady] = useState(false);

  // Defer heavy operations until after tab transition
  useEffect(() => {
    if (isFocused) {
      const handle = InteractionManager.runAfterInteractions(() => {
        setIsReady(true);
      });
      return () => {
        handle.cancel();
        setIsReady(false);
      };
    } else {
      setIsReady(false);
    }
  }, [isFocused]);

  const filterStore = useFilterStore();
  const { activeCategory, setActiveCategory, suppliers, priceRange, ratings } = filterStore;

  const iconSearch = require('../../../assets/icons/icons8-search-48.png');
  const iconSearch2 = require('../../../assets/icons/icons8-search-2-48.png');
  const filterIcon = require('../../../assets/icons/filter.png');
  const logo = require('../../../assets/images/logo/LOGO-NEW-WAY-TEAK-WOOD-02-1.png')
  const logoBrand = require('../../../assets/images/logo/LOGO-NEW-WAY-TEAK-WOOD-02.png')

  // Prepare filter parameters for API
  const filterParams = React.useMemo(() => ({
    categoryId: activeCategory !== 'all' ? activeCategory : undefined,
    supplierId: suppliers.length === 1 ? suppliers[0] : undefined,
    minPrice: priceRange.min > 0 ? priceRange.min : undefined,
    maxPrice: priceRange.max < 10000000 ? priceRange.max : undefined,
    rating: ratings.length > 0 ? Math.max(...ratings) : undefined,
  }), [activeCategory, suppliers, priceRange, ratings]);

  const {
    data: productData,
    isLoading: isProductLoading,
    isError: isProductError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useProductQuery(filterParams, { enabled: isFocused && isReady })

  const {
    data: categoryData,
  } = useCategoryQuery({});

  const products: ProductType[] = React.useMemo(() => {
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
  }, [productData]);

  const categories = React.useMemo(() => {
    const allCategory = { id: 'all', name: 'Tất cả' };

    if (!categoryData?.pages) return [allCategory];

    const apiCategories = categoryData.pages.flatMap(page =>
      page.items
        .filter(cat => cat.isActive)
        .map(cat => ({
          id: cat.id,
          name: cat.name,
        }))
    );

    return [allCategory, ...apiCategories];
  }, [categoryData]);

  const handleFilterPress = () => {
    const parentNavigation = navigation.getParent();
    if (parentNavigation) {
      parentNavigation.navigate('FilterStack', {
        previousTab: 'Trang Chủ'
      });
    }
  }

  const handleSearchPress = () => {
    const parentNavigation = navigation.getParent();
    if (parentNavigation) {
      parentNavigation.navigate('SearchStack', {
        previousTab: 'Trang Chủ'
      });
    }
  }
  const SCROLL_THRESHOLD = ifTablet(80, 60);
  const HEADER_EXPANDED_HEIGHT = ifTablet(280, 240);
  const HEADER_COLLAPSED_HEIGHT = ifTablet(100, 80);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        if (!isMountedRef.current || !isFocused) return;
        const scrollYValue = event.nativeEvent.contentOffset.y;
        currentScrollY.current = scrollYValue;

        if (scrollYValue > SCROLL_THRESHOLD + 10) {
          setIsHeaderCollapsed(true);
        } else if (scrollYValue < SCROLL_THRESHOLD - 10) {
          setIsHeaderCollapsed(false);
        }
      },
    }
  );

  const headerBackgroundColor = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD],
    outputRange: ['#ffffff', '#FFFFFF'],
    extrapolate: 'clamp',
  });

  const headerHeight = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD],
    outputRange: [HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT],
    extrapolate: 'clamp',
  });

  const brandOpacity = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD * 0.4, SCROLL_THRESHOLD * 0.8],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });



  const handleCategoryChange = (categoryId: string) => {
    if (!isMountedRef.current || !isFocused) return;

    const savedScrollY = currentScrollY.current;

    setActiveCategory(categoryId);

    setTimeout(() => {
      if (scrollViewRef.current && savedScrollY > 0 && isMountedRef.current) {
        scrollViewRef.current.scrollTo({
          y: savedScrollY,
          animated: false,
        });
      }
    }, 50);
  };

  const handleProductPress = (product: ProductType) => {
    if (!isMountedRef.current || !isFocused) return;

    // Navigate directly since we're already in ShoppingStack
    navigation.navigate('ProductDetailsScreen', { productId: product.id });
  };

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    if (!isMountedRef.current) return;
    setRefreshing(true);
    await refetch();
    if (isMountedRef.current) {
      setRefreshing(false);
    }
  }, [refetch]);

  // Load more products when reaching end of scroll
  const handleLoadMore = useCallback(() => {
    if (!isMountedRef.current || !isFocused) return;
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, isFocused]);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // Stop all animations khi unmount
      scrollY.stopAnimation();
    };
  }, [scrollY]);

  // Stop animations khi screen blur
  useEffect(() => {
    if (!isFocused) {
      scrollY.stopAnimation();
    }
  }, [isFocused, scrollY]);


  return (
    <View style={styles.container}>
      {isHeaderCollapsed && (
        <Animated.View style={[
          styles.stickyHeader,
          {
            backgroundColor: headerBackgroundColor,
            opacity: scrollY.interpolate({
              inputRange: [SCROLL_THRESHOLD - 20, SCROLL_THRESHOLD + 20],
              outputRange: [0, 1],
              extrapolate: 'clamp',
            })
          }
        ]}>
          <View style={styles.stickyContent}>
            <Image source={logo} style={styles.stickyLogo} />
          </View>
          <TouchableOpacity
            onPress={handleSearchPress}
            style={[
              styles.stickySearchContainer,
              styles.stickySearchStyle
            ]}>
            <Image
              source={iconSearch2}
              style={[
                styles.iconSearch,
                styles.stickySearchIcon
              ]}
            />
            <Text style={[
              styles.placeholderSearch,
              styles.stickySearchText
            ]}>Tìm kiếm ...</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleFilterPress}
            style={[
              styles.filterContainer,
              styles.stickyFilterContainer
            ]}>
            <Image source={filterIcon} style={[
              styles.iconFilter,
              styles.stickyFilterIcon
            ]} />
          </TouchableOpacity>
        </Animated.View>
      )}

      {isHeaderCollapsed && (
        <Animated.View style={[
          styles.stickyCategoryContainer,
          {
            opacity: scrollY.interpolate({
              inputRange: [SCROLL_THRESHOLD - 10, SCROLL_THRESHOLD + 20],
              outputRange: [0, 1],
              extrapolate: 'clamp',
            })
          }
        ]}>
          <CategoryList
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
            categories={categories}
          />
        </Animated.View>
      )}

      {!isHeaderCollapsed && (
        <Animated.View style={[
          styles.animatedHeader,
          {
            backgroundColor: headerBackgroundColor,
            minHeight: headerHeight,
          }
        ]}>
          <Animated.View style={[
            styles.expandedHeader,
            {
              opacity: brandOpacity,
              transform: [{
                translateY: scrollY.interpolate({
                  inputRange: [0, SCROLL_THRESHOLD],
                  outputRange: [0, -20],
                  extrapolate: 'clamp',
                })
              }, {
                scale: scrollY.interpolate({
                  inputRange: [0, SCROLL_THRESHOLD * 0.5],
                  outputRange: [1, 0.98],
                  extrapolate: 'clamp',
                })
              }]
            }
          ]}>
            <Image source={logoBrand} style={styles.headerLogo} />
            <Text style={styles.subtitle}>Tìm kiếm sản phẩm tốt nhất cho bạn</Text>
          </Animated.View>

          <Animated.View style={[
            styles.actionHeader,
            styles.expandedActionHeader,
            {
              opacity: scrollY.interpolate({
                inputRange: [0, SCROLL_THRESHOLD * 0.6, SCROLL_THRESHOLD],
                outputRange: [1, 0.8, 0],
                extrapolate: 'clamp',
              }),
              transform: [{
                translateY: scrollY.interpolate({
                  inputRange: [0, SCROLL_THRESHOLD],
                  outputRange: [0, -15],
                  extrapolate: 'clamp',
                })
              }]
            }
          ]}>
            <TouchableOpacity
              onPress={handleSearchPress}
              style={[
                styles.searchContainer,
                styles.expandedSearchContainer
              ]}>
              <Image
                source={iconSearch}
                style={[
                  styles.iconSearch,
                  styles.expandedSearchIcon
                ]}
              />
              <View>
                <Text style={[
                  styles.placeholderSearch,
                  styles.expandedSearchText
                ]}>Tìm kiếm</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleFilterPress}
              style={[
                styles.filterContainer,
                styles.expandedFilterContainer
              ]}>
              <Image source={filterIcon} style={[
                styles.iconFilter,
                styles.expandedFilterIcon
              ]} />
            </TouchableOpacity>
          </Animated.View>


        </Animated.View>
      )}

      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={8}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={true}
        bouncesZoom={false}
        decelerationRate="normal"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        onScrollEndDrag={(event) => {
          const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
          const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 100;
          if (isCloseToBottom) {
            handleLoadMore();
          }
        }}
      >
        <View style={[
          styles.content,
          isHeaderCollapsed ? styles.contentCollapsed : styles.contentExpanded,
        ]}>
          {!isHeaderCollapsed && (
            <CategoryList
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
              categories={categories}
            />
          )}
          {isProductLoading && !productData ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Đang tải sản phẩm...</Text>
            </View>
          ) : isProductError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Không thể tải sản phẩm</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => refetch()}
              >
                <Text style={styles.retryText}>Thử lại</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <ProductList
                key={activeCategory}
                products={products}
                onProductPress={handleProductPress}
              />
              {isFetchingNextPage && (
                <View style={styles.loadingMoreContainer}>
                  <ActivityIndicator size="small" color={Colors.primary} />
                  <Text style={styles.loadingMoreText}>Đang tải thêm...</Text>
                </View>
              )}
              {!hasNextPage && products.length > 0 && (
                <View style={styles.endListContainer}>
                  <Text style={styles.endListText}>Đã hiển thị tất cả sản phẩm</Text>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>

    </View>
  )
}

export default ShoppingListScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  animatedHeader: {
    width: '100%',
    overflow: 'visible',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  expandedHeader: {
    alignItems: 'center',
  },
  headerLogo: {
    width: ifTablet(160, 120),
    height: ifTablet(160, 120),
    resizeMode: 'contain',
    marginBottom: ifTablet(10, 6),
  },
  headerContainer: {
    // backgroundColor: Colors.textWhite,
    width: '100%',
    height: ifTablet('45%', '10%'),
    overflow: 'visible',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: ifTablet(32, 16),
    paddingTop: ifTablet(48, 32),
  },
  stickyHeader: {
    // position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    // height: ifTablet(90, 0),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ifTablet(32, 16),
    // paddingTop: ifTablet(35, 70),
  },
  stickyContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stickyLogo: {
    width: ifTablet(65, 45),
    height: ifTablet(65, 45),
    marginRight: ifTablet(12, 10),
  },

  stickySearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: ifTablet(16, 12),
    marginHorizontal: ifTablet(12, 8),
    flex: 2,
  },
  stickySearchStyle: {
    backgroundColor: '#F5F5F5',
    width: ifTablet('85%', '80%'),
    paddingHorizontal: ifTablet(20, 16),
    paddingVertical: ifTablet(18, 16),
  },
  stickySearchIcon: {
    tintColor: '#666666',
    width: ifTablet(24, 20),
    height: ifTablet(24, 20),
  },
  stickySearchText: {
    color: '#666666',
    fontSize: ifTablet(16, 14),
  },
  stickyFilterContainer: {
    padding: ifTablet(18, 16),
  },
  stickyFilterIcon: {
    width: ifTablet(24, 20),
    height: ifTablet(24, 20),
  },

  subtitle: {
    fontSize: ifTablet(18, 16),
    fontFamily: 'Sora-SemiBold',
    color: Colors.primary,
    marginVertical: ifTablet(20, 10),
    textAlign: 'center',
    paddingHorizontal: ifTablet(30, 10),
  },
  actionHeader: {
    flexDirection: 'row',
    // marginTop: ifTablet(30, 55),
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    top: '2%',
    paddingHorizontal: ifTablet(30, 25),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: ifTablet(16, 12),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconSearch: {
    marginHorizontal: ifTablet(15, 10),
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: ifTablet(16, 12),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconFilter: {},
  placeholderSearch: {
    color: '#666666',
    fontFamily: 'Sora-Regular',
    fontSize: ifTablet(16, 14),
  },


  expandedActionHeader: {
    width: ifTablet('60%', '90%'),
  },
  expandedSearchContainer: {
    backgroundColor: '#F5F5F5',
    width: ifTablet('85%', '80%'),
    paddingHorizontal: ifTablet(20, 16),
    paddingVertical: ifTablet(18, 16),
  },
  expandedSearchIcon: {
    tintColor: '#666666',
    width: ifTablet(24, 20),
    height: ifTablet(24, 20),
  },
  expandedSearchText: {
    color: '#666666',
    fontSize: ifTablet(16, 14),
  },
  expandedFilterContainer: {
    padding: ifTablet(18, 16),
  },
  expandedFilterIcon: {
    width: ifTablet(24, 20),
    height: ifTablet(24, 20),
  },

  contentCollapsed: {
    marginTop: ifTablet(200, 170),
    paddingHorizontal: ifTablet(32, 16),
  },
  contentExpanded: {
    paddingHorizontal: ifTablet(32, 16),
  },
  stickyCategoryContainer: {
    position: 'absolute',
    top: ifTablet(60, 50),
    left: 0,
    right: 0,
    zIndex: 999,
    backgroundColor: Colors.textWhite,
    paddingHorizontal: ifTablet(32, 16),
    paddingVertical: ifTablet(8, 4),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: ifTablet(120, 100),
  },
  errorText: {
    fontSize: ifTablet(16, 14),
    fontFamily: 'Sora-Regular',
    color: '#CC0000',
    marginBottom: ifTablet(16, 12),
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: ifTablet(32, 24),
    paddingVertical: ifTablet(12, 10),
    borderRadius: ifTablet(12, 8),
  },
  retryText: {
    color: Colors.textWhite,
    fontSize: ifTablet(16, 14),
    fontFamily: 'Sora-SemiBold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: ifTablet(120, 100),
  },
  loadingText: {
    fontSize: ifTablet(16, 14),
    fontFamily: 'Sora-Regular',
    color: Colors.textGray,
    marginTop: ifTablet(16, 12),
  },
  loadingMoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: ifTablet(20, 16),
    gap: ifTablet(12, 8),
  },
  loadingMoreText: {
    fontSize: ifTablet(14, 12),
    fontFamily: 'Sora-Regular',
    color: Colors.textGray,
  },
  endListContainer: {
    paddingVertical: ifTablet(16, 12),
    marginBottom: ifTablet(30, 18),
    alignItems: 'center',
  },
  endListText: {
    fontSize: ifTablet(14, 12),
    fontFamily: 'Sora-Regular',
    color: Colors.textGray,
  },
})