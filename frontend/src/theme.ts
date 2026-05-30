import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#C9963D',
      light: '#E8B84B',
      dark: '#A8792E',
      contrastText: '#0B0907',
    },
    secondary: { main: '#7A6B58' },
    background: { default: '#0B0907', paper: '#1A1714' },
    text: { primary: '#F2EBE0', secondary: '#7A6B58' },
    divider: '#2C2721',
    error: { main: '#E57373' },
    success: { main: '#81C784' },
  },
  typography: {
    fontFamily: '"DM Sans", "Helvetica Neue", sans-serif',
    h1: { fontFamily: '"Playfair Display", Georgia, serif' },
    h2: { fontFamily: '"Playfair Display", Georgia, serif' },
    h3: { fontFamily: '"Playfair Display", Georgia, serif' },
    h4: { fontFamily: '"Playfair Display", Georgia, serif' },
    h5: { fontFamily: '"Playfair Display", Georgia, serif' },
    h6: { fontFamily: '"Playfair Display", Georgia, serif' },
  },
  shape: { borderRadius: 6 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: { backgroundImage: 'none', backgroundColor: '#1A1714', border: '1px solid #2C2721' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 500, letterSpacing: '0.01em' },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#1A1714',
            '& fieldset': { borderColor: '#2C2721' },
            '&:hover fieldset': { borderColor: '#C9963D' },
            '&.Mui-focused fieldset': { borderColor: '#C9963D' },
          },
          '& .MuiInputLabel-root.Mui-focused': { color: '#C9963D' },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { backgroundImage: 'none', backgroundColor: '#1A1714', border: '1px solid #2C2721' },
      },
    },
    MuiChip: {
      styleOverrides: { root: { fontFamily: '"DM Sans", sans-serif', fontSize: '0.75rem' } },
    },
  },
});

export default theme;
