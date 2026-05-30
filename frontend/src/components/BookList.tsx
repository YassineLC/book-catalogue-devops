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

const BookList = () => {
  const [books, setBooks] = useState<Array<any>>([]);
  const [title, setTitle] = useState('');
  const [authorId, setAuthorId] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/books');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const addBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8081/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          authorId: parseInt(authorId, 10),
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to add book');
      }
      const newBook = await response.json();
      setBooks([...books, newBook]);
      setTitle('');
      setAuthorId('');
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="left">Title</TableCell>
              <TableCell align="left">Author ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book.id}>
                <TableCell component="th" scope="row">
                  {book.id}
                </TableCell>
                <TableCell align="left">{book.title}</TableCell>
                <TableCell align="left">{book.authorId}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box component="form" onSubmit={addBook} sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          sx={{ flexGrow: 1 }}
        />
        <TextField
          label="Author ID"
          type="number"
          value={authorId}
          onChange={(e) => setAuthorId(e.target.value)}
          required
          sx={{ flexGrow: 1 }}
        />
        <Button type="submit" variant="contained">
          Add Book
        </Button>
      </Box>
    </Box>
  );
};

export default BookList;