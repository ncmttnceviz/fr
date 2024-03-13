import { FilterValueModel, OptionModel, sortingTypes, SortModel } from "@/models/option-models";
import { ParsedUrlQuery } from "querystring";

export function serializeFilterQuery(values: FilterValueModel[],sort?: SortModel) {
    const query: any = {};
    for (let i = 0; i < values.length; i++) {
        const value = values[i];
        if(value.optionId && value.value) {
            
            let val = value.value;
            if((value.type=="price" || value.type=="range")){
                if(val == ",") {
                    continue;
                }
                else if(val.endsWith(",")) {
                    val +="999999999"
                }
                else if(val.startsWith(",")) {
                    val = "0"+val;
                }
            }
            val = val.replaceAll(',',"--");;
            let optionId = 'f'+value.optionId;
            if(!isNaN(new Number(value.optionId).valueOf())) {
                optionId = optionId+"."+value.type
            }
            query[optionId] = val;
        }
    }
    if(sort) {
        if(!(sort.sortBy == 'created_at' && sort.direction == 'last')) {
            query['sort_by'] = sort.sortBy;
            query['sort'] = sort.direction;
        }
    }
    return query;
}

export function prepareFilterQueryForBackend(query: ParsedUrlQuery) {
    const queryParams:any = {per_page: 16};
    const postData:any = {};
    if(query.page) {
        queryParams.page = query.page;
    }
    if(!(query.sort_by == 'created_at' && query.sort == 'last')){
        if(query.sort_by) {
            queryParams.sort_by = query.sort_by;
        }
        if(query.sort) {
            queryParams.sort = query.sort;
        }
    }
    const keys = Object.keys(query).filter(o => o && o.match(/f[0-9]+.[A-Za-z]+|f[A-Za-z]+/gm));
    let bdc = 0;
    for (let i = 0; i < keys.length; i++) {
        const val = query[keys[i]];
        if(val && typeof val === 'string') {
            const key = keys[i].replace("f","");
            const backendData = {
                id: "0",
                type: "",
                values: val.replaceAll("--",","),
            }
            
    
            if(key.includes(".")) {
                const [type,id] = key.split('.');
                backendData.type = type;
                backendData.id = id;
            }
            else {
                backendData.type = key;
            }
            postData[`filter[${bdc}][id]`] = backendData.id;
            postData[`filter[${bdc}][type]`] = backendData.type;
            postData[`filter[${bdc}][values]`] = backendData.values;
            bdc++;
        }
        
        
    }
    return {...queryParams,...postData};
    
}

export function readFilterQuery(options: OptionModel[],query: any) {
    const defaultFilterValues = [];
    const defaultSort = sortingTypes.find(o => o.direction == query.sort && o.sortBy == query.sort_by) ||null;
    for (let i = 0; i < options.length; i++) {
        const option = options[i];
        const optionId = (option.special ? option.type : option.id);
        const queryId = "f"+ (option.special ? optionId: optionId+"."+option.type)
      
        
        if(query[queryId]) {

            
            const str: string = query[queryId]
            
            if(str) {
                
                switch (option.type) {
                    case 'input': 
                    case 'search':
                        defaultFilterValues.push({optionId,value: str,type: option.type} as FilterValueModel)
                    case 'select':
                    case 'city':
                        if(!Number.isNaN(str)) {
                             defaultFilterValues.push({optionId,value: str,type: option.type} as FilterValueModel)
                        }
                        break;
                    case 'checkbox':
                    case 'district':
                    case 'neighborhood':
                    case 'price':
                    case 'range':
                        
                        if(/(?:\(d*\)|[^,])+/gm.test(str.replaceAll("--",","))) {
                            defaultFilterValues.push({optionId,value: str.replaceAll("--",","),type: option.type} as FilterValueModel)
                        }
                
                    default:
                        break;
                }
            }
        }

        
    }

    return {defaultFilterValues,defaultSort}
}