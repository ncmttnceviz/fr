import { alpha, Box, IconButton, Typography } from "@mui/material";
import Image from "next/image";
import {
  forwardRef,
  Ref,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import { useMemo } from "react";

export interface GalleryBoxController {
  setIndex: (index: number) => void;
  setOpen: (open: boolean) => void;
}
function GalleryBox(
  {
    images,
  }: {
    images: string[];
  },
  ref: Ref<GalleryBoxController>
) {
  const [index, setIndex] = useState<number>(0);
  const [isOpen, setOpen] = useState<boolean>(false);
  const controller = useMemo(
    () => ({
      setIndex(index: number) {
        let rindex = index;
        if (rindex > images.length - 1) {
          rindex = 0;
        } else if (rindex < 0) {
          rindex = images.length - 1;
        }
        setIndex(rindex);
      },
      setOpen(open: boolean) {
        setOpen(open);
      },
    }),
    []
  );
  useImperativeHandle(ref, () => controller);

  return (
    <Box
      sx={[
        {
          width: "100%",
          height: "100vh",
          bgcolor: alpha("#000000", 0.9),
          color: "white",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 99999,
        },
        !isOpen && {
          display: "none",
        },
      ]}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1,
          py: 1.5,
          px: { xs: 0, sm: 2 },
          pl: { xs: 1 },
          display: "flex",
          bgcolor: alpha("#000000", 0.4),
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography sx={{ typography: "subtitle2" }}>
          {`${index + 1}/${images.length}`}
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
          }}
        >
          <IconButton
            aria-label="close"
            sx={{ color: "currentcolor" }}
            onClick={() => setOpen(false)}
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: 1,
          width: 1,
          px: { xs: 0, sm: 2 },
        }}
      >
        <IconButton
          aria-label="next"
          sx={{ color: "currentcolor" }}
          onClick={() => controller.setIndex(index - 1)}
        >
          <ChevronLeftIcon sx={{ fontSize: { xs: "2rem", sm: "2.5rem" } }} />
        </IconButton>
        <Box
          sx={{
            width: "80vw",
            height: "80vh",
            maxWidth: 1440,
            position: "relative",
          }}
        >
          <Image layout="fill" objectFit="contain" priority src={images[index]} />
        </Box>
        <IconButton
          aria-label="next"
          sx={{ color: "currentcolor" }}
          onClick={() => controller.setIndex(index + 1)}
        >
          <ChevronRightIcon sx={{ fontSize: { xs: "2rem", sm: "2.5rem" } }} />
        </IconButton>
      </Box>
    </Box>
  );
}
export default forwardRef(GalleryBox);
