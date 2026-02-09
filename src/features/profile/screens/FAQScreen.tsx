import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native'
import React, { useState, useMemo } from 'react'
import { useNavigation } from '@react-navigation/native'
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader'
import { Colors } from '../../../assets/styles/colorStyles'
import { ifTablet } from '../../../utils/responsives/responsive'
import { ProfileStackNavigationProp } from '../../../types/navigation/navigation'
import { FAQ_DATA, FAQ_CATEGORIES, searchFAQ, filterFAQByCategory } from '../../../constants/FAQData'

const ITEMS_PER_PAGE = 10

const FAQScreen = () => {
    const navigation = useNavigation<ProfileStackNavigationProp>()
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)

    // Icon declarations
    const searchIcon = require('../../../assets/icons/icons8-search-48.png')
    const closeIcon = require('../../../assets/icons/icons8-close-48.png')
    const chevronUpIcon = require('../../../assets/icons/icons8-collapse-arrow-48.png')
    const chevronDownIcon = require('../../../assets/icons/icons8-down-48.png')
    const chatIcon = require('../../../assets/icons/icons8-chat-48.png')
    const booksIcon = require('../../../assets/icons/icons8-books-48.png')
    const backIcon = require('../../../assets/icons/icons8-back-48.png')
    const forwardIcon = require('../../../assets/icons/icons8-forward-48.png')
    const phoneIcon = require('../../../assets/icons/icons8-phone-48.png')

    // Filter and search FAQs
    const filteredFAQs = useMemo(() => {
        let faqs = FAQ_DATA
        
        // Filter by category
        if (selectedCategory !== 'all') {
            faqs = filterFAQByCategory(selectedCategory)
        }
        
        // Search
        if (searchQuery.trim()) {
            faqs = searchFAQ(searchQuery)
        }
        
        return faqs
    }, [selectedCategory, searchQuery])

    // Pagination
    const totalPages = Math.ceil(filteredFAQs.length / ITEMS_PER_PAGE)
    const paginatedFAQs = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
        const endIndex = startIndex + ITEMS_PER_PAGE
        return filteredFAQs.slice(startIndex, endIndex)
    }, [filteredFAQs, currentPage])

    const toggleExpand = (id: number) => {
        setExpandedIndex(expandedIndex === id ? null : id)
    }

    const handleSearch = (text: string) => {
        setSearchQuery(text)
        setCurrentPage(1) // Reset to first page when searching
        setExpandedIndex(null)
    }

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category)
        setCurrentPage(1)
        setExpandedIndex(null)
    }

    const goToPage = (page: number) => {
        setCurrentPage(page)
        setExpandedIndex(null)
    }

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
            setExpandedIndex(null)
        }
    }

    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
            setExpandedIndex(null)
        }
    }

    const handleChatPress = () => {
        const parentNavigation = navigation.getParent()
                        if (parentNavigation) {
                            parentNavigation.navigate('Tin Nhắn')
                        }
    }
    return (
        <View style={styles.container}>
            <PrimaryHeader title="Câu Hỏi Thường Gặp" onBackPress={() => navigation.goBack()} />
            
            <View style={styles.content}>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Image source={searchIcon} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Tìm kiếm câu hỏi..."
                        placeholderTextColor={Colors.textGray}
                        value={searchQuery}
                        onChangeText={handleSearch}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => handleSearch('')}>
                            <Image source={closeIcon} style={styles.closeIcon} />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Category Filter */}
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoryScroll}
                    contentContainerStyle={styles.categoryContainer}
                >
                    {FAQ_CATEGORIES.map((category) => (
                        <TouchableOpacity
                            key={category.key}
                            style={[
                                styles.categoryChip,
                                selectedCategory === category.key && styles.categoryChipActive
                            ]}
                            onPress={() => handleCategoryChange(category.key)}
                            activeOpacity={0.7}
                        >
                            <Text style={[
                                styles.categoryText,
                                selectedCategory === category.key && styles.categoryTextActive
                            ]}>
                                {category.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Results Info */}
                <View style={styles.resultsInfo}>
                    <Text style={styles.resultsText}>
                        Hiển thị {paginatedFAQs.length > 0 ? ((currentPage - 1) * ITEMS_PER_PAGE + 1) : 0} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredFAQs.length)} trong {filteredFAQs.length} câu hỏi
                    </Text>
                    {totalPages > 1 && (
                        <Text style={styles.pageText}>Trang {currentPage}/{totalPages}</Text>
                    )}
                </View>

                {/* FAQ List */}
                <ScrollView 
                    style={styles.scrollView} 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {paginatedFAQs.length > 0 ? (
                        paginatedFAQs.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={[
                                    styles.faqItem,
                                    expandedIndex === item.id && styles.faqItemExpanded
                                ]}
                                onPress={() => toggleExpand(item.id)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.questionRow}>
                                    <View style={styles.questionLeft}>
                                        <Text style={styles.questionNumber}>Q{item.id}</Text>
                                        <Text style={styles.question}>{item.question}</Text>
                                    </View>
                                    <Image 
                                        source={expandedIndex === item.id ? chevronUpIcon : chevronDownIcon} 
                                        style={styles.chevronIcon}
                                    />
                                </View>
                                {expandedIndex === item.id && (
                                    <View style={styles.answerContainer}>
                                        <Image source={chatIcon} style={styles.commentIcon} />
                                        <Text style={styles.answer}>{item.answer}</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Image source={booksIcon} style={styles.emptyIcon} />
                            <Text style={styles.emptyText}>Không tìm thấy câu hỏi phù hợp</Text>
                            <Text style={styles.emptySubText}>Thử tìm kiếm với từ khóa khác</Text>
                        </View>
                    )}

                    {/* Pagination Controls */}
                    {totalPages > 1 && paginatedFAQs.length > 0 && (
                        <View style={styles.paginationContainer}>
                            <TouchableOpacity
                                style={[styles.paginationButton, currentPage === 1 && styles.paginationButtonDisabled]}
                                onPress={goToPrevPage}
                                disabled={currentPage === 1}
                                activeOpacity={0.7}
                            >
                                <Image 
                                    source={backIcon} 
                                    style={[styles.paginationIcon, currentPage === 1 && styles.paginationIconDisabled]}
                                />
                                <Text style={[styles.paginationButtonText, currentPage === 1 && styles.paginationButtonTextDisabled]}>
                                    Trước
                                </Text>
                            </TouchableOpacity>

                            <View style={styles.pageNumbers}>
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum
                                    if (totalPages <= 5) {
                                        pageNum = i + 1
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i
                                    } else {
                                        pageNum = currentPage - 2 + i
                                    }
                                    
                                    return (
                                        <TouchableOpacity
                                            key={pageNum}
                                            style={[
                                                styles.pageNumberButton,
                                                currentPage === pageNum && styles.pageNumberButtonActive
                                            ]}
                                            onPress={() => goToPage(pageNum)}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={[
                                                styles.pageNumberText,
                                                currentPage === pageNum && styles.pageNumberTextActive
                                            ]}>
                                                {pageNum}
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>

                            <TouchableOpacity
                                style={[styles.paginationButton, currentPage === totalPages && styles.paginationButtonDisabled]}
                                onPress={goToNextPage}
                                disabled={currentPage === totalPages}
                                activeOpacity={0.7}
                            >
                                <Text style={[styles.paginationButtonText, currentPage === totalPages && styles.paginationButtonTextDisabled]}>
                                    Sau
                                </Text>
                                <Image 
                                    source={forwardIcon} 
                                    style={[styles.paginationIcon, currentPage === totalPages && styles.paginationIconDisabled]}
                                />
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Contact Card */}
                    <View style={styles.contactCard}>
                        <Image source={phoneIcon} style={styles.contactIconImage} />
                        <Text style={styles.contactTitle}>Không tìm thấy câu trả lời?</Text>
                        <Text style={styles.contactText}>
                            Liên hệ với chúng tôi qua chat hoặc hotline để được hỗ trợ nhanh chóng
                        </Text>
                        <TouchableOpacity style={styles.contactButton} activeOpacity={0.7} onPress={handleChatPress}>
                            <Image source={chatIcon} style={styles.chatButtonIcon} />
                            <Text style={styles.contactButtonText}>Chat Ngay</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}

export default FAQScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.grayLight,
    },
    content: {
        flex: 1,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.textWhite,
        marginHorizontal: ifTablet(20, 16),
        marginTop: ifTablet(16, 14),
        marginBottom: ifTablet(12, 10),
        paddingHorizontal: ifTablet(16, 14),
        paddingVertical: ifTablet(12, 10),
        borderRadius: ifTablet(12, 10),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    searchIcon: {
        width: ifTablet(22, 20),
        height: ifTablet(22, 20),
        marginRight: ifTablet(10, 8),
        tintColor: Colors.textGray,
    },
    closeIcon: {
        width: ifTablet(20, 18),
        height: ifTablet(20, 18),
        tintColor: Colors.textGray,
    },
    searchInput: {
        flex: 1,
        fontSize: ifTablet(15, 14),
        fontFamily: 'Sora-Regular',
        color: Colors.textDark,
        padding: 0,
    },
    categoryScroll: {
        maxHeight: ifTablet(50, 45),
    },
    categoryContainer: {
        paddingHorizontal: ifTablet(20, 16),
        paddingBottom: ifTablet(8, 6),
        gap: ifTablet(10, 8),
    },
    categoryChip: {
        paddingHorizontal: ifTablet(16, 14),
        paddingVertical: ifTablet(8, 7),
        borderRadius: ifTablet(20, 18),
        backgroundColor: Colors.textWhite,
        borderWidth: 1,
        borderColor: Colors.grayLight,
        marginRight: ifTablet(10, 8),
    },
    categoryChipActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    categoryText: {
        fontSize: ifTablet(13, 12),
        fontFamily: 'Sora-Medium',
        color: Colors.textGray,
    },
    categoryTextActive: {
        color: Colors.textWhite,
        fontFamily: 'Sora-SemiBold',
    },
    resultsInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: ifTablet(20, 16),
        paddingVertical: ifTablet(10, 8),
    },
    resultsText: {
        fontSize: ifTablet(12, 11),
        fontFamily: 'Sora-Regular',
        color: Colors.textGray,
    },
    pageText: {
        fontSize: ifTablet(12, 11),
        fontFamily: 'Sora-SemiBold',
        color: Colors.primary,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: ifTablet(20, 16),
        paddingBottom: ifTablet(20, 16),
    },
    faqItem: {
        backgroundColor: Colors.textWhite,
        borderRadius: ifTablet(12, 10),
        padding: ifTablet(16, 14),
        marginBottom: ifTablet(12, 10),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    faqItemExpanded: {
        borderWidth: 1,
        borderColor: Colors.primary + '30',
    },
    questionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    questionLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: ifTablet(10, 8),
    },
    questionNumber: {
        fontSize: ifTablet(13, 12),
        fontFamily: 'Sora-Bold',
        color: Colors.primary,
        backgroundColor: Colors.primary + '15',
        paddingHorizontal: ifTablet(8, 7),
        paddingVertical: ifTablet(4, 3),
        borderRadius: ifTablet(6, 5),
        marginRight: ifTablet(12, 10),
    },
    question: {
        flex: 1,
        fontSize: ifTablet(15, 14),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
        lineHeight: ifTablet(22, 20),
    },
    chevronIcon: {
        width: ifTablet(24, 22),
        height: ifTablet(24, 22),
        tintColor: Colors.primary,
    },
    answerContainer: {
        marginTop: ifTablet(12, 10),
        paddingTop: ifTablet(12, 10),
        borderTopWidth: 1,
        borderTopColor: Colors.grayLight,
        flexDirection: 'row',
        gap: ifTablet(10, 8),
    },
    commentIcon: {
        width: ifTablet(18, 16),
        height: ifTablet(18, 16),
        tintColor: Colors.primary,
        marginTop: ifTablet(2, 2),
    },
    answer: {
        flex: 1,
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-Regular',
        color: Colors.primaryDark,
        lineHeight: ifTablet(24, 22),
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: ifTablet(60, 50),
    },
    emptyIcon: {
        width: ifTablet(64, 56),
        height: ifTablet(64, 56),
        tintColor: Colors.primaryDark,
    },
    emptyText: {
        fontSize: ifTablet(16, 15),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textDark,
        marginTop: ifTablet(16, 14),
    },
    emptySubText: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-Regular',
        color: Colors.primaryDark,
        marginTop: ifTablet(8, 6),
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: ifTablet(20, 16),
        marginBottom: ifTablet(16, 14),
    },
    paginationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: ifTablet(10, 8),
        paddingHorizontal: ifTablet(16, 14),
        backgroundColor: Colors.textWhite,
        borderRadius: ifTablet(8, 7),
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    paginationButtonDisabled: {
        borderColor: Colors.grayLight,
        opacity: 0.5,
    },
    paginationButtonText: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-SemiBold',
        color: Colors.primary,
        marginHorizontal: ifTablet(6, 5),
    },
    paginationButtonTextDisabled: {
        color: Colors.primaryDark,
    },
    paginationIcon: {
        width: ifTablet(20, 18),
        height: ifTablet(20, 18),
        tintColor: Colors.primary,
    },
    paginationIconDisabled: {
        tintColor: Colors.primaryDark,
    },
    pageNumbers: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ifTablet(8, 6),
    },
    pageNumberButton: {
        width: ifTablet(36, 32),
        height: ifTablet(36, 32),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.textWhite,
        borderRadius: ifTablet(8, 7),
        borderWidth: 1,
        borderColor: Colors.grayLight,
    },
    pageNumberButtonActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    pageNumberText: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-Medium',
        color: Colors.primaryDark,
    },
    pageNumberTextActive: {
        color: Colors.textWhite,
        fontFamily: 'Sora-Bold',
    },
    contactCard: {
        backgroundColor: Colors.primary + '10',
        borderRadius: ifTablet(16, 14),
        padding: ifTablet(24, 20),
        marginTop: ifTablet(24, 20),
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.primary + '30',
    },
    contactIconImage: {
        width: ifTablet(32, 28),
        height: ifTablet(32, 28),
        tintColor: Colors.primary,
        marginBottom: ifTablet(12, 10),
    },
    contactTitle: {
        fontSize: ifTablet(18, 17),
        fontFamily: 'Sora-Bold',
        color: Colors.primaryDark,
        marginBottom: ifTablet(8, 6),
        textAlign: 'center',
    },
    contactText: {
        fontSize: ifTablet(14, 13),
        fontFamily: 'Sora-Regular',
        color: Colors.primaryDark,
        lineHeight: ifTablet(22, 20),
        textAlign: 'center',
        marginBottom: ifTablet(16, 14),
    },
    contactButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        paddingVertical: ifTablet(12, 10),
        paddingHorizontal: ifTablet(24, 20),
        borderRadius: ifTablet(10, 8),
        gap: ifTablet(8, 6),
    },
    chatButtonIcon: {
        width: ifTablet(20, 18),
        height: ifTablet(20, 18),
        tintColor: Colors.textWhite,
    },
    contactButtonText: {
        fontSize: ifTablet(15, 14),
        fontFamily: 'Sora-SemiBold',
        color: Colors.textWhite,
    },
})
