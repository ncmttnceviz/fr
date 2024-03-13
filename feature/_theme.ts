import { ThemeOptions,experimental_sx as sx } from '@mui/material/styles';
import { borderColor } from '@mui/system';
declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true; // removes the `xs` breakpoint
    sm: true;
    md: true;
    lg: true;
    xl: true;
  }
}

export const themeOptions: ThemeOptions = {
  
  palette: {
    mode: 'light',
    primary: {
      main: '#B20837',
    },
    secondary: {
      main: '#D93C53',
    },
    warning: {
      main: '#f39c12',
    },
    text: {
      primary: '#2c3e50'
    },
    background: {
      default: "#f6f6f6"
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1200,
    },
  },
  typography: {
    fontFamily: '"Source Sans Pro", "Helvetica", "Arial", sans-serif',
    fontWeightMedium: 600,
    fontWeightBold: 700,
    fontSize: 16,
  },
};