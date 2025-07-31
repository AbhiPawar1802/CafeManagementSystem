package com.inn.cafe.service;

import com.inn.cafe.POJO.Reservation;
import com.inn.cafe.dao.ReservationDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ReservationService {

    ResponseEntity<String> addReservation(Reservation reservation);
    ResponseEntity<List<Reservation>> getAllReservation();
    ResponseEntity<String> deleteReservation(Integer id);
    ResponseEntity<String> acceptReservation(Integer id);
}
