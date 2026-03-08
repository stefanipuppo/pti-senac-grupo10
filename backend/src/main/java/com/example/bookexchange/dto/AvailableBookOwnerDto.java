package com.example.bookexchange.dto;

import lombok.Data;

@Data
public class AvailableBookOwnerDto {

    private Long shelfId;
    private Long ownerId;
    private String ownerName;
    private String cidade;
    private String disponibilidade;
    private String estadoConservacao;
}

