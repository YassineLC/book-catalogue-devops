package com.example.bookservice.controller;

import com.example.bookservice.model.Book;
import com.example.bookservice.service.BookService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class BookControllerTest {

    private MockMvc mockMvc;

    @Mock
    private BookService bookService;

    @InjectMocks
    private BookController bookController;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(bookController).build();
    }

    @Test
    void testGetAllBooks() throws Exception {
        Book book1 = new Book("Book 1", 1L);
        book1.setId(1L);
        Book book2 = new Book("Book 2", 2L);
        book2.setId(2L);
        List<Book> books = Arrays.asList(book1, book2);
        when(bookService.findAll()).thenReturn(books);

        mockMvc.perform(get("/api/books"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].title", is("Book 1")))
                .andExpect(jsonPath("$[1].title", is("Book 2")));

        verify(bookService, times(1)).findAll();
    }

    @Test
    void testGetBookByIdFound() throws Exception {
        Book book = new Book("Book 1", 1L);
        book.setId(1L);
        when(bookService.findById(1L)).thenReturn(Optional.of(book));

        mockMvc.perform(get("/api/books/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("Book 1")));

        verify(bookService, times(1)).findById(1L);
    }

    @Test
    void testGetBookByIdNotFound() throws Exception {
        when(bookService.findById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/books/1"))
                .andExpect(status().isNotFound());

        verify(bookService, times(1)).findById(1L);
    }

    @Test
    void testCreateBook() throws Exception {
        Book inputBook = new Book("New Book", 3L);
        Book savedBook = new Book("New Book", 3L);
        savedBook.setId(1L);
        when(bookService.save(any(Book.class))).thenReturn(savedBook);

        mockMvc.perform(post("/api/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(inputBook)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.title", is("New Book")));

        verify(bookService, times(1)).save(org.mockito.ArgumentMatchers.any(Book.class));
    }

    @Test
    void testUpdateBook() throws Exception {
        Book existingBook = new Book("Old Title", 1L);
        existingBook.setId(1L);
        Book updatedDetails = new Book("New Title", 2L);
        Book updatedBook = new Book("New Title", 2L);
        updatedBook.setId(1L);

        when(bookService.findById(1L)).thenReturn(Optional.of(existingBook));
        when(bookService.save(org.mockito.ArgumentMatchers.any(Book.class))).thenReturn(updatedBook);

        mockMvc.perform(put("/api/books/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedDetails)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("New Title")))
                .andExpect(jsonPath("$.authorId", is(2)));

        verify(bookService, times(1)).findById(1L);
        verify(bookService, times(1)).save(org.mockito.ArgumentMatchers.any(Book.class));
    }

    @Test
    void testUpdateBookNotFound() throws Exception {
        Book updatedDetails = new Book("New Title", 2L);
        when(bookService.findById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(put("/api/books/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedDetails)))
                .andExpect(status().isNotFound());

        verify(bookService, times(1)).findById(1L);
        verify(bookService, never()).save(org.mockito.ArgumentMatchers.any(Book.class));
    }

    @Test
    void testDeleteBook() throws Exception {
        when(bookService.findById(1L)).thenReturn(Optional.of(new Book()));

        mockMvc.perform(delete("/api/books/1"))
                .andExpect(status().isNoContent());

        verify(bookService, times(1)).findById(1L);
        verify(bookService, times(1)).deleteById(1L);
    }

    @Test
    void testDeleteBookNotFound() throws Exception {
        when(bookService.findById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(delete("/api/books/1"))
                .andExpect(status().isNotFound());

        verify(bookService, times(1)).findById(1L);
        verify(bookService, never()).deleteById(anyLong());
    }
}