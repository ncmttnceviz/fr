import Box from "@mui/material/Box";
import Image from "next/image";
import HeroImage from "@/public/mock/homepage/hero.jpg";
import { Ref, RefObject, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function HeroD({ children}: { children?: any }) {
  
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "calc(100vh - 12px)",
        paddingBottom: 3,
        position: "relative",
        overflow: "hidden",
        backgroundColor: "rgba(17, 40, 72,0.3)",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'stretch',
      }}
    >
      <Image
        src={HeroImage}
        priority={true}
        layout="fill"
        objectFit="cover"
        style={{ zIndex: -1, width: "100%", maxHeight: "100%" }}
      />
      <Box
        sx={{
          
          width: 1,
          height: 1,
          position: "relative",
          top: 0,
          left: 0,
          display: "flex",
          flexGrow: 1,
          flexDirection: "column",
          justifyContent: "stretch",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
