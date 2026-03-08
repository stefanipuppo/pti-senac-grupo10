package com.example.bookexchange.dto;

import lombok.Data;

@Data
public class RegisterOrLoginRequest {

    private String nome;
    private String email;
    private String cidade;
    private String senha;
}

