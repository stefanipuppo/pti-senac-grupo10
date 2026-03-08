package com.example.bookexchange.controller;

import com.example.bookexchange.dto.AuthRequest;
import com.example.bookexchange.dto.RegisterOrLoginRequest;
import com.example.bookexchange.model.User;
import com.example.bookexchange.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public User login(@RequestBody AuthRequest request) {
        var userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas");
        }

        var user = userOpt.get();
        if (!passwordEncoder.matches(request.getSenha(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas");
        }

        return user;
    }

    @PostMapping("/register-or-login")
    public User registerOrLogin(@RequestBody RegisterOrLoginRequest request) {
        var existingOpt = userRepository.findByEmail(request.getEmail());

        if (existingOpt.isPresent()) {
            var existing = existingOpt.get();

            if (!passwordEncoder.matches(request.getSenha(), existing.getPasswordHash())) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas");
            }

            return existing;
        }

        User user = new User();
        user.setNome(request.getNome());
        user.setEmail(request.getEmail());
        user.setCidade(request.getCidade());
        user.setPasswordHash(passwordEncoder.encode(request.getSenha()));

        return userRepository.save(user);
    }
}

