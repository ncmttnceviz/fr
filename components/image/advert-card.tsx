import useCombineSx from "@/hooks/useCombineSx";
import useTryFormatter from "@/hooks/useTryFormatter";
import { ListingAdvertModel } from "@/models/advert-model";
import {
  Card,
  CardMedia,
  Grid,
  SxProps,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Image from "next/image";
import NextLink from "next/link";
import useCombinedLocation from "@/hooks/useCombinedLocation";
import usePastTimeFormat from "@/hooks/usePastTimeFormat";
import DiamondIcon from '@mui/icons-material/Diamond';
import { ReactElement, useCallback } from "react";
import { StorageRounded } from "@mui/icons-material";
import ClampLines from 'react-clamp-lines';
export default function AdvertCard({
  sx,
  advert,
  configurable,
  children,
  ...props
}: {
  sx?: SxProps;
  advert: ListingAdvertModel
  configurable?: boolean
  children?: any
}) {
  const a = useCombineSx(sx);
  const tryFormatter = useTryFormatter();
  const location = useCombinedLocation(advert);
  const time = usePastTimeFormat(advert.created_at, advert);

  const card = (<Card
    component={advert.slug && !!!configurable ? "a" : "div"}
    sx={[
      {
        display: 'block',
        textDecoration: 'none',
        overflow: 'visible',
        position: "relative",
        transition: "0.4s all ease",
        borderRadius: 0,
        "& .MuiCardMedia-root": {
          transition: "0.4s all ease",
        },
        "& .hover-color": {
          color: "primary.main"
        },
        "&:hover": {
          
          backgroundColor: '#2c3e50',
          color: "white",
          "& .hidden-content": {
            opacity: 1,
          },
          "& .MuiCardMedia-root": {
            transform: "scale(1.09)",
          },
          "& .hover-color": {
            color: "secondary.main"
          }
        },
      },
      !!!configurable && {
        cursor: "pointer",
      },
      ...a,
    ]}
  >
    {/* Label */}
    <Box sx={{
      position: 'absolute',
      color: 'white',
      zIndex: 2,
      right: -5,
      top: 15,
      px: 1.7,
      
      py: 0.3,
      minWidth: '80px',
      display: 'inline-block',
      bgcolor: 'primary.main',
      typography: 'subtitle2',
      fontWeight: 600,
      '&::after': {
        position: 'absolute',
        right: 0,
        bottom: -5,
        width: 5,
        content: '""',
        borderTop: '5px solid black',
        borderTopColor: 'primary.dark',
        borderRight: '5px solid transparent',

      }
    }}>
      {!!advert.category_title && advert.category_title.toLocaleUpperCase('tr-TR')}
    </Box>

    {/* Vip Label */}
    {advert.is_vip && <Box sx={{
      position: 'absolute',
      color: 'white',
      zIndex: 2,
      right: -5,
      top: 50,
      px: 1.7,
      py: 0.3,
      bgcolor: 'info.main',
      typography: 'subtitle2',
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      columnGap: 1,
      '&::after': {
        position: 'absolute',
        right: 0,
        bottom: -5,
        width: 5,
        content: '""',
        borderTop: '5px solid black',
        borderTopColor: 'info.dark',
        borderRight: '5px solid transparent',

      }
    }}>
      <DiamondIcon fontSize="small" /> <span>VIP</span>
    </Box>}
    {/* Media */}
    <Box sx={{ position: "relative", overflow: "hidden" }}>
      <CardMedia


        sx={{
          overflow: "hidden",
        }}
      >
        <Image src={advert.image || "/mock/houses/none.jpg"} alt={advert.title} layout="responsive" objectFit="cover" height={240} width={410} />
      </CardMedia>
      <Box
        className="hidden-content"
        component={"article"}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1,
          height: 1,
          overflow: "hidden",

          opacity: 0,
          transition: "0.4s all ease",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      />
      <Box
        className="hidden-content"
        component={"article"}
        sx={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          bottom: "0",
          justifyContent: 'flex-end',
          left: 0,
          width: 1,
          height: 1,
          
       
          opacity: 0,
          transition: "0.4s all ease",
          color: (theme) => theme.palette.common.white,
        }}
      >
        <Box sx={{py: 2.5,
          px: 3.5,}}>

        {false && <Typography typography={"subtitle2"}>ALAN - 120m²</Typography>}
        <Typography
          typography={"subtitle2"}
          sx={{
            color: (theme) => theme.palette.grey[400],
            fontSize: 13,
            lineClamp: 2,
            textOverflow: "elipsis",
            overflow: "hidden",
          }}
        >
          {advert.description.substring(0, 100)}
        </Typography>
        <Box
          sx={{
            marginTop: 0.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            typography={"subtitle2"}
            sx={{
              color: "secondary.light",
              fontSize: 12,
            }}
          >
            {time}
          </Typography>
          <Typography
            typography={"subtitle2"}
            sx={{
              color: "currentColor",
              fontSize: 11,
              py: 0.4,
              px: 1,
              border: "1px solid white",
            }}
          >
            İNCELE
          </Typography>
        </Box>
        </Box>
      </Box>
    </Box>
    <Box
      sx={{
        py: 2,
        mx: 3.5,
        background:
          "url(/style/bg-border-dotted-horizontal.png) 0 100% repeat-x",
      }}
    >
      <Typography typography={"h6"} component="div" sx={{ fontSize: 17,lineHeight: 1,minHeight: "2em",overflow: 'hidden' }}>
      <ClampLines
        text={advert.title}
        id={`advert-title-${advert.id}`}
        lines={2}
        ellipsis="..."
        buttons={false}
        innerElement="div"
      />
      </Typography>
      <Typography typography={"p"} sx={{ fontSize: 17,minHeight: '2em',lineHeight: 1 }}>
        {location}
      </Typography>
      {children && <Box>
        {children}
      </Box>}
    </Box>
    <Box
      sx={{
        py: 2,
        mx: 3.5,
      }}
    >
      <Grid container rowSpacing={0} justifyContent="space-between">


        <Grid item>
          <Typography className="hover-color" sx={{ fontSize: 25, fontWeight: 700, lineHeight: 1.1 }}>
            {`${tryFormatter.format(advert.price)}`}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  </Card>
  );


  if (advert.slug && !!!configurable) {
    return <NextLink href={{ pathname: "/ilan/[slug]", query: { slug: advert.slug } }} passHref>
      {card}
    </NextLink>
  }
  return card;
}
