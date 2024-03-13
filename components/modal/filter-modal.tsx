import CategoryModel from "@/models/category-model";
import { RootState } from "@/store";
import { handleFilterModal } from "@/store/filter";
import { Box, Divider, IconButton, Modal, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CategoryForm from "../form/category-form";
import CloseIcon from "@mui/icons-material/Close";

export default function FilterModal({ category }: { category: CategoryModel }) {
  const isSSR = typeof window === 'undefined';
  const dispatch = useDispatch();
  const isOpen = useSelector(
    (state: RootState) => state.filter.filterModal
  );

  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      dispatch(handleFilterModal(false));
    };

    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, []);
  return (
    <Modal open={isOpen} onClose={() => dispatch(handleFilterModal(false))} disablePortal={isSSR}>

      <Box
        sx={{
          position: "absolute",
          transform: "translate(-50%,-50%)",
          top: "50%",
          left: "50%",
          width: (theme) => `calc(100% - ${theme.spacing(4)})`,
          maxWidth: 380,
          height: 1,
          maxHeight: { xs: "90vh", sm: 680 },
          overflow: 'auto',
          "&::-webkit-scrollbar": {
            width: (theme: any) => theme.spacing(1.5),
          },
          "&::-webkit-scrollbar-track": {
            background: "rgba(0,0,0,.05)",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(0,0,0,.1);",
          },
          bgcolor: 'white'
        }}
      >
        <CategoryForm sx={{ height: 'auto',border: 0 }} category={category} >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ typography: "h6",display: 'inline-block' }}>Filtrele</Typography>
          <IconButton onClick={() => dispatch(handleFilterModal(false))}>
            <CloseIcon />
          </IconButton>
        </Box>
          </CategoryForm>

      </Box>


    </Modal>
  );
}
