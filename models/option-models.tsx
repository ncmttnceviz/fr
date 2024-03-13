


export interface OptionModel {
    id?: number;
    title?:string;
    type?:string;
    special?: boolean;
    values?: ValueModel[]
    
}
export interface ValueModel {
    id?: number;
    title?:string;
    
}
export interface FilterValueModel {
    optionId?: string;
    type?:string;
    value?:string;
    

 
}
export interface SortModel {
    title?: string;
    sortBy?: "price"|"created_at";
    direction?:"last"|"first";
    
}
export const sortingTypes = [
    {title: 'Önce En Yeni İlan',sortBy: "created_at",direction: 'last'} as SortModel,
    {title: 'Önce En Eski İlan',sortBy: "created_at",direction: 'first'} as SortModel,
    {title: 'Fiyat (Azdan Çoka)',sortBy: "price",direction: 'first'} as SortModel,
    {title: 'Fiyat (Çoktan Aza)',sortBy: "price",direction: 'last'} as SortModel,
]

