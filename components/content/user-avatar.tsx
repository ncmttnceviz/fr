import useCombineSx from "@/hooks/useCombineSx";
import useShortName from "@/hooks/useShortName";
import { Avatar, Box, SxProps, Typography } from "@mui/material";

export default function UserAvatar({
  src,
  fallbackName,
  children,
  size,
  sx
}: {
  sx?: SxProps
  src?: string;
  fallbackName: string;
  children?: any;
  size?:number;
}) {
  const sxx = useCombineSx(sx);
  const avatarName = useShortName(fallbackName || "");
  return (
    <Box
      sx={[
        {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          rowGap: 2,
        },
        ...sxx
      ]}
    >
      <Avatar
        src={src}
        sx={{
          width: size || 100,
          height: size || 100,
          fontSize: "2rem",
          bgcolor: "primary.main",
        }}
      >
        {!!!src && avatarName}
      </Avatar>
      {children && <Typography sx={{ typography: "subtitle2",zIndex: 0 }}>{children}</Typography>}
    </Box>
  );
}
