package com.inn.cafe.restImpl;

import com.inn.cafe.POJO.Reservation;
import com.inn.cafe.rest.ReservationRest;
import com.inn.cafe.service.ReservationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/reservation")
public class ReservationRestImpl implements ReservationRest {

    @Autowired
    ReservationService reservationService;

    private static final Logger log = LoggerFactory.getLogger(ReservationRestImpl.class);

    @Override
    public ResponseEntity<String> addReservation(Reservation reservation) {
        log.info("Received reservation request: {}", reservation);
        return reservationService.addReservation(reservation);
    }

    @Override
    public ResponseEntity<List<Reservation>> getAllReservation() {
        return reservationService.getAllReservation();
    }

    @Override
    public ResponseEntity<String> deleteReservation(Integer id) {
        return reservationService.deleteReservation(id);
    }

    @Override
    public ResponseEntity<String> acceptReservation(Integer id) {
        return reservationService.acceptReservation(id);
    }
}
