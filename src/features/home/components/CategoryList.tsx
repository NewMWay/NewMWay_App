import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors } from '../../../assets/styles/colorStyles';
import { ifTablet } from '../../../utils/responsives/responsive';

interface CategoryListProps {
  activeCategory: string
  onCategoryChange: (categoryId: string) => void
  categories?: Array<{ id: string; name: string }> // Add categories prop
}

export default function CategoryList({ activeCategory, onCategoryChange, categories: propCategories }: CategoryListProps) {
    // Use provided categories or fallback to default
    const categories = propCategories || [
        { id: 'all', name: 'Tất cả' },
        // { id: '2', name: 'Nồi, Chảo' },
        // { id: '3', name: 'Thớt Gỗ' },
        // { id: '4', name: 'Dao, Kéo' },
    ]

    const renderItem = ({ item }: { item: { id: string; name: string } }) => {
        const isActive = item.id === activeCategory;
        return (
            <TouchableOpacity
                onPress={() => onCategoryChange(item.id)}
                style={[
                    styles.categoryContainer,
                    isActive ? styles.categoryActive : styles.categoryInActive,
                ]}
            >
                <Text
                    style={
                        isActive
                            ? styles.categoryTextActive
                            : styles.categoryTextInActive
                    }
                >
                    {item.name}
                </Text>
            </TouchableOpacity>
        );
    }


    return (
        <View style={styles.container}>
            <FlatList
                data={categories}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.flatListContent}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    categoryContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: Colors.primary,
    },
    flatListContent: {
        alignItems: 'center',
        gap: 10,
        marginVertical: 16,
    },
    categoryActive: {
        backgroundColor: Colors.primary,
    },
    categoryInActive: {
        backgroundColor: '#EDEDED',
    },
    categoryTextActive: {
        color: Colors.textWhite,
        fontSize: ifTablet(18, 14),
        fontFamily: 'Sora-SemiBold',
        fontWeight: '600',
    },
    categoryTextInActive: {
        color: Colors.textDark,
        fontSize: ifTablet(18, 14),
        fontFamily: 'Sora-Regular',
        fontWeight: '400',
    },
})  