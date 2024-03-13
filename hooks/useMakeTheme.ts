import { createTheme, Theme } from "@mui/material/styles";
import { themeOptions } from "@/feature/_theme";
export default function(): Theme {
  const theme = createTheme(themeOptions);
  return theme;
}
