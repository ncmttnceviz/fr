import { TextField } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";


export default styled(TextField)(({ theme, color }) => ({
  marginTop: "16px !important",
  "& .MuiInputBase-root": {
    
      
    
    borderRadius: 0,
    position: "relative",
    backgroundColor:
      theme.palette.mode === "light"
        ? "rgba(255, 255, 255, 0.7) !important"
        : "#2b2b2b !important",
    border: "1px solid #ced4da",
    fontSize: 13,
    padding: "0",
    borderColor: theme.palette.grey[600],
    
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),
    '&:hover': {
      borderColor: theme.palette.grey[600],
    },
    '&::before,&::after': {
      display: 'none'
    },
    "& .MuiInputBase-input": {
      padding: "10px 12px",
    },
 
  },
  "& .MuiInputLabel-root": {
    maxWidth: '100% !important',
    transform :'none !important',
    fontSize: "13px !important",
    top: -3,
    fontWeight: '600'
  },
  "& .MuiButtonBase-root": {
    fontSize: 11,
    height: "26px",
  },
  ".MuiSelect-select": {
    paddingTop: 6,
    paddingBottom: 6,
    backgroundColor:
      theme.palette.mode === "light" ? "rgba(255, 255, 255, 0.7)" : "#2b2b2b",
  },
}));
