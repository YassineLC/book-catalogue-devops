import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  Box, Typography, List, ListItem, ListItemIcon,
  ListItemText, ListItemButton, Divider,
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PeopleIcon from '@mui/icons-material/People';
import BookList from './components/BookList';
import AuthorList from './components/AuthorList';

const SIDEBAR_WIDTH = 248;

const NAV_ITEMS = [
  { label: 'Livres', path: '/', icon: <MenuBookIcon fontSize="small" /> },
  { label: 'Auteurs', path: '/authors', icon: <PeopleIcon fontSize="small" /> },
];

function Sidebar() {
  const location = useLocation();

  return (
    <Box sx={{
      width: SIDEBAR_WIDTH,
      flexShrink: 0,
      bgcolor: '#0F0C0A',
      borderRight: '1px solid #2C2721',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      height: '100vh',
      top: 0,
      left: 0,
      zIndex: 100,
    }}>
      <Box sx={{ p: 3, pb: 2.5 }}>
        <Typography sx={{
          fontFamily: '"Playfair Display", serif',
          fontWeight: 700,
          fontSize: '1.35rem',
          color: '#C9963D',
          letterSpacing: '-0.3px',
          lineHeight: 1.2,
        }}>
          Bibliothèque
        </Typography>
        <Typography sx={{
          color: '#3D352C',
          fontSize: '0.62rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          mt: 0.5,
          fontWeight: 500,
        }}>
          Catalogue de livres
        </Typography>
      </Box>

      <Divider sx={{ borderColor: '#2C2721', mx: 2 }} />

      <List sx={{ px: 1.5, pt: 2, flex: 1 }}>
        {NAV_ITEMS.map(item => {
          const active = item.path === '/'
            ? location.pathname === '/' || location.pathname === '/books'
            : location.pathname.startsWith(item.path);
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                sx={{
                  borderRadius: 1.5,
                  px: 1.5,
                  py: 1,
                  bgcolor: active ? 'rgba(201,150,61,0.10)' : 'transparent',
                  '&:hover': {
                    bgcolor: active ? 'rgba(201,150,61,0.14)' : 'rgba(255,255,255,0.03)',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 34, color: active ? '#C9963D' : '#5A4D3E' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: active ? 600 : 400,
                    color: active ? '#C9963D' : '#BFB4A8',
                  }}
                />
                {active && (
                  <Box sx={{
                    width: 5, height: 5, borderRadius: '50%',
                    bgcolor: '#C9963D', opacity: 0.8, flexShrink: 0,
                  }} />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ p: 2.5 }}>
        <Typography sx={{ color: '#2C2721', fontSize: '0.65rem', letterSpacing: '0.05em' }}>
          Projet DevOps · 2026
        </Typography>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#0B0907' }}>
      <Sidebar />
      <Box sx={{
        ml: `${SIDEBAR_WIDTH}px`,
        flex: 1,
        p: { xs: 3, md: 4 },
        minHeight: '100vh',
        maxWidth: '100%',
      }}>
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/authors" element={<AuthorList />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
