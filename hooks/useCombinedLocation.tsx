import { BaseAdvertModel } from "@/models/advert-model";
import { useMemo } from "react";

export default function useCombinedLocation(advert: BaseAdvertModel) {
    const location = useMemo(() =>
    [advert?.city, advert?.district, advert?.neighborhood].filter(o => o).map(o => o.trim()).join(", ")
    , [advert])
    return location;
}