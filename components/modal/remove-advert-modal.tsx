import useClientAxios from "@/hooks/useClientAxios";
import { ConfigurableAdvertModel } from "@/models/advert-model";
import { AuthContext } from "@/pages/_app";
import deleteSelfAdvert from "@/requests/deleteSelfAdvert";
import { openInfoSnackbar } from "@/store/info-snackbar";
import CloseIcon from "@mui/icons-material/Close";
import {
  Card,
  CardContent,
  Divider,
  IconButton,
  Modal, Typography
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useState
} from "react";
import { useDispatch } from "react-redux";
import BlockButton from "../form/block-button";

export interface RemoveAdvertModalControls {
  open: (advert: ConfigurableAdvertModel) => void;
}

const RemoveAdvertModal = forwardRef<
  RemoveAdvertModalControls,
  { onSuccess?: (advert: ConfigurableAdvertModel) => void }
>(({ onSuccess }, ref) => {
  const isSSR = typeof window === "undefined";
  const dispatch = useDispatch();
  const actx = useContext(AuthContext);
  const axios = useClientAxios(actx.user);
  const [isOpen, setOpen] = useState<boolean>(false);
  const [advert, setAdvert] = useState<ConfigurableAdvertModel | null>(null);
  const [isLoading,setLoading] = useState<boolean>(false);
  const router = useRouter();

  useImperativeHandle(
    ref,
    () =>
      ({
        open(advert) {
          setAdvert(advert);
          setOpen(true);
        },
      } as RemoveAdvertModalControls)
  );
  useEffect(() => {
    if(!isOpen) {
      setAdvert(null);
    }
  }, [isOpen])
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      setOpen(false);
    };

    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, []);

  const handleConfirmRemove = useCallback(async () => {
    if(advert) {
      setLoading(true);
      try {
        const res = await deleteSelfAdvert(axios,""+advert.id);
        onSuccess && onSuccess(advert);
        dispatch(
          openInfoSnackbar({ message: "İlan başarı ile sistemden silindi.", severity: "success" })
        );
      } catch (error) {
        openInfoSnackbar({ message: "Bir sorun oluştu. Lütfen daha sonra tekrar deneyin.", severity: "error" })
      }
      finally {
        setLoading(false);
        setOpen(false);
      }
    }
  },[advert])

  return (
    <Modal open={isOpen} disablePortal={isSSR}>
      <Card
        sx={{
          position: "absolute",
          transform: "translate(-50%,-50%)",
          userSelect: "none",
          display: "flex",
          flexDirection: "column",
          justifyContent: "stretch",
          top: "50%",
          left: "50%",
          width: (theme) => `calc(100% - ${theme.spacing(4)})`,
          maxWidth: 380,
          maxHeight: { xs: "90vh", sm: 680 },
        }}
      >
        <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
          
          <Typography sx={{ typography: "h6", display: "inline-block" }}>
            İlanı Sil
          </Typography>
          <IconButton
            onClick={() => setOpen(false)}
          >
            <CloseIcon />
          </IconButton>
        </CardContent>
        <Divider />
        <CardContent>
        {advert?.image && <Image layout="responsive" width={380} height={200} src={advert.image}/>}
          <Typography sx={{ typography: "body1", type: "tel",my: 2, }}>
            <strong>{advert?.title}</strong> adlı ilanı sistemimizden kalıcı olarak silmek istediğinize emin misiniz ?
          </Typography>
          <Typography sx={{ typography: "body1", type: "tel" }}>
            İlan için ödenmiş ücretler geri <u>iade edilmeyecektir</u> .
          </Typography>

          <BlockButton disabled={isLoading} onClick={handleConfirmRemove} type="submit" sx={{ maxWidth: 1, mt: 2 }}>
            {isLoading ? "LÜTFEN BEKLEYİN" : "İLANI KALICI OLARAK SİL"}
          </BlockButton>
        </CardContent>
      </Card>
    </Modal>
  );
});

export default RemoveAdvertModal;
