import { SxProps, Theme } from "@mui/material";

export default function(sx? : SxProps<Theme>) {
    return sx ? (Array.isArray(sx) ? sx as Array<any> : [sx]) : [];
}