


export interface CityModel {
    id?: number;
    title?:string;
    
}
export interface DistrictModel {
    id?: number;
    title?:string;
    city_id?:number;
}
export interface NeighborhoodModel {
    id?: number;
    district_id?: number;
    title?:string;
    is_parent: boolean;
    latitude: number;
    longitude: number;
}
