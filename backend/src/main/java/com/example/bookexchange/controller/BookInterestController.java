package com.example.bookexchange.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.bookexchange.dto.CreateInterestRequest;
import com.example.bookexchange.model.BookInterest;
import com.example.bookexchange.model.User;
import com.example.bookexchange.model.UserShelf;
import com.example.bookexchange.repository.BookInterestRepository;
import com.example.bookexchange.repository.UserShelfRepository;
import com.example.bookexchange.repository.UserRepository;
import com.example.bookexchange.service.BookInterestService;

@RestController
@RequestMapping("/interests")
public class BookInterestController {

    private final UserShelfRepository shelfRepository;
    private final UserRepository userRepository;
    private final BookInterestService interestService;
    private final BookInterestRepository interestRepository;

    public BookInterestController(
            UserShelfRepository shelfRepository,
            UserRepository userRepository,
            BookInterestService interestService,
            BookInterestRepository interestRepository) {
        this.shelfRepository = shelfRepository;
        this.userRepository = userRepository;
        this.interestService = interestService;
        this.interestRepository = interestRepository;
    }

    @PostMapping
    public BookInterest create(@RequestBody CreateInterestRequest request) {
        UserShelf shelf = shelfRepository.findById(request.getShelfId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Estante não encontrada"));

        User solicitante = userRepository.findById(request.getSolicitanteId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário solicitante não encontrado"));

        try {
            return interestService.createOrReuseInterest(shelf, solicitante);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public List<BookInterest> getInterestsByUserId(@PathVariable Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        return interestRepository.findBySolicitanteId(userId);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        if (!interestRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Interesse não encontrado");
        }
        interestRepository.deleteById(id);
    }
}

