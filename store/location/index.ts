
import makeAxios from '@/feature/makeAxios';
import { CityModel, DistrictModel, NeighborhoodModel } from '@/models/location-models';
import { createAsyncThunk, createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '..';
export interface LocationState {
    cities: CityModel[],
    districts: DistrictModel[],
    neighborhoods: NeighborhoodModel[],
}
const initialState: LocationState = {
  cities: [],
  districts: [],
  neighborhoods: [],
}
const axios = makeAxios();
export const fetchDistricts = createAsyncThunk("location/fetchDistricts", async (city_id: number, thunkApi) => {
    const districts = (thunkApi.getState() as RootState).location.districts;
    if(!!districts.find(o => o.city_id === city_id)){
        return;
    }
    const res = await axios.get(`/districts/${city_id}`)
    thunkApi.dispatch(appendDistricts(res.data.data as DistrictModel[]));

});
export const fetchNeighborhoods = createAsyncThunk("location/fetchNeighborhoods", async (district_id: number, thunkApi) => {
    const neighborhoods = (thunkApi.getState() as RootState).location.neighborhoods;
    if(!!neighborhoods.find(o => o.district_id === district_id)){
        return;
    }
    const res = await axios.get(`/neighborhoods/${district_id}`)
    thunkApi.dispatch(appendNeighborhoods(res.data.data as NeighborhoodModel[]));

});

export const locationSlice = createSlice({
    name: 'location',
    initialState,
    reducers: {
        initializeCities: (state, action: PayloadAction<CityModel[]>) => {
            state.cities = action.payload;
        },
        appendDistricts: (state, action: PayloadAction<DistrictModel[]>) => {
            state.districts = [...state.districts,...action.payload]
        },
        appendNeighborhoods: (state, action: PayloadAction<NeighborhoodModel[]>) => {
            state.neighborhoods = [...state.neighborhoods,...action.payload]
        },
    },
})
export const {initializeCities,appendDistricts,appendNeighborhoods} = locationSlice.actions;

export default locationSlice.reducer