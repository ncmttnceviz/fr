import useCombineSx from "@/hooks/useCombineSx";
import {
  alpha,
  Box,
  Button,
  ButtonProps,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import Image from "next/image";
import {
  ChangeEvent,
  ChangeEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

export interface ImageToBeUploaded {
  file: File;
  preview: string;
  size: number;
}
export interface UploadedImage {
  small: string;
}
export default function ImageUpload({
  sx,
  onChange,
  onImageSelect,
  onDelete,
  sortable,
  selectable,
  error,
  initialImages,
  initialSelected,
  ...props
}: ButtonProps & {
  onChange: (items: (ImageToBeUploaded | UploadedImage)[]) => void;
  error?: any;
  sortable?: boolean;
  selectable?: boolean;
  onDelete?: (item: ImageToBeUploaded | UploadedImage) => void;
  initialImages?: UploadedImage[];
  initialSelected?: UploadedImage;
  onImageSelect?: (item: ImageToBeUploaded | UploadedImage | null) => void;
}) {
  const a = useCombineSx(sx);
  const [items, setItems] = useState<(ImageToBeUploaded | UploadedImage)[]>(initialImages ?[...initialImages]:  []);
  const [selected, setSelected] = useState<
    ImageToBeUploaded | UploadedImage | null
  >(initialSelected || null);
  const [touched, setTouched] = useState<boolean>(false);
  const ref = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    onChange(items);
  }, [items]);
  useEffect(() => {
    if (!!selectable && !!onImageSelect) {
      onImageSelect(selected);
    }
  }, [selected]);
  const er = useMemo(() => {
    if (!touched) {
      return null;
    }
    if (typeof error == "string") {
      return error;
    } else if (Array.isArray(error)) {
      return error[0].file;
    }
    return null;
  }, [error, touched]);
  const hasUploadedImages = useMemo(() => items.some((o:any) => o.small),[items])
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    
    setTouched(true);
    if (files) {
      const arr: ImageToBeUploaded[] = [];
      for (let i = 0; i < files.length; i++) {
        let file = files.item(i);

        if (file) {
          const size = file.size / 1024;
          arr.push({ file, preview: URL.createObjectURL(file), size });
        }
      }
      if (hasUploadedImages) {
        setItems((items) => [...items, ...arr]);
      } else {
        setItems(arr);
      }
      if (selectable && arr?.length) {
        if (hasUploadedImages) {
          selectable && onImageSelect && onImageSelect(selected);
        } else {
          setSelected(arr[0]);
        }
      }
    } else if (!hasUploadedImages) {
      setItems([]);
      if (selectable) {
        setSelected(null);
      }
    }
  };
  const handleSelect = (item: ImageToBeUploaded | UploadedImage) => {
    if (selectable) {
      setSelected(item);
    }
  };

  const handleSort = (
    item: ImageToBeUploaded | UploadedImage,
    increase: boolean
  ) => {
    const fromIndex = items.indexOf(item);
    if (
      !items ||
      items.length < 2 ||
      fromIndex == -1 ||
      (fromIndex == 0 && !increase) ||
      (fromIndex == items.length - 1 && increase)
    ) {
      return;
    }
    const toIndex = increase ? fromIndex + 1 : fromIndex - 1;
    const workArray = [...items];
    workArray.splice(
      toIndex,
      1,
      workArray.splice(fromIndex, 1, workArray[toIndex])[0]
    );
    setItems(workArray);
    if (selectable && onImageSelect) {
      onImageSelect(item);
    }
  };

  const handleDelete = (item: ImageToBeUploaded | UploadedImage) => {
    setItems((items) => {
      const newItems = items.filter((o) => o !== item);
      setSelected(newItems.find((o) => o == selected) || newItems.length > 0 ? newItems[0] : null);
      return newItems;
    });

    onDelete && onDelete(item);
  };

  const getSrc = useCallback((item: ImageToBeUploaded | UploadedImage) => {
    const a = item as any;
    return a?.preview || a?.small;
  }, []);

  return (
    <Box>
      <input
        ref={ref}
        onChange={handleInputChange}
        type={"file"}
        multiple
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
        <Typography sx={{ typography: "body2", color: "error.main", my: 1 }}>
          {er}
        </Typography>
      )}
      <Grid container spacing={1}>
        {items.map((item, key) => (
          <Grid item xs={6} sm={4} md={3} key={key}>
            <Box
              sx={{
                position: "relative",
                cursor: selectable ? "pointer" : "inherit",
              }}
            >
              <Image
                src={getSrc(item)}
                width="100"
                height="100"
                layout="responsive"
                objectFit="cover"
              />
              {selectable && (
                <Box
                  onClick={() => handleSelect(item)}
                  sx={{
                    width: 1,
                    height: 1,
                    top: 0,
                    left: 0,
                    position: "absolute",
                  }}
                ></Box>
              )}
              {selectable && selected == item && (
                <Box
                  sx={{
                    width: 1,
                    height: 1,
                    top: 0,
                    left: 0,
                    position: "absolute",
                    border: "3px solid black",
                    borderColor: "primary.main",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    p: 0.2,
                    bgcolor: (theme) => alpha(theme.palette.primary.dark, 0.4),
                  }}
                >
                  <Typography
                    sx={{
                      textAlign: "center",
                      display: "inline-block",
                      color: "common.white",
                      typography: "body2",
                      fontWeight: 700,
                    }}
                  >
                    Kapak Resmi
                  </Typography>
                </Box>
              )}
              {sortable && (
                <>
                  {key !== 0 && (
                    <IconButton
                      size="small"
                      sx={{ color: "secondary.light",position: 'absolute',bottom: 0,left: 0 }}
                      onClick={() => handleSort(item, false)}
                    >
                      <KeyboardArrowLeftIcon />
                    </IconButton>
                  )}
                  {key !== items.length - 1 && (
                    <IconButton
                      size="small"
                      sx={{ color: "secondary.light",position: 'absolute',bottom: 0,right: 0 }}
                      onClick={() => handleSort(item, true)}
                    >
                      <KeyboardArrowRightIcon />
                    </IconButton>
                  )}
                </>
              )}

              <>
                <IconButton
                  size="small"
                  sx={{ color: "secondary.light", height: "auto",position: 'absolute',top: 0,right: 0 }}
                  onClick={() => handleDelete(item)}
                >
                  <DeleteForeverIcon />
                </IconButton>
              </>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
