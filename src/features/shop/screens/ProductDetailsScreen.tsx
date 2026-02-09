import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef, useEffect } from 'react'
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native'
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader';
import { ShoppingStackNavigationProp } from '../../../types/navigation/navigation';
import { ifTablet } from '../../../utils/responsives/responsive';
import { Colors } from '../../../assets/styles/colorStyles';
import ProductMedia from '../components/ProductMedia';
import CustomMoreInfo from '../components/CustomMoreInfo';
import RatingPreview from '../components/RatingPreview';
import Description from '../components/Description';
import SuggestedProducts from '../components/SuggestedProducts';
import BottomActionBar from '../components/BottomActionBar';
import formatSold from '../../../utils/format/formatSold';
import BottomModal from '../../../components/common/BottomModal';
import { useProductByIdQuery, useProductQuery, useProductReviewQuery } from '../hooks/useProductQuery.hook';
import { ProductType } from '../types/product.type';
import LoadingOverlay from '../../auth/components/Loading/LoadingOverlay';
import { useToast } from '../../../utils/toasts/useToast';
import { useAddCart, useGetCart } from '../../cart/hooks/useCart.hook';
import { AddCartRequest } from '../../cart/types/cart.type';
import { useAuthStore } from '../../../stores/authStore.zustand';
import { useFavoriteQuery } from '../../favorite/hooks/useFavoriteQuery.hook';
import { useAddFavoriteProduct } from '../../favorite/hooks/useFavoriteMutation.hook';
import { MediaType } from '../types/media.enum';


import ConfirmSendProductModal from '../components/ConfirmSendProductModal';
import ImageZoomView from '../../../components/common/ModalView/ImageZoomView';

const ProductDetailsScreen = () => {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const navigation = useNavigation<ShoppingStackNavigationProp>()
    const route = useRoute();
    const isFocused = useIsFocused();
    const isMountedRef = useRef(true);
    const { productId } = route.params as { productId: string };
    const scrollViewRef = useRef<ScrollView>(null);
    const [tutorialModalVisible, setTutorialModalVisible] = React.useState(false);
    const [warrantyModalVisible, setWarrantyModalVisible] = React.useState(false);
    const [confirmSendProductModalVisible, setConfirmSendProductModalVisible] = React.useState(false);
    const [zoomImage, setZoomImage] = React.useState<string | null>(null);
    const [zoomType, setZoomType] = React.useState<'image' | 'video'>('image');
    const [selectedVariantId, setSelectedVariantId] = React.useState<string | null>(null);
    // const [selectedVariantName, setSelectedVariantName] = React.useState<string | null>(null);

    const [selectedOptions, setSelectedOptions] = React.useState<{ [key: string]: string }>({});
    // const inTransitIcon = require('../../../assets/icons/icons8-in-transit-48.png');
    const shiledIcon = require('../../../assets/icons/icons8-shield-48.png');
    const tutorialIcon = require('../../../assets/icons/icons8-books-48.png');
    const soldIcon = require('../../../assets/icons/icons8-sold-48.png');
    const chatIcon = require('../../../assets/icons/icons8-chat-4-48.png');
    // const heartIcon = require('../../../assets/icons/icons8-heart-48.png');
    const { showError } = useToast()

    const { mutate: addToCart, isPending: isAddToCartPending } = useAddCart();
    const { data: favoriteData } = useFavoriteQuery();
    const { mutate: toggleFavorite, isPending: isTogglingFavorite } = useAddFavoriteProduct();
    const { data: cartData } = useGetCart({ enabled: isLoggedIn });
    const cartItemCount = cartData?.cartItems?.length || 0;

    // Cleanup on unmount
    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    // Check if current product is in favorites
    const isFavorited = React.useMemo(() => {
        if (!favoriteData?.pages) return false;
        const allFavorites = favoriteData.pages.flatMap(page => page.items);
        return allFavorites.some(item => item.id === productId);
    }, [favoriteData, productId]);


    const {
        data: productData,
        isLoading: isProductLoading,
        isError: isProductError,
        error: productError,
    } = useProductByIdQuery({
        productID: productId,
    })

    const {
        data: suggestedProductsData,
        isLoading: isSuggestedLoading,
    } = useProductQuery({
        categoryId: productData?.categoryID,
        isActive: true,
    }, { enabled: isFocused && !!productData?.categoryID });

    const {
        data: productReviewsData,
        isLoading: isProductReviewsLoading,
    } = useProductReviewQuery({
        productId: productId,
    });

    if (isProductError) {
        showError(productError.message || 'Đã có lỗi xảy ra khi tải thông tin sản phẩm.');
    }

    const productReviews = React.useMemo(() => {
        if (!productReviewsData?.pages) return [];
        return productReviewsData.pages.flatMap(page => page.items);
    }, [productReviewsData]);

    console.log("productReviews:", productReviews);


    // Transform API data for UI
    const mediaImages = React.useMemo(() => {
        if (!productData?.images) return [];
        return productData.images.map(img => img.url);
    }, [productData]);

    // Transform variants from API
    const variants = React.useMemo(() => {
        if (!productData?.variantsResponses) return [];
        return productData.variantsResponses.map(variant => ({
            id: variant.id,
            name: variant.name,
            images: [variant.imageUrl]
        }));
    }, [productData]);


    const optionValueStock = React.useMemo(() => {
        if (!productData?.variantsResponses || productData.variantsResponses.length === 0) return null;

        // Determine which variant to use
        let targetVariant;
        if (selectedVariantId) {
            // If a variant is selected, use that variant
            targetVariant = productData.variantsResponses.find(v => v.id === selectedVariantId);
        } else {
            // Otherwise use the first variant
            targetVariant = productData.variantsResponses[0];
        }

        if (!targetVariant) return null;

        // Check if variant has optionValueStocks with non-null optionValueId
        if (!targetVariant.optionValueStocks || targetVariant.optionValueStocks.length === 0) {
            return null;
        }

        // Check if first element has null optionValueId
        const firstOption = targetVariant.optionValueStocks[0];
        if (!firstOption.optionValueId) {
            return null;
        }

        // Build the options map with full data including optionValueId for the selected variant only
        const stockMap: { [key: string]: Array<{ value: string; optionValueId: string }> } = {};
        targetVariant.optionValueStocks.forEach(option => {
            if (option.optionValueId) { // Only include options with valid optionValueId
                if (!stockMap[option.optionName]) {
                    stockMap[option.optionName] = [];
                }
                // Avoid duplicates
                const exists = stockMap[option.optionName].some(
                    item => item.value === option.value && item.optionValueId === option.optionValueId
                );
                if (!exists) {
                    stockMap[option.optionName].push({
                        value: option.value,
                        optionValueId: option.optionValueId
                    });
                }
            }
        });

        return Object.keys(stockMap).length > 0 ? stockMap : null;
    }, [productData, selectedVariantId]);

    const productPrice = React.useMemo(() => {
        if (!productData?.variantsResponses || productData.variantsResponses.length === 0) return 0;

        if (selectedVariantId) {
            const selectedVariant = productData.variantsResponses.find(v => v.id === selectedVariantId);
            if (selectedVariant) return selectedVariant.price;
        }

        return productData.variantsResponses[0].price;
    }, [productData, selectedVariantId]);

    const productOldPrice = React.useMemo(() => {
        if (!productData?.variantsResponses || productData.variantsResponses.length === 0) return undefined;

        if (selectedVariantId) {
            const selectedVariant = productData.variantsResponses.find(v => v.id === selectedVariantId);
            if (selectedVariant) {
                const oldPrice = selectedVariant.oldPrice;
                return oldPrice && oldPrice > 0 ? oldPrice : undefined;
            }
        }

        const oldPrice = productData.variantsResponses[0].oldPrice;
        return oldPrice && oldPrice > 0 ? oldPrice : undefined;
    }, [productData, selectedVariantId]);

    const totalSold = React.useMemo(() => {
        if (!productData?.variantsResponses) return 0;

        if (selectedVariantId) {
            const selectedVariant = productData.variantsResponses.find(v => v.id === selectedVariantId);
            return selectedVariant ? selectedVariant.sold : 0;
        }

        return productData.variantsResponses.reduce((sum, variant) => sum + variant.sold, 0);
    }, [productData, selectedVariantId]);

    const suggestedProducts: ProductType[] = React.useMemo(() => {
        if (!suggestedProductsData?.pages) return [];

        return suggestedProductsData.pages
            .flatMap(page => page.items)
            .filter(item => item.id !== productId) // Exclude current product
            .slice(0, 4) // Limit to 4 products
            .map(item => ({
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
            }));
    }, [suggestedProductsData, productId]);

    const defaultPromotion = {
        id: 'promo1',
        title: 'Giảm 10% cho toàn bộ đơn hàng vào ngày Black Friday',
    }

    const productRatings = React.useMemo(() => {
        return productReviews.map(review => {
            // Chuẩn hóa media type từ backend
            const normalizedMedia = review.media && review.media.length > 0
                ? review.media.map(m => ({
                    id: m.id,
                    url: m.url,
                    type: m.type || MediaType.Image
                }))
                : [];

            return {
                ...review,
                media: normalizedMedia
            }
        })
    }, [productReviews]);

    console.log("productRatings:", productRatings);

    const totalReviews = productRatings.length;
    const averageRating = totalReviews > 0
        ? productRatings.reduce((sum, rating) => sum + rating.rating, 0) / totalReviews
        : 0;

    const handleGoBack = () => {
        if (!isMountedRef.current || !isFocused) return;
        // Check if we can go back in the current stack
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            // If no history in current stack, navigate to main shopping screen
            const parentNavigation = navigation.getParent();
            if (parentNavigation) {
                parentNavigation.navigate('MainTabs', {
                    screen: 'Sắm',
                    params: {
                        screen: 'ShoppingListScreen'
                    }
                });
            }
        }
    }

    const handleViewAllRatings = () => {
        if (!isMountedRef.current || !isFocused) return;
        navigation.navigate('AllReviewsScreen', {
            productId: productId,
            productName: productData?.name || 'Sản phẩm'
        });
    }

    const handleSuggestedProductPress = (suggestedProduct: ProductType) => {
        if (!isMountedRef.current || !isFocused) return;
        navigation.push('ProductDetailsScreen', { productId: suggestedProduct.id });
    }

    const handleConsultation = () => {
        if (!isMountedRef.current || !isFocused) return;
        if (!isLoggedIn) {
            showError('Đăng nhập ngay để được tư vấn. ĐĂNG NHẬP NGAY!', 'Bạn chưa đăng nhập!', {
                onPress: () => {
                    const parentNavigation = navigation.getParent();
                    if (parentNavigation) {
                        parentNavigation.navigate('AuthStack', { screen: 'LoginScreen' });
                    }
                }
            });
            return;
        }
        setConfirmSendProductModalVisible(true);
    };

    const handleConfirmSendProduct = () => {
        if (!isMountedRef.current || !isFocused) return;
        setConfirmSendProductModalVisible(false);

        const parentNavigation = navigation.getParent();
        if (parentNavigation) {
            // Navigate to chat tab with product info
            parentNavigation.navigate('Tin Nhắn', {
                screen: 'ChatListScreen',
                params: {
                    productId: productId,
                    productName: productData?.name || '',
                    productImage: productData?.thumbnail || '',
                    productPrice: productPrice,
                    productCategoryName: productData?.categoryName || '',
                },
            });
        }
    };

    const handleAddToCart = () => {
        if (!isMountedRef.current || !isFocused) return;
        if (!isLoggedIn) {
            showError('Đăng nhập ngay để thêm sản phẩm. ĐĂNG NHẬP NGAY!', 'Bạn chưa đăng nhập!', {
                onPress: () => {
                    const parentNavigation = navigation.getParent();
                    if (parentNavigation) {
                        parentNavigation.navigate('AuthStack', { screen: 'LoginScreen' });
                    }
                }
            });
            return;
        }
        if (!selectedVariantId) {
            showError('Vui lòng chọn biến thể sản phẩm trước khi giỏ hàng.');
            return;
        }

        const selectedVariant = productData?.variantsResponses.find(v => v.id === selectedVariantId);
        if (!selectedVariant) {
            showError('Không tìm thấy biến thể sản phẩm đã chọn');
            return;
        }

        if (selectedVariant.optionValueStocks && selectedVariant.optionValueStocks.length > 0) {
            const firstOption = selectedVariant.optionValueStocks[0];
            if (firstOption.optionValueId) {
                const requiredOptions = new Set(selectedVariant.optionValueStocks.map(opt => opt.optionName));
                const selectedOptionNames = Object.keys(selectedOptions);

                const missingOptions = Array.from(requiredOptions).filter(
                    optName => !selectedOptionNames.includes(optName)
                );

                if (missingOptions.length > 0) {
                    Alert.alert("Thông báo", `Vui lòng chọn: ${missingOptions.join(', ')}`);
                    return;
                }
            }
        }

        let matchedOptionValueStock = null;
        let productVariantOptionValueStockId = '';

        if (selectedVariant.optionValueStocks && selectedVariant.optionValueStocks.length > 0) {
            const firstOption = selectedVariant.optionValueStocks[0];

            // Case 1: Variant có options (optionValueId không null)
            if (firstOption.optionValueId) {
                matchedOptionValueStock = selectedVariant.optionValueStocks.find(stock => {
                    return Object.entries(selectedOptions).every(([optionName, optionValue]) => {
                        return stock.optionName === optionName && stock.value === optionValue;
                    });
                });

                if (!matchedOptionValueStock) {
                    Alert.alert("Lỗi", "Không tìm thấy tùy chọn phù hợp");
                    return;
                }
                productVariantOptionValueStockId = matchedOptionValueStock.id;
            }
            // Case 2: Variant không có options (optionValueId null) nhưng có id
            else if (firstOption.id) {
                productVariantOptionValueStockId = firstOption.id;
            }
        }

        const payloadRequest: AddCartRequest = {
            productId: productData!.id,
            productName: productData!.name,
            productVariantId: selectedVariantId,
            productVariantName: selectedVariant.name,
            quantity: 1,
            unitPrice: selectedVariant.price,
            oldPrice: selectedVariant.oldPrice,
            supplierName: productData?.supplierName || '',
            productImageUrl: selectedVariant.imageUrl,
            productVariantOptionValueStockId: productVariantOptionValueStockId,
            optionValueId: matchedOptionValueStock?.optionValueId || null,
            optionValueName: matchedOptionValueStock?.value || null,
            optionId: matchedOptionValueStock?.id || null,
            optionName: matchedOptionValueStock?.optionName || null,
        }

        addToCart(payloadRequest)
    };

    const handleBuyNow = () => {
        if (!isMountedRef.current || !isFocused) return;

        // Check login status
        if (!isLoggedIn) {
            showError('Đăng nhập ngay để mua hàng. ĐĂNG NHẬP NGAY!', 'Bạn chưa đăng nhập!', {
                onPress: () => {
                    const parentNavigation = navigation.getParent();
                    if (parentNavigation) {
                        parentNavigation.navigate('AuthStack', { screen: 'LoginScreen' });
                    }
                }
            });
            return;
        }

        // Validate variant selection
        if (!selectedVariantId) {
            showError('Vui lòng chọn biến thể sản phẩm trước khi mua.');
            return;
        }

        const selectedVariant = productData?.variantsResponses.find(v => v.id === selectedVariantId);
        if (!selectedVariant) {
            showError('Không tìm thấy biến thể sản phẩm đã chọn');
            return;
        }

        // Validate options if required
        if (selectedVariant.optionValueStocks && selectedVariant.optionValueStocks.length > 0) {
            const firstOption = selectedVariant.optionValueStocks[0];
            if (firstOption.optionValueId) {
                const requiredOptions = new Set(selectedVariant.optionValueStocks.map(opt => opt.optionName));
                const selectedOptionNames = Object.keys(selectedOptions);

                const missingOptions = Array.from(requiredOptions).filter(
                    optName => !selectedOptionNames.includes(optName)
                );

                if (missingOptions.length > 0) {
                    Alert.alert("Thông báo", `Vui lòng chọn: ${missingOptions.join(', ')}`);
                    return;
                }
            }
        }

        // Find matched option value stock
        let matchedOptionValueStock = null;
        let productVariantOptionValueStockId = '';

        if (selectedVariant.optionValueStocks && selectedVariant.optionValueStocks.length > 0) {
            const firstOption = selectedVariant.optionValueStocks[0];

            // Case 1: Variant có options (optionValueId không null)
            if (firstOption.optionValueId) {
                matchedOptionValueStock = selectedVariant.optionValueStocks.find(stock => {
                    return Object.entries(selectedOptions).every(([optionName, optionValue]) => {
                        return stock.optionName === optionName && stock.value === optionValue;
                    });
                });

                if (!matchedOptionValueStock) {
                    Alert.alert("Lỗi", "Vui lòng chọn tùy chọn phù hợp");
                    return;
                }
                productVariantOptionValueStockId = matchedOptionValueStock.id;
            }
            // Case 2: Variant không có options (optionValueId null) nhưng có id
            else if (firstOption.id) {
                productVariantOptionValueStockId = firstOption.id;
            }
        }

        // Prepare checkout item
        const checkoutItem = {
            id: productData!.id,
            name: productData!.name,
            price: selectedVariant.price,
            originalPrice: selectedVariant.oldPrice && selectedVariant.oldPrice > 0 ? selectedVariant.oldPrice : undefined,
            image: selectedVariant.imageUrl,
            quantity: 1,
            supplier: productData?.supplierName || '',
            variant: selectedVariant.name,
            totalPrice: selectedVariant.price,
            productVariantId: selectedVariantId,
            productVariantOptionValueStockId: productVariantOptionValueStockId,
            productVariantName: selectedVariant.name,
            optionValueId: matchedOptionValueStock?.optionValueId || null,
            optionValueName: matchedOptionValueStock?.value || null,
            optionId: matchedOptionValueStock?.id || null,
            optionName: matchedOptionValueStock?.optionName || null,
        };

        // Navigate to checkout screen
        const parentNavigation = navigation.getParent();
        if (parentNavigation) {
            parentNavigation.navigate('Giỏ Hàng', {
                screen: 'ConfirmCheckoutScreen',
                params: {
                    selectedItems: [checkoutItem]
                }
            });
        }
    };



    const handleTutorialPress = () => {
        if (!isMountedRef.current || !isFocused) return;
        setTutorialModalVisible(true);
    }

    const handleWarrantyPress = () => {
        if (!isMountedRef.current || !isFocused) return;
        setWarrantyModalVisible(true);
    }

    const handleVariantChange = (variantId: string | null) => {
        if (!isMountedRef.current || !isFocused) return;
        setSelectedVariantId(variantId);
    }

    const handleOptionSelect = (optionName: string, value: string) => {
        if (!isMountedRef.current || !isFocused) return;
        setSelectedOptions(prev => {
            if (value === '') {
                const newOptions = { ...prev };
                delete newOptions[optionName];
                return newOptions;
            }
            return {
                ...prev,
                [optionName]: value
            };
        });
    }

    const handleToggleFavorite = () => {
        if (!isMountedRef.current || !isFocused) return;
        if (!isLoggedIn) {
            Alert.alert(
                'Yêu cầu đăng nhập',
                'Bạn cần đăng nhập để sử dụng tính năng này',
                [
                    { text: 'Hủy', style: 'cancel' },
                    {
                        text: 'Đăng nhập',
                        onPress: () => {
                            const parentNavigation = navigation.getParent();
                            if (parentNavigation) {
                                parentNavigation.navigate('Tài Khoản', { screen: 'LoginScreen' });
                            }
                        }
                    }
                ]
            );
            return;
        }

        if (isFavorited) {
            Alert.alert(
                'Xác nhận',
                `Bạn có chắc muốn bỏ "${productData?.name}" khỏi danh sách yêu thích?`,
                [
                    { text: 'Hủy', style: 'cancel' },
                    {
                        text: 'Xác nhận',
                        style: 'destructive',
                        onPress: () => {
                            toggleFavorite({ productId });
                        },
                    },
                ],
                { cancelable: true }
            );
        } else {
            toggleFavorite({ productId });
        }
    };

    const handleCartPress = () => {
        const parentNavigation = navigation.getParent();
        if (parentNavigation) {
            parentNavigation.navigate('Giỏ Hàng', { screen: 'CartScreen' });
        }
    }


    return (
        <View style={styles.container}>
            <PrimaryHeader
                title='Chi tiết sản phẩm'
                onBackPress={handleGoBack}
                cartButton={true}
                cartItemCount={cartItemCount}
                onCartButtonPress={handleCartPress}
            />
            <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={[styles.scrollView, { paddingBottom: ifTablet(120, 105) }]}
                showsVerticalScrollIndicator={false}
            >
                <ProductMedia
                    _id={productId}
                    images={mediaImages}
                    heightPercent={45}
                    variants={variants}
                    onVariantChange={handleVariantChange}
                    optionValueStock={optionValueStock}
                    selectedOptions={selectedOptions}
                    onOptionSelect={handleOptionSelect}
                    onImagePress={(uri, type) => { setZoomImage(uri); setZoomType(type || 'image'); }}
                />
                <View style={styles.contentContainer}>
                    <Text style={styles.productTitle}>{productData?.name || 'Unknown Product'}</Text>

                    <View style={styles.categoryContainer}>
                        <View style={styles.soldContainer}>
                            <Image
                                source={soldIcon}
                                style={{ width: ifTablet(16, 12), height: ifTablet(16, 12), marginRight: ifTablet(4, 2) }}
                                resizeMode='contain'
                            />
                            {/* hoac 0 neu khong */}
                            {totalSold > 0 ? (
                                <Text style={styles.soldText}>{formatSold(totalSold)} Đã bán</Text>
                            ) : (
                                <Text style={styles.soldText}>0 Đã bán</Text>
                            )}
                        </View>
                        {/* <Text style={styles.categoryText}>{product?.categoryName}</Text> */}

                        {/* <Text style={{ ...styles.availableText, color: checkAvailabilityColor(product?.available || false), backgroundColor: checkAvailabilityBackgroundColor(product?.available || false) }}>{product?.available ? 'Còn hàng' : 'Hết hàng'}</Text> */}
                        {/* yeu thich */}
                        <TouchableOpacity
                            style={[styles.wishlistContainer, isFavorited && styles.wishlistContainerActive]}
                            onPress={handleToggleFavorite}
                            disabled={isTogglingFavorite}
                        >
                            <Text style={styles.heartIconText}>{isTogglingFavorite ? '⏳' : (isFavorited ? '❤️' : '🤍')}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.priceIntransitContainer}>
                        <View style={styles.priceContainer}>
                            {defaultPromotion && (
                                <View style={styles.promotionContainer}>
                                    <Text style={styles.promotionText}>
                                        🎉 {defaultPromotion.title}
                                    </Text>
                                </View>
                            )}
                            {productOldPrice && (
                                <Text style={styles.oldPriceText} ellipsizeMode='tail' numberOfLines={1}>{productOldPrice.toLocaleString('vi-VN')} đ</Text>
                            )}
                            <Text style={styles.priceText} ellipsizeMode='tail' numberOfLines={1} >{productPrice.toLocaleString('vi-VN')} đ </Text>
                        </View>


                    </View>

                    <View style={styles.moreInfoContainer}>
                        <CustomMoreInfo
                            logo={chatIcon}
                            infoText={'Hỗ trợ tư vấn miễn phí'}
                            onPress={handleConsultation}
                        />
                        <CustomMoreInfo
                            logo={tutorialIcon}
                            infoText="Hướng dẫn sử dụng"
                            onPress={handleTutorialPress}
                        />
                        <CustomMoreInfo
                            logo={shiledIcon}
                            infoText="Bảo hành 1 đổi 1 nếu có lỗi từ nhà sản xuất"
                            onPress={handleWarrantyPress}
                        />


                    </View>

                    {/* rating */}
                    <View style={styles.ratingContainer}>
                        <RatingPreview
                            averageRating={Number(averageRating.toFixed(1))}
                            totalReviews={totalReviews}
                            ratings={productRatings}
                            onViewAll={handleViewAllRatings}
                            soldCount={totalSold}
                            navigation={navigation}
                            onImagePress={(uri, type) => { setZoomImage(uri); setZoomType(type); }}
                        />
                        <ActivityIndicator animating={isProductReviewsLoading} size="small" color={Colors.primary} />
                    </View>

                    {/* Description */}
                    <Description
                        description={productData?.description || 'Không có mô tả sản phẩm'}
                        maxLines={6}
                        scrollRef={scrollViewRef}
                    />

                    {/* Suggested Products */}
                    {suggestedProducts.length > 0 && (
                        <SuggestedProducts
                            products={suggestedProducts}
                            onProductPress={handleSuggestedProductPress}
                        />
                    )}

                </View>
            </ScrollView>
            <LoadingOverlay visible={isProductLoading || isSuggestedLoading} />
            {/* Bottom Action Bar */}
            <BottomActionBar
                price={productPrice}
                isAvailable={true}
                onConsultation={handleConsultation}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                isLoading={isAddToCartPending}
            />

            {/* Tutorial Modal */}
            <BottomModal
                visible={tutorialModalVisible}
                onClose={() => setTutorialModalVisible(false)}
                title="Hướng dẫn sử dụng"
                content={productData?.instruct || 'Chưa có hướng dẫn sử dụng cho sản phẩm này.'}
            />

            {/* Warranty Modal */}
            <BottomModal
                visible={warrantyModalVisible}
                onClose={() => setWarrantyModalVisible(false)}
                title="Chính sách bảo hành"
                content={productData?.warranty || 'Chưa có chính sách bảo hành cho sản phẩm này.'}
            />

            {/* Confirm Send Product Modal */}
            <ConfirmSendProductModal
                visible={confirmSendProductModalVisible}
                onClose={() => setConfirmSendProductModalVisible(false)}
                onConfirm={handleConfirmSendProduct}
                productName={productData?.name || ''}
                productImage={productData?.thumbnail || ''}
                productPrice={productPrice}
            />

            {/* Image Zoom View */}
            <ImageZoomView
                imageUri={zoomImage || undefined}
                type={zoomType}
                onClose={() => setZoomImage(null)}
            />
        </View>
    )
}

export default ProductDetailsScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: 'white',
    },
    scrollView: {
        flexGrow: 1,
    },
    contentContainer: {
        marginHorizontal: ifTablet(32, 16),
        paddingVertical: ifTablet(24, 16),
    },
    productTitle: {
        fontSize: ifTablet(24, 20),
        fontFamily: 'Sora-Bold',
        fontWeight: '600',
        color: 'rgba(36, 36, 36, 1)',
        marginBottom: 8,
    },
    soldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(242, 236, 236, 0.35)',
        padding: ifTablet(12, 4),
        borderRadius: ifTablet(12, 8),
    },
    soldText: {
        fontSize: ifTablet(16, 12),
        fontFamily: 'Sora-Regular',
        color: Colors.grayDark,
        marginLeft: ifTablet(8, 2),
    },
    categoryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
        justifyContent: 'space-between',
        marginBottom: ifTablet(16, 12),
    },
    categoryText: {
        fontSize: ifTablet(16, 14),
        fontFamily: 'Sora-Regular',
        color: '#A2A2A2',
    },
    availableText: {
        fontSize: ifTablet(16, 12),
        fontFamily: 'Sora-Regular',
        color: Colors.primary,
        backgroundColor: 'rgba(238, 77, 45, 0.1)',
        paddingHorizontal: ifTablet(8, 6),
        paddingVertical: ifTablet(4, 2),
        borderRadius: ifTablet(8, 6),
    },
    wishlistContainer: {
        padding: ifTablet(8, 6),
        borderRadius: ifTablet(12, 8),
        backgroundColor: Colors.priceBackground,
    },
    wishlistContainerActive: {
        backgroundColor: 'rgba(238, 77, 45, 0.1)',
    },
    headerIcon: {
        width: ifTablet(24, 20),
        height: ifTablet(24, 20),
    },
    heartIconText: {
        fontSize: ifTablet(24, 20),
    },
    priceIntransitContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    priceContainer: {
        flexDirection: 'column',
        // alignItems: 'center',
        justifyContent: 'flex-start',
        gap: ifTablet(4, 2),
        // marginBottom: 16,
    },
    promotionContainer: {
        marginBottom: 8,
        paddingVertical: ifTablet(2, 1),
        paddingHorizontal: ifTablet(6, 4),
        backgroundColor: Colors.priceBackground,
        borderRadius: ifTablet(8, 6),
    },
    promotionText: {
        color: Colors.pricePrimary,
        fontSize: ifTablet(14, 12),
        marginBottom: 4,
        fontFamily: 'Sora-Medium',
    },
    priceText: {
        fontSize: ifTablet(22, 18),
        fontFamily: 'Sora-Bold',
        fontWeight: '600',
        // color: Colors.primary,
        color: Colors.pricePrimary,
    },
    oldPriceText: {
        fontSize: ifTablet(16, 14),
        fontFamily: 'Sora-Regular',
        color: Colors.gray,
        textDecorationLine: 'line-through',
    },
    InTransitContainer: {
        alignItems: 'center',
        backgroundColor: 'rgba(242, 236, 236, 0.35)',
        padding: ifTablet(12, 4),
        borderRadius: ifTablet(12, 8),
    },
    InTransitLogo: {
        width: ifTablet(48, 30),
        height: ifTablet(48, 30),
        tintColor: '#C67C4E',
    },
    moreInfoContainer: {
        marginTop: ifTablet(24, 16),
        gap: ifTablet(16, 6),
    },
    ratingContainer: {
        marginTop: ifTablet(24, 16),
    },
    debugText: {
        fontSize: ifTablet(14, 12),
        fontFamily: 'Sora-Regular',
        color: '#999999',
    },

})