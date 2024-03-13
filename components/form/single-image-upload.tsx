import useCombineSx from "@/hooks/useCombineSx";
import { Box, Button, ButtonProps, Grid, Typography } from "@mui/material";
import Image from "next/image";
import {
  ChangeEvent,
  ChangeEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
export default function SingleImageUpload({
  sx,
  onChange,
  error,
  ...props
}: ButtonProps & {
  onChange: (
    item: { file: File; preview: string; size: number } | undefined
  ) => void;
  error?: any;
}) {
  const a = useCombineSx(sx);
  const [item, setItem] = useState<{
    file: File;
    preview: string;
    size: number;
  }>();
  const [touched, setTouched] = useState<boolean>(false);
  const ref = useRef<HTMLInputElement | null>(null);
  useEffect(() => onChange(item), [item]);
  const er = useMemo(() => {
    if (!touched) {
      return null;
      
    }
    return error?.file;
  }, [error,touched]);
  
  

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    setTouched(true);
    if (files?.length) {
      const file = files.item(0);
      if (!file) {
        return;
      }
      const size = file.size / 1024;
      const item = { file, preview: URL.createObjectURL(file), size };

      setItem(item);
    } else {
      setItem(undefined);
    }

  };

  return (
    <Box>
      <input
        ref={ref}
        onChange={handleInputChange}
        type={"file"}
        style={{ display: "none" }}
        accept=".png, .jpg, .jpeg"
      />
      <Button
        onClick={() => ref.current && ref.current.click()}
        fullWidth
        variant="contained"
        {...props}
        disableElevation
        sx={[
          {
            display: "flex",
            width: "100%",
            maxWidth: 340,
            px: 2,
            py: 1.2,
            mb: 1,
            mx: "auto",
            borderRadius: 0,
            borderBottom: "5px solid rgba(0,0,0,0.25)",
          },
          ...a,
        ]}
      >
        {props.children}
      </Button>
      {!!er && (
        <Typography
          sx={{
            typography: "body2",
            color: "error.main",
            my: 1,
            textAlign: "center",
          }}
        >
          {er}
        </Typography>
      )}
    </Box>
  );
}
