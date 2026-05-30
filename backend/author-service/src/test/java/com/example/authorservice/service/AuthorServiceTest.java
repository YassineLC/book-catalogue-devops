package com.example.authorservice.service;

import com.example.authorservice.model.Author;
import com.example.authorservice.repository.AuthorRepository;
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

class AuthorServiceTest {

    @Mock
    private AuthorRepository authorRepository;

    @InjectMocks
    private AuthorService authorService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testFindAll() {
        Author author1 = new Author("Author 1", "Country 1");
        Author author2 = new Author("Author 2", "Country 2");
        when(authorRepository.findAll()).thenReturn(Arrays.asList(author1, author2));

        List<Author> authors = authorService.findAll();

        assertEquals(2, authors.size());
        assertEquals("Author 1", authors.get(0).getName());
        assertEquals("Author 2", authors.get(1).getName());
        verify(authorRepository, times(1)).findAll();
    }

    @Test
    void testFindByIdFound() {
        Author author = new Author("Author 1", "Country 1");
        author.setId(1L);
        when(authorRepository.findById(1L)).thenReturn(Optional.of(author));

        Optional<Author> found = authorService.findById(1L);

        assertTrue(found.isPresent());
        assertEquals("Author 1", found.get().getName());
        verify(authorRepository, times(1)).findById(1L);
    }

    @Test
    void testFindByIdNotFound() {
        when(authorRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<Author> found = authorService.findById(1L);

        assertFalse(found.isPresent());
        verify(authorRepository, times(1)).findById(1L);
    }

    @Test
    void testSaveAuthor() {
        Author author = new Author("New Author", "Country");
        when(authorRepository.save(any(Author.class))).thenAnswer(invocation -> {
            Author saved = invocation.getArgument(0);
            saved.setId(1L);
            return saved;
        });

        Author saved = authorService.save(author);

        assertNotNull(saved.getId());
        assertEquals(1L, saved.getId());
        assertEquals("New Author", saved.getName());
        verify(authorRepository, times(1)).save(any(Author.class));
    }

    @Test
    void testSearchByName() {
        Author author1 = new Author("Robert C. Martin", "American");
        Author author2 = new Author("Martin Fowler", "British");
        when(authorRepository.findByNameContainingIgnoreCase("martin"))
                .thenReturn(Arrays.asList(author1, author2));

        List<Author> results = authorService.searchByName("martin");

        assertEquals(2, results.size());
        verify(authorRepository, times(1)).findByNameContainingIgnoreCase("martin");
    }

    @Test
    void testDeleteById() {
        doNothing().when(authorRepository).deleteById(1L);

        authorService.deleteById(1L);

        verify(authorRepository, times(1)).deleteById(1L);
    }
}
