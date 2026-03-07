package com.example.bookexchange.dto;

import lombok.Data;

@Data
public class CreateInterestRequest {

    private Long shelfId;
    private Long solicitanteId;
}

