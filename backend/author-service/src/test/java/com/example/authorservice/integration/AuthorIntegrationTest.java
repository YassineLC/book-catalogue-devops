package com.example.authorservice.integration;

import com.example.authorservice.model.Author;
import com.example.authorservice.repository.AuthorRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthorIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AuthorRepository authorRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        authorRepository.deleteAll();
    }

    @Test
    void testCreateAndGetAuthor() throws Exception {
        Author author = new Author("Robert C. Martin", "American");

        mockMvc.perform(post("/api/authors")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(author)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name", is("Robert C. Martin")));

        mockMvc.perform(get("/api/authors"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name", is("Robert C. Martin")));
    }

    @Test
    void testSearchAuthors() throws Exception {
        authorRepository.save(new Author("Robert C. Martin", "American"));
        authorRepository.save(new Author("Martin Fowler", "British"));
        authorRepository.save(new Author("Kent Beck", "American"));

        mockMvc.perform(get("/api/authors/search").param("name", "martin"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    void testUpdateAuthor() throws Exception {
        Author saved = authorRepository.save(new Author("Old Name", "Country"));

        Author updated = new Author("New Name", "New Country");
        mockMvc.perform(put("/api/authors/" + saved.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("New Name")));
    }

    @Test
    void testDeleteAuthor() throws Exception {
        Author saved = authorRepository.save(new Author("To Delete", "Country"));

        mockMvc.perform(delete("/api/authors/" + saved.getId()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/authors/" + saved.getId()))
                .andExpect(status().isNotFound());
    }

    @Test
    void testCreateAuthorValidationFails() throws Exception {
        Author invalid = new Author("", "");

        mockMvc.perform(post("/api/authors")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest());
    }
}
