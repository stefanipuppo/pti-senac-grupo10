package com.example.bookexchange.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.bookexchange.model.UserShelf;
import com.example.bookexchange.service.UserShelfService;

@RestController
@RequestMapping("/shelf")
public class UserShelfController {

    private final UserShelfService service;

    public UserShelfController(UserShelfService service) {
        this.service = service;
    }

    @GetMapping
    public List<UserShelf> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public UserShelf getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public UserShelf create(@RequestBody UserShelf shelf) {
        return service.save(shelf);
    }

    @PutMapping("/{id}")
    public UserShelf update(@PathVariable Long id, @RequestBody UserShelf shelf) {
        shelf.setId(id);
        return service.save(shelf);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}