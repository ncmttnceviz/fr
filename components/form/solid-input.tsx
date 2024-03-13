import { alpha, styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";

export default styled(InputBase)(({ theme, color }) => ({
  "label + &": {
    marginTop: theme.spacing(2.5),
  },
  "& .MuiInputBase-input": {
    borderRadius: 0,
    position: "relative",
    backgroundColor:
      theme.palette.mode === "light"
        ? "rgba(255, 255, 255, 0.7) !important"
        : "#2b2b2b !important",
    border: "1px solid #ced4da",
    fontSize: 13,
    padding: "10px 12px",
    borderColor: theme.palette.grey[600],
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),
  },
  ".MuiSelect-select": {
    paddingTop: 6,
    paddingBottom: 6,
    backgroundColor:
      theme.palette.mode === "light" ? "rgba(255, 255, 255, 0.7)" : "#2b2b2b",
  },
}));
