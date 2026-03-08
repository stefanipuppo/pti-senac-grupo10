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

import com.example.bookexchange.model.User;
import com.example.bookexchange.model.UserShelf;
import com.example.bookexchange.service.UserService;
import com.example.bookexchange.service.UserShelfService;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService service;
    private final UserShelfService userShelfService;

    public UserController(UserService service, UserShelfService userShelfService) {
        this.service = service;
        this.userShelfService = userShelfService;
    }

    @GetMapping
    public List<User> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public User getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @GetMapping("/{id}/shelf")
    public List<UserShelf> getUserShelf(@PathVariable Long id) {
        return userShelfService.findByUserId(id);
    }

    @PostMapping
    public User create(@RequestBody User user) {
        return service.save(user);
    }

    @PutMapping("/{id}")
    public User update(@PathVariable Long id, @RequestBody User user) {
        user.setId(id);
        return service.save(user);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
