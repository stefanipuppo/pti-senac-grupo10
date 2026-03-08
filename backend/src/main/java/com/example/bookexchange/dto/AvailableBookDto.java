package com.example.bookexchange.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;

@Data
public class AvailableBookDto {

    private Long bookId;
    private String titulo;
    private String autor;
    private String genero;
    private List<AvailableBookOwnerDto> owners = new ArrayList<>();
}

