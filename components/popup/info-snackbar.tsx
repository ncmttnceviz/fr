import { RootState } from "@/store";
import { closeInfoSnackbar } from "@/store/info-snackbar";
import { Alert, Snackbar } from "@mui/material";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

export default function InfoSnackbar() {

    const dispatch = useDispatch();
    const open = useSelector((state: RootState) => state.infoSnackbar.open)
    const message = useSelector((state: RootState) => state.infoSnackbar.message)
    const severity = useSelector((state: RootState) => state.infoSnackbar.severity)
    const handleClose = () =>{
        dispatch(closeInfoSnackbar());
    }
    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    )

}