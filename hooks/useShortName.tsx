import { useMemo } from "react";

export default function useShortName(prop : string|undefined|null) {
    const shortName = useMemo(() => {
        if (!prop)
            return "";
        let ret = "";
        prop.split(" ").forEach(str => {
            if (str.length > 0) {
                ret += str[0].toLocaleUpperCase('tr-TR')
            }
        })
        return ret;
    }, [prop])
    return shortName;

}