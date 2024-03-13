import { Alert, Link, Snackbar, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import NextLink from "next/link";
export default function CookieSnackbar() {
    const [closeClicked,setCloseClicked] = useState<boolean>(false);
    const open = useMemo(() => {
        if (typeof window !== 'undefined') {
            return !!!localStorage.getItem('cookie');
        }
        return false;
    }, [closeClicked]);
    const handleClose = () => {
        localStorage.setItem('cookie', "1");
        setCloseClicked(true);
    }
    if(typeof window === 'undefined') {
        return null;
    }
    return (
        <Snackbar open={open} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} >
            <Alert onClose={handleClose} severity={"info"} sx={{ width: '100%' }}>
                <Typography sx={{ typography: 'body2' }}>
                    Bu internet sitesinde çerezler kullanılmaktadır.
                </Typography>
                <Typography sx={{ typography: 'body2' }}>
                    Çerezler hakkında detaylı bilgi almak için
                    <NextLink href="/cerez-politikasi" passHref>
                        <Link sx={{color: 'info.dark',textDecorationColor: (theme) => theme.palette.info.dark,ml:0.5}}>
                            Çerez Politikası
                        </Link>
                    </NextLink>
                    ’nı inceleyebilirsiniz.
                </Typography>

            </Alert>
        </Snackbar>
    )

}