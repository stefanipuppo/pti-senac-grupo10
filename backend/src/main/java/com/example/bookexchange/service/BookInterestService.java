package com.example.bookexchange.service;

import java.time.Instant;

import org.springframework.stereotype.Service;

import com.example.bookexchange.model.BookInterest;
import com.example.bookexchange.model.User;
import com.example.bookexchange.model.UserShelf;
import com.example.bookexchange.repository.BookInterestRepository;

@Service
public class BookInterestService {

    private final BookInterestRepository repository;

    public BookInterestService(BookInterestRepository repository) {
        this.repository = repository;
    }

    public BookInterest createOrReuseInterest(UserShelf shelf, User solicitante) {
        var dono = shelf.getUsuario();

        if (dono == null || dono.getId() == null) {
            throw new IllegalArgumentException("Estante sem usuário associado.");
        }

        if (solicitante.getId().equals(dono.getId())) {
            throw new IllegalArgumentException("Usuário não pode demonstrar interesse no próprio livro.");
        }

        var existing = repository.findBySolicitanteIdAndShelfId(solicitante.getId(), shelf.getId());
        if (existing.isPresent()) {
            return existing.get();
        }

        BookInterest interest = new BookInterest();
        interest.setSolicitante(solicitante);
        interest.setDono(dono);
        interest.setLivro(shelf.getLivro());
        interest.setShelf(shelf);
        interest.setStatus("pendente");
        interest.setCreatedAt(Instant.now());

        return repository.save(interest);
    }
}

