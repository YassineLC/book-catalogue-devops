package com.example.authorservice.controller;

import com.example.authorservice.model.Author;
import com.example.authorservice.service.AuthorService;
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

class AuthorControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AuthorService authorService;

    @InjectMocks
    private AuthorController authorController;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(authorController).build();
    }

    @Test
    void testGetAllAuthors() throws Exception {
        Author author1 = new Author("Author 1", "Country 1");
        author1.setId(1L);
        Author author2 = new Author("Author 2", "Country 2");
        author2.setId(2L);
        List<Author> authors = Arrays.asList(author1, author2);
        when(authorService.findAll()).thenReturn(authors);

        mockMvc.perform(get("/api/authors"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].name", is("Author 1")))
                .andExpect(jsonPath("$[1].name", is("Author 2")));

        verify(authorService, times(1)).findAll();
    }

    @Test
    void testGetAuthorByIdFound() throws Exception {
        Author author = new Author("Author 1", "Country 1");
        author.setId(1L);
        when(authorService.findById(1L)).thenReturn(Optional.of(author));

        mockMvc.perform(get("/api/authors/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Author 1")));

        verify(authorService, times(1)).findById(1L);
    }

    @Test
    void testGetAuthorByIdNotFound() throws Exception {
        when(authorService.findById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/authors/1"))
                .andExpect(status().isNotFound());

        verify(authorService, times(1)).findById(1L);
    }

    @Test
    void testCreateAuthor() throws Exception {
        Author inputAuthor = new Author("New Author", "Country");
        Author savedAuthor = new Author("New Author", "Country");
        savedAuthor.setId(1L);
        when(authorService.save(any(Author.class))).thenReturn(savedAuthor);

        mockMvc.perform(post("/api/authors")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(inputAuthor)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.name", is("New Author")));

        verify(authorService, times(1)).save(any(Author.class));
    }

    @Test
    void testUpdateAuthor() throws Exception {
        Author existingAuthor = new Author("Old Name", "Old Country");
        existingAuthor.setId(1L);
        Author authorDetails = new Author("New Name", "New Country");
        Author updatedAuthor = new Author("New Name", "New Country");
        updatedAuthor.setId(1L);

        when(authorService.findById(1L)).thenReturn(Optional.of(existingAuthor));
        when(authorService.save(any(Author.class))).thenReturn(updatedAuthor);

        mockMvc.perform(put("/api/authors/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(authorDetails)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("New Name")))
                .andExpect(jsonPath("$.nationality", is("New Country")));

        verify(authorService, times(1)).findById(1L);
        verify(authorService, times(1)).save(any(Author.class));
    }

    @Test
    void testUpdateAuthorNotFound() throws Exception {
        Author authorDetails = new Author("New Name", "New Country");
        when(authorService.findById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(put("/api/authors/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(authorDetails)))
                .andExpect(status().isNotFound());

        verify(authorService, times(1)).findById(1L);
        verify(authorService, never()).save(any(Author.class));
    }

    @Test
    void testDeleteAuthor() throws Exception {
        when(authorService.findById(1L)).thenReturn(Optional.of(new Author()));

        mockMvc.perform(delete("/api/authors/1"))
                .andExpect(status().isNoContent());

        verify(authorService, times(1)).findById(1L);
        verify(authorService, times(1)).deleteById(1L);
    }

    @Test
    void testDeleteAuthorNotFound() throws Exception {
        when(authorService.findById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(delete("/api/authors/1"))
                .andExpect(status().isNotFound());

        verify(authorService, times(1)).findById(1L);
        verify(authorService, never()).deleteById(anyLong());
    }
}