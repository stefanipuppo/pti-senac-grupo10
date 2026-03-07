package com.example.bookexchange.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.bookexchange.model.BookInterest;

public interface BookInterestRepository extends JpaRepository<BookInterest, Long> {

    Optional<BookInterest> findBySolicitanteIdAndShelfId(Long solicitanteId, Long shelfId);

    List<BookInterest> findBySolicitanteId(Long solicitanteId);
}

