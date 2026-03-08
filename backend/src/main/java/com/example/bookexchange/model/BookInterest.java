package com.example.bookexchange.model;

import java.time.Instant;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "interesse_livro")
public class BookInterest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_solicitante")
    private User solicitante;

    @ManyToOne
    @JoinColumn(name = "id_dono")
    private User dono;

    @ManyToOne
    @JoinColumn(name = "id_livro")
    private Book livro;

    @ManyToOne
    @JoinColumn(name = "id_estante")
    private UserShelf shelf;

    private String status; // pendente | (futuro)

    private Instant createdAt;
}

