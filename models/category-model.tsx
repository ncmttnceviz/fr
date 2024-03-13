export interface BaseCategoryModel {
    id: number;
    title: string;
    slug?: string;
    children: BaseCategoryModel[];
    ancestors: BaseCategoryModel[];
    images: {
        small: string;
        medium: string;
    }
}
export default interface CategoryModel extends BaseCategoryModel{
    
}
export interface CategoryDetailModel extends BaseCategoryModel{
    options: {id: number,title: string,type:string,values?: {title: string,id: number}[]}[]
    attributes: {id: number,title: string,values: {title: string,id: number}[]}[]
}