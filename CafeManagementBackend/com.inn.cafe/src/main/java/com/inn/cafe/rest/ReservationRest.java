package com.inn.cafe.rest;


import com.inn.cafe.POJO.Reservation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/reservation")
public interface ReservationRest {

    @PostMapping("/add")
    ResponseEntity<String> addReservation(@RequestBody Reservation reservation);

    @GetMapping("/get")
    ResponseEntity<List<Reservation>> getAllReservation();

    @DeleteMapping("/delete/{id}")
    ResponseEntity<String> deleteReservation(@PathVariable Integer id);

    @PostMapping("/accept/{id}")
    ResponseEntity<String> acceptReservation(@PathVariable Integer id);
}
