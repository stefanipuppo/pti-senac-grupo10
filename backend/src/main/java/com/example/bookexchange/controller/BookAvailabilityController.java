package com.example.bookexchange.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.bookexchange.dto.AvailableBookDto;
import com.example.bookexchange.dto.PagedResponseDto;
import com.example.bookexchange.service.BookAvailabilityService;

@RestController
@RequestMapping("/books/available")
public class BookAvailabilityController {

    private final BookAvailabilityService service;

    public BookAvailabilityController(BookAvailabilityService service) {
        this.service = service;
    }

    @GetMapping
    public Object getAvailableBooks(
            @RequestParam(required = false) String titulo,
            @RequestParam(required = false) String autor,
            @RequestParam(required = false, name = "genre") Long genreId,
            @RequestParam(required = false) Long excludeUserId,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int size,
            @RequestParam(required = false, defaultValue = "titulo") String sort) {

        // If any pagination or sorting parameter is explicitly provided, return paged response
        if (page > 0 || size != 10 || (sort != null && !sort.isEmpty())) {
            return service.findAvailableBooks(titulo, autor, genreId, excludeUserId, page, size, sort);
        }

        // Return simple list for backward compatibility
        return service.findAvailableBooks(titulo, autor, genreId, excludeUserId);
    }
}

