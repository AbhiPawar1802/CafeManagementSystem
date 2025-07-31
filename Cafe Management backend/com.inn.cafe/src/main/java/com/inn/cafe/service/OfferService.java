package com.inn.cafe.service;

import com.inn.cafe.POJO.Offer;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public interface OfferService{
    ResponseEntity<String> addOffer(Map<String, Object> requestMap);

    ResponseEntity<List<Offer>> getAllActiveOffers();

    ResponseEntity<String> deleteOffer(Integer id);

    ResponseEntity<String> updateOffer(Map<String, Object> requestMap);

    ResponseEntity<Map<String, Object>> validateOffer(Map<String, Object> requestMap);
}
