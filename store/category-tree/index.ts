
import CategoryModel from '@/models/category-model';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
export interface CategoryTreeState {
    categories: CategoryModel[],
    categoryModal: boolean,
    category?: CategoryModel,
    categoryAncestors: CategoryModel[],
}
const initialState: CategoryTreeState = {
    categories: [],
    categoryModal: false,
    category: undefined,
    categoryAncestors: []


}

export const categoryTreeSlice = createSlice({
    name: 'categoryTree',
    initialState,
    reducers: {
        initializeTree: (state, action: PayloadAction<CategoryModel[]>) => {
            state.categories = action.payload;
        },
        handleCategoryModal: (state,action: PayloadAction<boolean>) => {
            state.categoryModal = action.payload;
        },
        setDynamicCategory: (state, action: PayloadAction<{category?: CategoryModel}>) => {
            state.category = action.payload.category;
        }
    },
})
export const {initializeTree,handleCategoryModal,setDynamicCategory} = categoryTreeSlice.actions;
export default categoryTreeSlice.reducer