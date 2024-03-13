import { AuthContext } from "@/pages/_app";
import { handleLoginOrRegisterModal } from "@/store/auth";
import { handleMobileDrawer } from "@/store/mobile-drawer";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { Button } from "@mui/material";
import { useContext } from "react";
import { useDispatch } from "react-redux";

export default function UserButton() {
    const handleProfileButton =() =>{
        if(!authContext.user){
          dispatch(handleLoginOrRegisterModal(true))
        }
        else {
          dispatch(handleMobileDrawer(true))
        }
      }
      const dispatch = useDispatch();
      const authContext = useContext(AuthContext);
    return(
        <Button
                variant="text"
                startIcon={<PersonOutlineIcon />}
                onClick={handleProfileButton }
                sx={[
                  {
                    fontWeight: 400,
                    fontSize: "small",
                    color: "currentColor",
                    "&:hover": {
                      backgroundColor: "unset",
                    },
                  },
                ]}
              >
                {authContext.user ? `${authContext.user.fullname}`:"GİRİŞ YAP / KAYIT OL"}
              </Button>
    )

}