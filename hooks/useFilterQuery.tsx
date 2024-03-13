import { serializeFilterQuery } from "@/feature/makeFilterQuery";
import { RootState } from "@/store";
import { useMemo } from "react";
import { useSelector } from "react-redux";

export default function useFilterQuery() {
    const filterValues = useSelector((state: RootState) => state.filter.filterValues);
    const sortValue = useSelector((state: RootState) => state.filter.sortingValue);
    const filterQuery = useMemo(() => {
        return serializeFilterQuery(filterValues, sortValue)
    }, [filterValues, sortValue])
    return filterQuery;
}