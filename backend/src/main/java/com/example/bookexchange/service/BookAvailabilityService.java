package com.example.bookexchange.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.bookexchange.dto.AvailableBookDto;
import com.example.bookexchange.dto.AvailableBookOwnerDto;
import com.example.bookexchange.dto.PagedResponseDto;
import com.example.bookexchange.model.Book;
import com.example.bookexchange.model.UserShelf;
import com.example.bookexchange.repository.UserShelfRepository;

@Service
public class BookAvailabilityService {

    private final UserShelfRepository userShelfRepository;

    public BookAvailabilityService(UserShelfRepository userShelfRepository) {
        this.userShelfRepository = userShelfRepository;
    }

    public List<AvailableBookDto> findAvailableBooks(String titulo, String autor, Long genreId, Long excludeUserId) {
        return findAvailableBooks(titulo, autor, genreId, excludeUserId, 0, 10, "titulo").getContent();
    }

    public PagedResponseDto<AvailableBookDto> findAvailableBooks(String titulo, String autor, Long genreId,
            Long excludeUserId, int page, int size, String sort) {
        List<UserShelf> shelves = userShelfRepository.findByDisponibilidade("para_troca");

        String tituloFilter = titulo != null ? titulo.toLowerCase(Locale.ROOT) : null;
        String autorFilter = autor != null ? autor.toLowerCase(Locale.ROOT) : null;

        Map<Long, AvailableBookDto> byBookId = new HashMap<>();

        for (UserShelf shelf : shelves) {
            if (shelf.getUsuario() == null || shelf.getLivro() == null) {
                continue;
            }

            if (excludeUserId != null && excludeUserId.equals(shelf.getUsuario().getId())) {
                continue;
            }

            Book book = shelf.getLivro();

            if (tituloFilter != null && (book.getTitulo() == null
                    || !book.getTitulo().toLowerCase(Locale.ROOT).contains(tituloFilter))) {
                continue;
            }

            if (autorFilter != null && (book.getAutor() == null
                    || !book.getAutor().toLowerCase(Locale.ROOT).contains(autorFilter))) {
                continue;
            }

            if (genreId != null && (book.getGenero() == null || !genreId.equals(book.getGenero().getId()))) {
                continue;
            }

            AvailableBookDto dto = byBookId.computeIfAbsent(book.getId(), id -> {
                AvailableBookDto b = new AvailableBookDto();
                b.setBookId(book.getId());
                b.setTitulo(book.getTitulo());
                b.setAutor(book.getAutor());
                b.setGenero(book.getGenero() != null ? book.getGenero().getNomeGenero() : null);
                b.setOwners(new ArrayList<>());
                return b;
            });

            AvailableBookOwnerDto ownerDto = new AvailableBookOwnerDto();
            ownerDto.setShelfId(shelf.getId());
            ownerDto.setOwnerId(shelf.getUsuario().getId());
            ownerDto.setOwnerName(shelf.getUsuario().getNome());
            ownerDto.setCidade(shelf.getUsuario().getCidade());
            ownerDto.setDisponibilidade(shelf.getDisponibilidade());
            ownerDto.setEstadoConservacao(shelf.getEstadoConservacao());

            dto.getOwners().add(ownerDto);
        }

        // Apply sorting
        List<AvailableBookDto> sortedList = new ArrayList<>(byBookId.values());
        applySorting(sortedList, sort);

        // Apply pagination
        long totalElements = sortedList.size();
        int totalPages = (int) Math.ceil((double) totalElements / size);
        int skip = page * size;

        List<AvailableBookDto> paginatedContent = sortedList.stream()
            .skip(skip)
            .limit(size)
            .toList();

        return new PagedResponseDto<>(
            paginatedContent,
            page,
            size,
            totalElements,
            totalPages,
            page >= totalPages - 1
        );
    }

    private void applySorting(List<AvailableBookDto> list, String sort) {
        if (sort == null || sort.isEmpty()) {
            sort = "titulo";
        }

        switch (sort.toLowerCase()) {
            case "titulo":
                list.sort(Comparator.comparing(b -> b.getTitulo() != null ? b.getTitulo() : ""));
                break;
            case "autor":
                list.sort(Comparator.comparing(b -> b.getAutor() != null ? b.getAutor() : ""));
                break;
            case "genero":
                list.sort(Comparator.comparing(b -> b.getGenero() != null ? b.getGenero() : ""));
                break;
            case "relevancia":
                // Ordenar por número de proprietários (mais disponível = mais relevante)
                list.sort((a, b) -> Integer.compare(b.getOwners().size(), a.getOwners().size()));
                break;
            default:
                list.sort(Comparator.comparing(b -> b.getTitulo() != null ? b.getTitulo() : ""));
        }
    }
}

