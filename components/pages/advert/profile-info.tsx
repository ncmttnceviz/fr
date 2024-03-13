import UserAvatar from "@/components/content/user-avatar";
import BlockButton from "@/components/form/block-button";
import { AdvertUserModel } from "@/models/advert-model";
import { Box, CardContent, Link } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useMemo } from "react";

export function ProfileInfo( {user}:{user: AdvertUserModel}) {

    const fullWhatsapp = useMemo(() =>`90${user.whatsapp}`,[user])
    const phone = useMemo(() =>`+90${user.advert_phone}`,[user])
    return (
      <CardContent>
        <UserAvatar
          src={user.image}
          fallbackName={user.fullname}
        >
         {user.fullname.toLocaleUpperCase('tr-TR')}
        </UserAvatar>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            rowGap: 1,
            mt: 2,
          }}
        >
          <Link href={"tel:" + phone}>
            <BlockButton color="secondary" sx={{ maxWidth: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  columnGap: 1,
                }}
              >
                <PhoneIcon fontSize="small" />
                <span>{user.advert_phone}</span>
              </Box>
            </BlockButton>
          </Link>
          <Link
            sx={{ textDecoration: "none" }}
            href={
              "https://api.whatsapp.com/send?phone=" +
              fullWhatsapp
            }
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <BlockButton color="success" sx={{ maxWidth: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  columnGap: 1,
                }}
              >
                <WhatsAppIcon fontSize="small" />
                <span>WHATSAPP</span>
              </Box>
            </BlockButton>
          </Link>
        </Box>
      </CardContent>
    )
  }
  