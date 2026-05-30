import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import BookList from './components/BookList';
import AuthorList from './components/AuthorList';
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Book Catalogue
            </Typography>
            <Container maxWidth="sm">
              <Button color="inherit" component={Link} to="/books">
                Books
              </Button>
              <Button color="inherit" component={Link} to="/authors">
                Authors
              </Button>
            </Container>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/books" element={<BookList />} />
            <Route path="/authors" element={<AuthorList />} />
            <Route path="/" element={<BookList />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;