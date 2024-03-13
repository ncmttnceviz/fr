import { ImageToBeUploaded, UploadedImage } from "@/components/form/image-upload";
import CategoryModel from "./category-model";
import { CityModel, DistrictModel, NeighborhoodModel } from "./location-models";

export interface BaseAdvertModel {
    id: number;
    title: string;
    description: string;
    code: string;
    slug: string;
    price: number;
    is_vip: boolean;
    city: string;
    district: string;
    neighborhood: string;
    created_at: string;
}
export interface ListingAdvertModel extends BaseAdvertModel {
    category_title?: string;
    image?: string;
}
export interface ConfigurableAdvertModel extends ListingAdvertModel {
    payment_status: null | 'pending'|'failed'|'success';
    is_published: boolean;
    is_approved: boolean;

}

export interface DetailAdvertModel extends BaseAdvertModel {
    latitude: number;
    longitude: number;
    images: AdvertImage[];
    options: {title: string,value: string}[];
    attributes: {title: string,value: string}[];
    estate_agent?: AdvertUserModel;
    advisor?: AdvertUserModel;
    category_tree: CategoryModel[];
    is_vip: boolean;
    is_published: boolean;
    is_approved: boolean;
    is_preview: boolean;
    isFavorite: boolean;
    preview_type: null | 'user'|'admin';
    payment_status: null | 'pending'|'failed'|'success';
    views: number;
    code: string;
}

export interface AdvertImage {
    small: string;
    medium: string;
    large: string;
    isCover: boolean;
}
export interface UpdateAdvertImage extends AdvertImage {
    image_id: number;
}

export interface AdvertUserModel {
    id: number;
    advert_phone: string;
    whatsapp: string;
    fullname: string;
    image?: string
}

export interface UpdateAdvertModel extends BaseAdvertModel {

    latitude: number;
    longitude: number;
    images: UpdateAdvertImage[];
    options: {optionId: number,valueId: number}[];
    inputs: {optionId: number,valueId: number}[];
    attributes: {attributeId: number,valueId: number}[];
    extra_photo: boolean,
    category_tree: CategoryModel[];
    is_vip: boolean;
    is_published: boolean;
    is_approved: boolean;
    views: number;
    code: string;
    

}
export interface UpdateAdvertFormModel {
    title: string;
    price: number;
    description: string;
    options: {optionId: number,valueId: number}[];
    inputs: {optionId: number,valueId: number}[];
    attributes: {attributeId: number,valueId: number}[];
    images: (ImageToBeUploaded|UploadedImage)[]|undefined;
    deleted_images: any[];
    cover_photo: number,
    city: CityModel,
    district: DistrictModel,
    neighborhood: NeighborhoodModel,
    latitude: number,
    longitude: number,
}

export interface NewAdvertFormModel {
    title: string;
    price: number;
    description: string;
    options: {optionId: number,valueId: number}[];
    inputs: {optionId: number,valueId: number}[];
    attributes: {attributeId: number,valueId: number}[];
    images: ImageToBeUploaded[];
    category: CategoryModel,
    city: CityModel,
    district: DistrictModel,
    neighborhood: NeighborhoodModel,
    latitude: number,
    longitude: number,
    cover_photo: number,
}

export interface AdvertPlanModel {
    id: number,
    plan_key: string,
    price: number,
}