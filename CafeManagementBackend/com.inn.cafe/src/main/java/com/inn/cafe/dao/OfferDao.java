package com.inn.cafe.dao;

import com.inn.cafe.POJO.Offer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface OfferDao extends JpaRepository<Offer, Integer> {

    List<Offer> findByActiveTrue();

    List<Offer> findByActiveTrueAndExpiryDateGreaterThanEqual(LocalDate currentDate);



}
