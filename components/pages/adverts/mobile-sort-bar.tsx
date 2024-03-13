import { serializeFilterQuery } from "@/feature/makeFilterQuery";
import useCombineSx from "@/hooks/useCombineSx";
import { SortModel } from "@/models/option-models";
import { RootState } from "@/store";
import { handleCategoryModal } from "@/store/category-tree";
import { handleFilterModal, handleSortModal, setSortingType } from "@/store/filter";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {
  Button,
  ButtonGroup,
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  SxProps
} from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
export default function MobileSortBar({ sx, ...props }: { sx?: SxProps }) {
  const sort = useSelector((state: RootState) => state.filter.sortingValue);
  const sorts = useSelector((state: RootState) => state.filter.sortingTypes);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const a = useCombineSx(sx);
  const dispatch = useDispatch();
  const router = useRouter();
  const filterValues = useSelector((state: RootState) => state.filter.filterValues);
  const handleMenuItemClick = (
    sort: SortModel
  ) => {
    dispatch(setSortingType(sort))
    const filterQuery = serializeFilterQuery(filterValues,sort)
      router.push({pathname: '/ilanlar/[[...slug]]',query: {
        ...filterQuery,
        slug: router.query.slug
      }})
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };
  return (
    <ButtonGroup variant="outlined" color="secondary" fullWidth sx={[...a]}>
      <Button onClick={() => dispatch(handleCategoryModal(true))}>
        KATEGORİ
      </Button>
      <Button onClick={() => dispatch(handleFilterModal(true))}>FİLTRELE</Button>
      <Popper
        sx={{zIndex :5}}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {sorts.map((option, index) => (
                    <MenuItem
                      key={index}
                      disabled={sort.title == option.title }
                      selected={sort.title == option.title}
                      onClick={() => handleMenuItemClick(option)}
                    >
                      {option.title}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
      <Button
        size="small"
        ref={anchorRef}
        onClick={handleToggle}>SIRALA</Button>

    </ButtonGroup>
  );
}
