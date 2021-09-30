import { createTheme } from '@mui/material/styles';

const settings = {
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920
    },
  },
  shadows: ["none"],
  palette: {
    common: {
      black: "#000",
      white: "#fff"
    },
    background: {
      paper: "#F7F7F7",
      default: "#FCFCFC"
    },
    divider: "#E8E7E8",
    primary: { // blue
      dark: "#15406E", // 700
      main: "#1A5089", // 500
      light: "#897C95", // 100
      300: "#98B1CA",
      900: "#103052",
      // contrastText: "#FCFCFC"
    },
    textPrimary: {
      main: "#FCFCFC"
    },
    secondary: { // orange
      dark: "#60370A", // 900
      main: "#F1891A", // 500
      light: "#FEF3E8", // 100
      300: "#F5AC5F",
      700: "#C16E15", // 700
      contrastText: "#FCFCFC"
    },
    textSecondary: {
      main: "#FCFCFC"
    },
    text: {
      disabled: "#CDCFD0",
      hint: "#9B9EA2",
      primary: "#0A2037",
      secondary: "#373E46"
    },
    success: {
      dark: "#1A661D", // 700
      main: "#2F8732", // 500
      light: "#E9F4EA", // 100
      contrastText: "#FCFCFC"
    },
    warning: {
      dark: "#C29B12",
      main: "#F2C216",
      light: "#FCF3D0",
      contrastText: "#FCFCFC"
    },
    error: {
      dark: "#A11819",
      main: "#C91E1F",
      light: "#F8E4E4",
      contrastText: "#FCFCFC"
    }
  },
  typography: {
    h1: {
      fontSize: "3rem",
      fontWeight: 600
    },
    h2: {
      fontSize: "2.5rem",
      fontWeight: 600
    },
    h3: {
      fontSize: "2rem",
      fontWeight: 600
    },
    h4: {
      fontSize: "1.75rem",
      fontWeight: 600
    },
    h5: {
      fontSize: "1.5rem",
      fontWeight: 600
    },
    h6: {
      fontSize: "1.25rem",
      fontWeight: 700,
      letterSpacing: "1%"
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400
    },
    body2: {
      fontSize: "0.9375rem",
      fontWeight: 400
    },
    subtitle1: {
      fontSize: "1.25rem",
      fontWeight: 400
    },
    button: {
      fontSize: "0.9375rem",
      fontWeight: 600,
      lineHeight: 1.6,
      textTransform: "uppercase"
    },
    caption: {
      fontSize: "0.8125rem",
      fontWeight: 400
    },
    overline: {
      fontSize: "0.8125rem",
      fontWeight: 400,
      textTransform: "uppercase"
    },
    fontSize: 16,
    fontFamily: "\"Work Sans\", sans-serif",
    fontWeight: 400,
    fontWeightBold: 600,
  }
};

export const theme = createTheme(settings);