package com.example.bookservice.service;

import com.example.bookservice.model.Book;
import com.example.bookservice.repository.BookRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class BookServiceTest {

    @Mock
    private BookRepository bookRepository;

    @InjectMocks
    private BookService bookService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testFindAll() {
        Book book1 = new Book("Book 1", 1L);
        Book book2 = new Book("Book 2", 2L);
        when(bookRepository.findAll()).thenReturn(Arrays.asList(book1, book2));

        List<Book> books = bookService.findAll();

        assertEquals(2, books.size());
        assertEquals("Book 1", books.get(0).getTitle());
        assertEquals("Book 2", books.get(1).getTitle());
        verify(bookRepository, times(1)).findAll();
    }

    @Test
    void testFindByIdFound() {
        Book book = new Book("Book 1", 1L);
        book.setId(1L);
        when(bookRepository.findById(1L)).thenReturn(Optional.of(book));

        Optional<Book> found = bookService.findById(1L);

        assertTrue(found.isPresent());
        assertEquals("Book 1", found.get().getTitle());
        verify(bookRepository, times(1)).findById(1L);
    }

    @Test
    void testFindByIdNotFound() {
        when(bookRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<Book> found = bookService.findById(1L);

        assertFalse(found.isPresent());
        verify(bookRepository, times(1)).findById(1L);
    }

    @Test
    void testSaveBook() {
        Book book = new Book("New Book", 3L);
        when(bookRepository.save(any(Book.class))).thenAnswer(invocation -> {
            Book savedBook = invocation.getArgument(0);
            savedBook.setId(1L);
            return savedBook;
        });

        Book savedBook = bookService.save(book);

        assertNotNull(savedBook.getId());
        assertEquals(1L, savedBook.getId());
        assertEquals("New Book", savedBook.getTitle());
        verify(bookRepository, times(1)).save(any(Book.class));
    }

    @Test
    void testSearchByTitle() {
        Book book1 = new Book("Clean Code", 1L);
        Book book2 = new Book("Clean Architecture", 1L);
        when(bookRepository.findByTitleContainingIgnoreCase("clean"))
                .thenReturn(Arrays.asList(book1, book2));

        List<Book> results = bookService.searchByTitle("clean");

        assertEquals(2, results.size());
        verify(bookRepository, times(1)).findByTitleContainingIgnoreCase("clean");
    }

    @Test
    void testDeleteById() {
        doNothing().when(bookRepository).deleteById(1L);

        bookService.deleteById(1L);

        verify(bookRepository, times(1)).deleteById(1L);
    }
}