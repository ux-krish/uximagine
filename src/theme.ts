import { createTheme, alpha } from '@mui/material/styles';

const ACCENT = '#7c3aed';
const ACCENT_CYAN = '#06b6d4';
const BG_DEEP = '#07070c';
const BG_BASE = '#0a0a0f';
const BG_SURFACE = '#111118';
const BG_ELEVATED = '#16161f';
const GLASS_BG = 'rgba(14, 14, 22, 0.72)';
const GLASS_BORDER = 'rgba(255, 255, 255, 0.08)';
const TEXT_PRIMARY = '#e4e4eb';
const TEXT_SECONDARY = '#7a7a8e';

const uxTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: ACCENT,
      light: '#8b5cf6',
      dark: '#6d28d9',
    },
    secondary: {
      main: ACCENT_CYAN,
    },
    background: {
      default: BG_DEEP,
      paper: GLASS_BG,
    },
    text: {
      primary: TEXT_PRIMARY,
      secondary: TEXT_SECONDARY,
    },
    divider: 'rgba(255, 255, 255, 0.06)',
  },

  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    fontWeightLight: 200,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    button: {
      textTransform: 'none',
      fontWeight: 500,
      letterSpacing: '0.02em',
    },
    subtitle2: {
      fontWeight: 500,
      letterSpacing: '0.08em',
      fontSize: '0.7rem',
    },
    body2: {
      fontSize: '0.8rem',
      color: TEXT_SECONDARY,
    },
    caption: {
      fontSize: '0.7rem',
      color: TEXT_SECONDARY,
    },
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: BG_DEEP,
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: GLASS_BG,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${GLASS_BORDER}`,
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 100,
          padding: '8px 24px',
          fontSize: '0.8rem',
          fontWeight: 500,
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        contained: {
          background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_CYAN})`,
          color: '#fff',
          border: 'none',
          boxShadow: `0 4px 20px ${alpha(ACCENT, 0.35)}`,
          '&:hover': {
            background: `linear-gradient(135deg, #8b5cf6, #22d3ee)`,
            boxShadow: `0 6px 28px ${alpha(ACCENT, 0.5)}`,
          },
        },
        outlined: {
          borderColor: alpha(ACCENT, 0.4),
          color: TEXT_PRIMARY,
          '&:hover': {
            borderColor: ACCENT,
            backgroundColor: alpha(ACCENT, 0.08),
            boxShadow: `0 0 20px ${alpha(ACCENT, 0.15)}`,
          },
        },
        text: {
          color: TEXT_SECONDARY,
          '&:hover': {
            color: TEXT_PRIMARY,
            backgroundColor: alpha(ACCENT, 0.06),
          },
        },
      },
    },

    MuiSlider: {
      styleOverrides: {
        root: {
          height: 4,
          padding: '12px 0',
        },
        track: {
          background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_CYAN})`,
          border: 'none',
        },
        rail: {
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          opacity: 1,
        },
        thumb: {
          width: 16,
          height: 16,
          backgroundColor: '#fff',
          boxShadow: `0 0 12px ${alpha(ACCENT, 0.5)}, 0 0 4px ${alpha(ACCENT, 0.3)}`,
          '&::before': {
            boxShadow: 'none',
          },
          '&:hover, &.Mui-focusVisible': {
            boxShadow: `0 0 20px ${alpha(ACCENT, 0.6)}, 0 0 8px ${alpha(ACCENT, 0.4)}`,
          },
          '&.Mui-active': {
            boxShadow: `0 0 24px ${alpha(ACCENT, 0.7)}, 0 0 12px ${alpha(ACCENT, 0.5)}`,
          },
        },
        valueLabel: {
          background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_CYAN})`,
          borderRadius: 8,
          fontSize: '0.7rem',
          fontWeight: 600,
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(14, 14, 22, 0.85)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          border: `1px solid ${alpha(ACCENT, 0.15)}`,
          borderRadius: 20,
          boxShadow: `0 24px 80px rgba(0, 0, 0, 0.6), 0 0 60px ${alpha(ACCENT, 0.1)}`,
        },
        root: {
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
          },
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '1.1rem',
          letterSpacing: '-0.01em',
        },
      },
    },

    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.08)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(ACCENT, 0.4),
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: ACCENT,
            boxShadow: `0 0 16px ${alpha(ACCENT, 0.15)}`,
          },
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '2px 6px',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: alpha(ACCENT, 0.1),
          },
          '&.Mui-selected': {
            backgroundColor: alpha(ACCENT, 0.15),
            '&:hover': {
              backgroundColor: alpha(ACCENT, 0.2),
            },
          },
        },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 6,
          borderRadius: 100,
          backgroundColor: 'rgba(255, 255, 255, 0.06)',
        },
        bar: {
          borderRadius: 100,
          background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_CYAN})`,
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          marginBottom: 2,
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: alpha(ACCENT, 0.08),
            boxShadow: `inset 3px 0 0 ${ACCENT}`,
          },
          '&.Mui-selected': {
            backgroundColor: alpha(ACCENT, 0.12),
            boxShadow: `inset 3px 0 0 ${ACCENT}`,
            '&:hover': {
              backgroundColor: alpha(ACCENT, 0.16),
            },
          },
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'rgba(14, 14, 22, 0.9)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${GLASS_BORDER}`,
          borderRadius: 8,
          fontSize: '0.72rem',
          fontWeight: 500,
          padding: '6px 12px',
        },
      },
    },
  },
});

export default uxTheme;
