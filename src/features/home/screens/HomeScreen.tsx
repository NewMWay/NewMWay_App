import { Image, ScrollView, StyleSheet, Text, View, Animated, TouchableOpacity, RefreshControl, ActivityIndicator, InteractionManager } from 'react-native'
import React, { useRef, useState, useCallback, useEffect } from 'react'
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Colors } from '../../../assets/styles/colorStyles';
import BannerCarousel from '../components/BannerCarousel';
import { ifTablet } from '../../../utils/responsives/responsive';
import CategoryList from '../components/CategoryList';
import ProductList from '../components/ProductList';
import { HomeStackNavigationProp } from '../../../types/navigation/navigation';
import { useBannerQuery, useProductQuery } from '../../shop/hooks/useProductQuery.hook';
import { useCategoryQuery } from '../../shop/hooks/useCategory.hook';
import useFilterStore from '../../../services/stores/filterStore.zustand';
import { ProductType } from '../../shop/types/product.type';

// Constants outside component
const LIST_BANNER = [
  require('../../../assets/images/banner1.png'),
  require('../../../assets/images/banner1.png'),
  require('../../../assets/images/banner1.png'),
];

const HomeScreen = () => {
  const navigation = useNavigation<HomeStackNavigationProp>();
  const isFocused = useIsFocused();
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
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

  // Use Zustand store for all filter state
  const filterStore = useFilterStore();
  const { activeCategory, setActiveCategory, suppliers, priceRange, ratings } = filterStore;

  const currentScrollY = useRef(0);

  const iconSearch = require('../../../assets/icons/icons8-search-48.png');
  const iconSearch2 = require('../../../assets/icons/icons8-search-2-48.png');
  const filterIcon = require('../../../assets/icons/filter.png');


  const logo = require('../../../assets/images/logo/LOGO-NEW-WAY-TEAK-WOOD-02-1.png')

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

  const {
    data: bannerData,
  } = useBannerQuery({}, { enabled: isFocused && isReady })

  // Transform API data to Product format
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

  // Transform category data for CategoryList
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

  // Transform banner data with fallback to hardcoded banners
  const banners = React.useMemo(() => {
    if (!bannerData?.pages || bannerData.pages.length === 0) {
      return LIST_BANNER;
    }

    const apiBanners = bannerData.pages.flatMap(page =>
      page.items.map(banner => ({ uri: banner.url }))
    );

    return apiBanners.length > 0 ? apiBanners : LIST_BANNER;
  }, [bannerData]);

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

  const BANNER_HEIGHT = ifTablet(400, 170);
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
        currentScrollY.current = scrollYValue; // Lưu vị trí scroll

        // Add hysteresis for smoother state changes
        if (scrollYValue > SCROLL_THRESHOLD + 10) {
          setIsHeaderCollapsed(true);
        } else if (scrollYValue < SCROLL_THRESHOLD - 10) {
          setIsHeaderCollapsed(false);
        }
      },
    }
  );

  // Animated values for header transformation
  const headerBackgroundColor = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD],
    outputRange: ['#313131', '#FFFFFF'],
    extrapolate: 'clamp',
  });

  const headerHeight = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD],
    outputRange: [HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT],
    extrapolate: 'clamp',
  });

  const bannerOpacity = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD * 0.3, SCROLL_THRESHOLD * 0.7, SCROLL_THRESHOLD],
    outputRange: [1, 0.8, 0.3, 0],
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

    // Navigate to ShoppingStack -> ProductDetailsScreen
    const parentNavigation = navigation.getParent();
    if (parentNavigation) {
      parentNavigation.navigate('MainTabs', {
        screen: 'Mua Sắm',
        params: {
          screen: 'ProductDetailsScreen',
          params: { productId: product.id }
        }
      });
    }
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
      {/* Sticky Header for Collapsed State */}
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
            {/* <Text style={styles.stickyTitle}>NEWMWAY TEAKWOOD</Text> */}
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

      {/* Sticky Category List - chỉ hiển thị khi header collapsed */}
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

      {/* Main Header */}
      {!isHeaderCollapsed && (
        <Animated.View style={[
          styles.animatedHeader,
          {
            backgroundColor: headerBackgroundColor,
            minHeight: headerHeight,
          }
        ]}>
          {/* Expanded Header Content */}
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
            <Text style={styles.brand}>NEWMWAY TEAKWOOD</Text>
            <Text style={styles.subtitle}>Chuyên cung cấp sản phẩm đồ dùng nhà bếp cao cấp</Text>
          </Animated.View>

          {/* Search Bar */}
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

          {/* Banner - only visible when expanded */}
          <Animated.View style={[
            styles.bannerWrapper,
            styles.bannerStyle,
            {
              height: BANNER_HEIGHT,
              opacity: bannerOpacity,
              transform: [{
                scale: scrollY.interpolate({
                  inputRange: [0, SCROLL_THRESHOLD],
                  outputRange: [1, 0.95],
                  extrapolate: 'clamp',
                })
              }, {
                translateY: scrollY.interpolate({
                  inputRange: [0, SCROLL_THRESHOLD],
                  outputRange: [0, -10],
                  extrapolate: 'clamp',
                })
              }]
            }
          ]}>
            <BannerCarousel images={banners} height={BANNER_HEIGHT} />
          </Animated.View>
        </Animated.View>
      )}

      {/* Scrollable Content */}
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
          {/* CategoryList chỉ hiển thị khi header chưa collapsed */}
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

export default HomeScreen

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
    marginTop: ifTablet(60, 20),
  },

  headerContainer: {
    backgroundColor: '#313131',
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
    paddingTop: ifTablet(35, 70),
  },
  stickyContent: {
    // flexDirection: 'row',
    alignItems: 'center',
    // flex: 1,
  },
  stickyLogo: {
    width: ifTablet(65, 45),
    height: ifTablet(65, 45),
    marginRight: ifTablet(12, 10),
  },
  stickyTitle: {
    fontSize: ifTablet(16, 14),
    fontFamily: 'Sora-SemiBold',
    color: '#313131',
    flex: 1,
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
  brand: {
    fontSize: ifTablet(28, 24),
    fontFamily: 'Sora-SemiBold',
    fontWeight: '600',
    color: '#D8D8D8',
    textAlign: 'center',
    marginTop: ifTablet(80, 60),
  },
  subtitle: {
    fontSize: ifTablet(16, 14),
    fontFamily: 'Sora-SemiBold',
    color: '#D8D8D8',
    marginTop: ifTablet(16, 10),
    textAlign: 'center',
    paddingHorizontal: ifTablet(30, 10),
  },
  actionHeader: {
    flexDirection: 'row',
    // marginTop: ifTablet(30, 55),
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    top: '10%',
    paddingHorizontal: ifTablet(50, 25),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
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
  iconFilter: {
    // Sizes handled inline with responsive values
  },
  placeholderSearch: {
    color: '#A2A2A2',
    fontFamily: 'Sora-Regular',
    fontSize: ifTablet(16, 14),
  },
  valueSearch: {
    color: Colors.textWhite,
    fontFamily: 'Sora-Regular',
    fontSize: ifTablet(16, 14),
  },
  bannerWrapper: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: ifTablet(0, 0),
    bottom: ifTablet(-80, -60),
  },
  expandedActionHeader: {
    // marginTop: ifTablet(15, 10),
    width: ifTablet('90%', '90%'),
  },
  expandedSearchContainer: {
    backgroundColor: '#2A2A2A',
    width: ifTablet('85%', '80%'),
    paddingHorizontal: ifTablet(20, 16),
    paddingVertical: ifTablet(18, 16),
  },
  expandedSearchIcon: {
    tintColor: '#A2A2A2',
    width: ifTablet(24, 20),
    height: ifTablet(24, 20),
  },
  expandedSearchText: {
    color: '#A2A2A2',
    fontSize: ifTablet(16, 14),
  },
  expandedFilterContainer: {
    padding: ifTablet(18, 16),
  },
  expandedFilterIcon: {
    width: ifTablet(24, 20),
    height: ifTablet(24, 20),
  },
  bannerStyle: {
    marginTop: ifTablet(15, 10),
  },
  contentCollapsed: {
    marginTop: ifTablet(400, 170), // Tăng để tránh sticky category
    paddingHorizontal: ifTablet(32, 16),
  },
  contentExpanded: {
    marginTop: ifTablet(80, 40),
    paddingHorizontal: ifTablet(32, 16),
  },
  stickyCategoryContainer: {
    position: 'absolute',
    top: ifTablet(100, 120), // Vị trí dưới sticky header
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