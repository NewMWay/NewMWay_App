import { create } from 'zustand'

export interface FilterState {
  // Selected active category for HomeScreen
  activeCategory: string
  
  // Filter values
  suppliers: string[]
  categories: string[]
  priceRange: {
    min: number
    max: number
  }
  sizes: string[]
  ratings: number[]

  // Actions
  setActiveCategory: (categoryId: string) => void
  setSuppliers: (suppliers: string[]) => void
  setCategories: (categories: string[]) => void
  setPriceRange: (range: { min: number; max: number }) => void
  setSizes: (sizes: string[]) => void
  setRatings: (ratings: number[]) => void
  clearAllFilters: () => void

  // Helpers
  getSelectedFiltersCount: () => number
  getFilterSummary: () => string
}

const useFilterStore = create<FilterState>((set, get) => ({
  // Initial state
  activeCategory: 'all', // Default to "Tất cả"
  suppliers: [],
  categories: [],
  priceRange: { min: 0, max: 10000000 },
  sizes: [],
  ratings: [],

  // Actions
  setActiveCategory: (categoryId) => set({ activeCategory: categoryId }),
  setSuppliers: (suppliers) => set({ suppliers }),
  setCategories: (categories) => set({ categories }),
  setPriceRange: (range) => set({ priceRange: range }),
  setSizes: (sizes) => set({ sizes }),
  setRatings: (ratings) => set({ ratings }),
  
  clearAllFilters: () => set({
    activeCategory: 'all',
    suppliers: [],
    categories: [],
    priceRange: { min: 0, max: 10000000 },
    sizes: [],
    ratings: [],
  }),

  // Helper functions
  getSelectedFiltersCount: () => {
    const state = get()
    let count = 0
    
    if (state.suppliers.length > 0) count++
    if (state.categories.length > 0) count++
    if (state.priceRange.min > 0 || state.priceRange.max < 10000000) count++
    if (state.sizes.length > 0) count++
    if (state.ratings.length > 0) count++
    
    return count
  },

  getFilterSummary: () => {
    const state = get()
    const summaries: string[] = []

    if (state.suppliers.length > 0) {
      summaries.push(`${state.suppliers.length} nhà cung cấp`)
    }

    if (state.categories.length > 0) {
      summaries.push(`${state.categories.length} loại`)
    }

    if (state.priceRange.min > 0 || state.priceRange.max < 10000000) {
      const formatPrice = (price: number) => 
        new Intl.NumberFormat('vi-VN').format(price)
      summaries.push(`Giá: ${formatPrice(state.priceRange.min)} - ${formatPrice(state.priceRange.max)} VNĐ`)
    }

    if (state.sizes.length > 0) {
      summaries.push(`${state.sizes.length} kích thước`)
    }

    if (state.ratings.length > 0) {
      summaries.push(`Đánh giá từ ${Math.min(...state.ratings)} sao`)
    }

    return summaries.length > 0 
      ? `Đã chọn: ${summaries.join(', ')}` 
      : 'Chưa có bộ lọc nào'
  }
}))

export default useFilterStore