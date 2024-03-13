
import CategoryModel from '@/models/category-model';
import { FilterValueModel, OptionModel, sortingTypes, SortModel, ValueModel } from '@/models/option-models';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '..';
export interface FilterState {
    options: OptionModel[],
    filterValues: FilterValueModel[],
    sortingTypes: SortModel[]
    sortingValue: SortModel,
    filterModal: boolean,
    sortModal: boolean,

}

export const specialOptions = [
    {title: 'Anahtar Kelime',type: 'search',special: true} as OptionModel,
    {title: 'Fiyat',type: 'price',special: true} as OptionModel,
    {title: 'Şehir',type: 'city',special: true} as OptionModel,
    {title: 'İlçe',type: 'district',special: true} as OptionModel,
    {title: 'Mahalle',type: 'neighborhood',special: true} as OptionModel,
]

const initialState: FilterState = {
    options: [],
    filterValues:[],
    sortingTypes: [...sortingTypes],
    sortingValue: sortingTypes[0],
    filterModal: false,
    sortModal: false,
}

const idMatcher = (id?:string,o?:OptionModel) => id == ""+o?.id || (o?.special && id == o.type)
const selectors = {
    selectOption: (id: string) => (state: RootState) => state.filter.options.find(o => idMatcher(id,o)),
    selectFilterValue: (option: OptionModel) => (state: RootState) => state.filter.filterValues.find(o => idMatcher(o.optionId,option))
}

export const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        handleFilterModal: (state, action: PayloadAction<boolean>) => {
            state.filterModal = action.payload;
        },
        handleSortModal: (state, action: PayloadAction<boolean>) => {
            state.sortModal = action.payload;
        },
        setSortingType: (state, action: PayloadAction<SortModel>) => {
            state.sortingValue = action.payload;
        },
        setOptions: (state,action: PayloadAction<OptionModel[]>) => {
            state.options = [...action.payload];
            state.filterValues = [];
        },
        setFilterValue(state,action: PayloadAction<{option: OptionModel,value: string,initial?:boolean}>) {
            const {option,value,initial} = action.payload;
            const targetIndex = state.filterValues.findIndex(o => {
                return idMatcher(o.optionId,option)
            })
            
            if(value === "" || value === undefined) {
                if(targetIndex !== -1) {
                    state.filterValues.splice(targetIndex,1)
                }
            }
            else if(targetIndex === -1) {
                state.filterValues.push({optionId: option.special ? option.type:""+option.id,value: value,type: option.type} as FilterValueModel)
            }
            else {
                const existingValue = state.filterValues[targetIndex];
                existingValue.value = value;
                if(!initial) {
                    const removeTarget = (target: string) => {
                        const tid = state.filterValues.findIndex(o =>o.optionId == target);
                        if(tid >-1) {
    
                            state.filterValues.splice(tid,1);
                        }
                    }
                    if(existingValue.optionId == 'city') {
                   
                        removeTarget('district');
                        removeTarget('neighborhood');
                    }
                    if(existingValue.optionId == 'district') {
                        removeTarget('neighborhood');
                    }
                }
                
            }
            
        }
    },
})
export const {setSortingType,setOptions,setFilterValue,handleFilterModal,handleSortModal} = filterSlice.actions;
export const {selectOption,selectFilterValue} = selectors;
export default filterSlice.reducer