package com.inn.cafe.rest;

import com.inn.cafe.POJO.Offer;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/offer")
public interface OfferRest {

    @PostMapping("/add")
    ResponseEntity<String> addOffer(@RequestBody Map<String, Object> requestMap);

    @GetMapping("/get")
    ResponseEntity<List<Offer>> getAllActiveOffers();

    @DeleteMapping("/delete/{id}")
    ResponseEntity<String> deleteOffer(@PathVariable Integer id);

    @PutMapping("/update")
    ResponseEntity<String> updateOffer(@RequestBody Map<String, Object> requestMap);

    @PostMapping("validate")
    ResponseEntity<Map<String, Object>> validateOffer(@RequestBody Map<String, Object> requestMap);
}
