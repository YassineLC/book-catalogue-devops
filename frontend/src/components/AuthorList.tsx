import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Box,
} from '@mui/material';

const AuthorList = () => {
  const [authors, setAuthors] = useState<Array<any>>([]);
  const [name, setName] = useState('');
  const [nationality, setNationality] = useState('');

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      const response = await fetch('http://localhost:8082/api/authors');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setAuthors(data);
    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  };

  const addAuthor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8082/api/authors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          nationality,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to add author');
      }
      const newAuthor = await response.json();
      setAuthors([...authors, newAuthor]);
      setName('');
      setNationality('');
    } catch (error) {
      console.error('Error adding author:', error);
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Nationality</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {authors.map((author) => (
              <TableRow key={author.id}>
                <TableCell component="th" scope="row">
                  {author.id}
                </TableCell>
                <TableCell align="left">{author.name}</TableCell>
                <TableCell align="left">{author.nationality}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box component="form" onSubmit={addAuthor} sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          sx={{ flexGrow: 1 }}
        />
        <TextField
          label="Nationality"
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          required
          sx={{ flexGrow: 1 }}
        />
        <Button type="submit" variant="contained">
          Add Author
        </Button>
      </Box>
    </Box>
  );
};

export default AuthorList;