import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { useState } from "react";
export default function PasswordInput({label="Password"}: {label?: string}) {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  return (
    <FormControl fullWidth>
      <InputLabel htmlFor="outlined-adornment-password">{label}</InputLabel>
      <OutlinedInput
        id="outlined-adornment-password"
        fullWidth
        type={passwordVisible ? "text" : "password"}
        label={label}
        
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setPasswordVisible((o) => !!!o)}
              edge="end"
            >
              {!passwordVisible ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  );
}
