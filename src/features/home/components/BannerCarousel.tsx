import React, { useState } from 'react';
import { View, Image, FlatList, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../../../assets/styles/colorStyles';

const { width } = Dimensions.get('window');

type BannerItem = { id: string; image: any };

const BannerCarousel: React.FC<{ images: any[]; height?: number }> = ({ images, height = 170 }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const data: BannerItem[] = images.map((img, idx) => ({ id: String(idx), image: img }));

  const renderBanner = ({ item }: { item: BannerItem }) => (
    <View style={[styles.bannerContainer, { height: height }]}>
      <Image
        source={item.image}
        style={[styles.bannerImage, { width: width - 64, height: height }]}
        resizeMode="cover"
      />
    </View>
  );

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setActiveIndex(index);
  };

  const renderPagination = () => (
    <View style={styles.paginationContainer}>
      {data.map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            activeIndex === index ? styles.paginationDotActive : styles.paginationDotInactive,
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={[styles.container, { height: height }]}>
      <FlatList
        data={data}
        renderItem={renderBanner}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.flatListContent}
      />
      {renderPagination()}
    </View>
  );
};

export default BannerCarousel;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    position: 'relative',
  },
  bannerContainer: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerImage: {
    borderRadius: 12,
  },
  flatListContent: {
    alignItems: 'center',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 5,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: Colors.primary,
  },
  paginationDotInactive: {
    backgroundColor: '#E0E0E0',
  },
});
