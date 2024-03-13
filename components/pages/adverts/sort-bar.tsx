import SolidInputLight from "@/components/form/solid-input-light";
import { serializeFilterQuery } from "@/feature/makeFilterQuery";
import useCombineSx from "@/hooks/useCombineSx";
import { RootState, useAppDispatch } from "@/store";
import { handleCategoryModal } from "@/store/category-tree";
import { setSortingType } from "@/store/filter";
import {
  alpha,
  Box, FormControl, MenuItem,
  Select,
  SelectChangeEvent,
  SxProps,
  Typography
} from "@mui/material";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
export default function SortBar({ sx, ...props }: { sx?: SxProps }) {
  const dispatch = useDispatch();
  const a = useCombineSx(sx);
  return (
    <Box
      sx={[
        {
          display: "flex",
          gap: 1,
          alignItems: "center",
          justifyContent: 'space-between',
          width: 1,
          px: 3,
          py: 1.5,
          bgcolor: "secondary.main",
        },
        ...a,
      ]}
    >
      <Box sx={{ display: "flex", alignItems: "center",gap: 1 }}>
        <Typography typography={"subtitle2"}>SIRALAMA:</Typography>
        <SortSelectInput/>
      </Box>
      <Box component="button"
      onClick={() => dispatch(handleCategoryModal(true))}
      sx={{
        px: 3,
        py:1.1,
        bgcolor: 'transparent',
        border: "1px solid white",
        color: 'white',
        typography: 'subtitle2',
        fontSize: '0.9rem',
        lineHeight: 1,
        cursor: 'pointer',
        '&:hover':{
          bgcolor: () => alpha('#000000',0.05)
        },
        '&:active':{
          bgcolor: () => alpha('#000000',0.15)
        },
        
      }}>
            KATEGORİ
      </Box>
    </Box>
  );
}

function SortSelectInput({
}: {
  
}) {
  const sort = useSelector((state: RootState) => state.filter.sortingValue);
  const sorts = useSelector((state: RootState) => state.filter.sortingTypes);
  const dispatch = useAppDispatch();
  const filterValues = useSelector((state: RootState) => state.filter.filterValues);
  const router = useRouter();
  const onChange = (ev: SelectChangeEvent<string>) => {
    let value = ev.target.value;
    const find = sorts.find(o => o.title == value);
    if(find) {
      dispatch(setSortingType(find));
      const filterQuery = serializeFilterQuery(filterValues,find)
      router.push({pathname: '/ilanlar/[[...slug]]',query: {
        ...filterQuery,
        slug: router.query.slug
      }})
    }
}
  return (
    <FormControl
      variant="standard"
      color="secondary"
      fullWidth
      sx={{
        maxWidth: 280,
        label: {
          color: "white !important",
        },
        "MuiMenuItem-root.Mui-selected": {
          bgcolor: "grey.200",
        },
      }}
    >
      <Select
        color="secondary"
        
      value={sort?.title}
        onChange={onChange}
        input={
          <SolidInputLight
            fullWidth
            color="secondary"
         
          />
        }
      >
        {sorts.map((value, key) => (
            <MenuItem color="secondary" key={key} value={value.title}>
              {value.title}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
}
