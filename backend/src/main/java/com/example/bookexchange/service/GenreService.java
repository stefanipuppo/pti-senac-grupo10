package com.example.bookexchange.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.bookexchange.model.Genre;
import com.example.bookexchange.repository.GenreRepository;

@Service
public class GenreService {

    private final GenreRepository repository;

    public GenreService(GenreRepository repository) {
        this.repository = repository;
    }

    public List<Genre> findAll() {
        return repository.findAll();
    }

    public Genre findById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Genre save(Genre genre) {
        // Verifica se já existe um gênero com esse nome
        var existing = repository.findByNomeGenero(genre.getNomeGenero());
        if (existing.isPresent()) {
            return existing.get(); // retorna o já existente
        }
        return repository.save(genre);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}