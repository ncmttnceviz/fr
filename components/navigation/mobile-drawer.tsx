import { AuthContext } from "@/pages/_app";
import { RootState } from "@/store";
import { handleMobileDrawer } from "@/store/mobile-drawer";
import {
  Avatar,
  Box,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import HomeIcon from "@mui/icons-material/Home";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import WarningIcon from "@mui/icons-material/Warning";
import ListAltIcon from "@mui/icons-material/ListAlt";
import InventoryIcon from "@mui/icons-material/Inventory";
import PersonIcon from '@mui/icons-material/Person';
import { UserModel } from "@/models/auth-models";
import { useRouter } from "next/router";
import useIsLinkActive from "@/hooks/useIsLinkActive";
import Link from "next/link";
import { removeCookies } from "cookies-next";
import {
  handleEmailVerificationModal,
  handleLoginOrRegisterModal,
  handleSmsVerificationModal,
} from "@/store/auth";
import useShortName from "@/hooks/useShortName";
import { openInfoSnackbar } from "@/store/info-snackbar";
import UserAvatar from "../content/user-avatar";
import { Favorite, FavoriteOutlined } from "@mui/icons-material";
export default function MobileDrawer() {
  const dispatch = useDispatch();
  const open = useSelector(
    (state: RootState) => state.mobileDrawer.mobileDrawer
  );
  const actx = useContext(AuthContext);
  const router = useRouter();
  const iOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);
  const canAddNewAdverts = useMemo(() => {
    return actx.user && actx.user.phone_verified && actx.user.email_verified;
  }, [actx.user]);
  useEffect(() => {
    dispatch(handleMobileDrawer(false));
  }, [router.asPath]);
  const handleLogout = () => {
    removeCookies("token");
    dispatch(
      openInfoSnackbar({
        message: "Başarı ile çıkış yaptınız.",
        severity: "info",
      })
    );
    dispatch(handleMobileDrawer(false));
    router.replace(router.asPath);
  };
  const handleLoginOrRegister = () => {
    dispatch(handleLoginOrRegisterModal(true));
  };

  return (
    <SwipeableDrawer
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      anchor="right"
      open={open}
      onOpen={() => dispatch(handleMobileDrawer(true))}
      onClose={() => dispatch(handleMobileDrawer(false))}
    >
      <Box
        sx={{
          minWidth: { xs: 220, sm: 280 },
          width: 1,
          maxWidth: "90vw",
          py: 2,
          display: "flex",
          flexDirection: "column",
          rowGap: 1,
        }}
      >
        {actx.user && (
          <UserAvatar
            src={actx.user?.image?.small}
            fallbackName={actx.user.fullname}
          >
            {actx.user.fullname.toLocaleUpperCase('tr-TR')}
          </UserAvatar>
        )}
        {actx.user && <Divider />}
        <List>
          {!!!actx?.user && (
            <DrawerListItem
              icon={<PersonOutlineIcon />}
              onClick={handleLoginOrRegister}
            >
              Giriş Yap / Kayıt Ol
            </DrawerListItem>
          )}
          {actx.user && !actx.user.email_verified && (
            <DrawerListItem
              onClick={() => dispatch(handleEmailVerificationModal(true))}
              warning
              icon={<WarningIcon />}
            >
              E-Posta Adresinizi Onaylayın
            </DrawerListItem>
          )}
          {actx.user && !actx.user.phone_verified && (
            <DrawerListItem
              onClick={() => dispatch(handleSmsVerificationModal(true))}
              warning
              icon={<WarningIcon />}
            >
              Telefon Numaranızı Onaylayın
            </DrawerListItem>
          )}
          <DrawerListItemLink href="/" icon={<HomeIcon />}>
            Anasayfa
          </DrawerListItemLink>
          <DrawerListItemLink href="/ilanlar" icon={<LocationCityIcon />}>
            İlanlar
          </DrawerListItemLink>
          {actx.user && !canAddNewAdverts && (
            <DrawerListItem
              onClick={() =>
                dispatch(
                  openInfoSnackbar({
                    severity: "error",
                    message:
                      "İlan ekleyebilmek için e-posta ve telefon bilgilerinizi onaylamanız gerekmekte.",
                  })
                )
              }
              icon={<AddBusinessIcon />}
            >
              Yeni İlan
            </DrawerListItem>
          )}
          {actx.user && canAddNewAdverts && (
            <DrawerListItemLink href="/yeni-ilan" icon={<AddBusinessIcon />}>
              Yeni İlan
            </DrawerListItemLink>
          )}
          {actx.user && (
            <DrawerListItemLink href="/ilanlarim" icon={<ListAltIcon />}>
              İlanlarım
            </DrawerListItemLink>
          )}
          {actx.user && (
            <DrawerListItemLink href="/favoriler" icon={<Favorite />}>
              Favoriler
            </DrawerListItemLink>
          )}
           {actx.user && (
            <DrawerListItemLink href="/profilim" icon={<PersonIcon />}>
              Profilim
            </DrawerListItemLink>
          )}
          {actx.user && (
            <DrawerListItemLink href="/paketler" icon={<InventoryIcon />}>
              Paketler
            </DrawerListItemLink>
          )}
          {actx.user && (
            <DrawerListItem icon={<LogoutIcon />} onClick={handleLogout}>
              Çıkış Yap
            </DrawerListItem>
          )}
        </List>
      </Box>
    </SwipeableDrawer>
  );
}
const DrawerListItem = ({
  children,
  icon,
  onClick,
  warning,
  disabled,
}: {
  disabled?: boolean;
  warning?: boolean;
  children?: any;
  icon: any;
  onClick?: any;
}) => {
  return (
    <ListItem
      disablePadding
      disabled={disabled}
      sx={[
        {
          "&:hover .MuiAvatar-root": {
            bgcolor: !!warning ? "warning.main" : "secondary.main",
          },
        },
        !!warning && {
          "& .MuiAvatar-root": {
            bgcolor: "warning.main",
          },

          "&:hover .MuiAvatar-root": {
            bgcolor: "warning.main",
          },
        },
      ]}
      onClick={onClick}
    >
      <ListItemButton>
        <ListItemAvatar>
          <Avatar variant="rounded">{icon}</Avatar>
        </ListItemAvatar>
        <ListItemText>{children}</ListItemText>
      </ListItemButton>
    </ListItem>
  );
};
const DrawerListItemLink = ({
  href,
  children,
  nested,
  icon,
  disabled,
}: {
  disabled?: boolean;
  href: string;
  children?: any;
  nested?: boolean;
  icon: any;
}) => {
  const isActive = useIsLinkActive(href, !!nested);
  return (
    <Link href={href} passHref>
      <ListItem
        component="a"
        disabled={disabled}
        disablePadding
        sx={{
          color: "currentcolor",
          "&:hover .MuiAvatar-root": {
            bgcolor: "secondary.main",
          },
        }}
      >
        <ListItemButton selected={isActive}>
          <ListItemAvatar>
            <Avatar
              variant="rounded"
              sx={[isActive && { bgcolor: "primary.main" }]}
            >
              {icon}
            </Avatar>
          </ListItemAvatar>
          <ListItemText>{children}</ListItemText>
        </ListItemButton>
      </ListItem>
    </Link>
  );
};
