import { BaseCategoryModel } from "@/models/category-model";
import { RootState } from "@/store";
import { handleCategoryModal } from "@/store/category-tree";
import { Modal } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import CategoryNavigatior from "../navigation/category-navigator";

export default function CategoryModal({
  category,
  linked,
  onChange
}: {
  category?: BaseCategoryModel;
  linked: boolean;
  onChange?: (category?: BaseCategoryModel) => void;
}) {
  const isSSR = typeof window === "undefined";
  const dispatch = useDispatch();
  const isOpen = useSelector(
    (state: RootState) => state.categoryTree.categoryModal
  );
  return (
    <Modal
      open={isOpen}
      onClose={() => dispatch(handleCategoryModal(false))}
      disablePortal={isSSR}
    >
      <div>
        <CategoryNavigatior
          linked={linked}
          category={category}
          onChange={onChange}
          sx={{
            position: "absolute",
            transform: "translate(-50%,-50%)",
            top: "50%",
            left: "50%",
            width: (theme) => `calc(100% - ${theme.spacing(4)})`,
            maxWidth: 380,
            height: 1,
            maxHeight: { xs: "90vh", sm: 680 },
          }}
        />
      </div>
    </Modal>
  );
}
