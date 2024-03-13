import useClientAxios from "@/hooks/useClientAxios";
import useCombineSx from "@/hooks/useCombineSx";
import { AuthContext } from "@/pages/_app";
import deleteFavorite from "@/requests/deleteFavorite";
import postFavorite from "@/requests/postFavorite";
import { handleLoginOrRegisterModal, handleLoginOrRegisterModalTab } from "@/store/auth";
import { openInfoSnackbar } from "@/store/info-snackbar";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { CircularProgress, IconButton, SxProps } from "@mui/material";
import { useCallback, useContext, useState } from "react";
import { useDispatch } from "react-redux";

export interface FavoriteButtonProps {
  sx?: SxProps;
  initialValue?: boolean;
  advertId: string;
}
export default function FavoriteButton({
  sx,
  initialValue,
  advertId
}: FavoriteButtonProps) {
  const sxx = useCombineSx(sx);
  const [value, setValue] = useState<boolean>(!!initialValue);
  const [loading,setLoading] = useState<boolean>(false);
  const actx = useContext(AuthContext);
  const dispatch = useDispatch();
  const axios = useClientAxios(actx.user);
  const handleClick = useCallback(async () => {
    if(!actx.user) {
      dispatch(handleLoginOrRegisterModal(true))
      dispatch(handleLoginOrRegisterModalTab(0))
      dispatch(openInfoSnackbar({message: "İlanları favori listenize kaydetmek için lütfen giriş yapın.",severity: "info"}))
      return;
    }
    setLoading(false);
    try {
        const fn = !!value ? deleteFavorite: postFavorite;
        const message = !!value ? "İlan favorilerden kaldırıldı": "İlan favorilere eklendi";
        await fn(axios,advertId);
        setValue(val => !!!val);
        dispatch(openInfoSnackbar({message, severity: "success"}));


    }
    catch{

    }
    finally {
        setLoading(false);
    }
  },[value,actx.user])
  return (
    <IconButton sx={[...sxx]} color="secondary" disabled={loading} onClick={handleClick}>
      {!loading ? (value ? <Favorite /> : <FavoriteBorder/>):<CircularProgress size={24} color="secondary" />}
    </IconButton>
  );
}
