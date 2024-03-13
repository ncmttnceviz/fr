import useCombineSx from "@/hooks/useCombineSx";
import { Button, ButtonProps } from "@mui/material";
export default function BlockButton({sx,...props}: ButtonProps) {
  const a = useCombineSx(sx);
  return (
    <Button
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
          mx: "auto",
          borderRadius: 0,
          borderBottom: '5px solid rgba(0,0,0,0.25)'
        }, 
        ...a
        
      ]}
   
    >
      {props.children}
    </Button>
  );
}
