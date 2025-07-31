package com.inn.cafe.serviceImpl;

import com.inn.cafe.POJO.Customer;
import com.inn.cafe.POJO.Reservation;
import com.inn.cafe.constents.CafeConstents;
import com.inn.cafe.dao.CustomerDao;
import com.inn.cafe.dao.ReservationDao;
import com.inn.cafe.service.ReservationService;
import com.inn.cafe.utils.CafeUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ReservationServiceImpl implements ReservationService {

    @Autowired
    ReservationDao reservationDao;

    @Autowired
    CustomerDao customerDao;

    private static final Logger log = LoggerFactory.getLogger(ReservationServiceImpl.class);

    @Override
    @Transactional
    public ResponseEntity<String> addReservation(Reservation reservation) {
        log.info("Saving reservation: {}", reservation);
        reservationDao.save(reservation);
        log.info("Reservation saved successfully!");
        return ResponseEntity.ok("Reservation added successfully!");
    }

    @Override
    public ResponseEntity<List<Reservation>> getAllReservation() {
        return ResponseEntity.ok(reservationDao.findAll());
    }

    @Override
    public ResponseEntity<String> deleteReservation(Integer id) {
        Optional<Reservation> reservation = reservationDao.findById(id);
        if (reservation.isPresent()) {
            reservationDao.deleteById(id);
            return ResponseEntity.ok("Reservation deleted successfully!");
        }
        return ResponseEntity.badRequest().body("Reservation not found!");
    }

    @Override
    public ResponseEntity<String> acceptReservation(Integer id) {
        try {
            Optional<Reservation> optionalReservation = reservationDao.findById(id);
            if (optionalReservation.isPresent()) {
                Reservation reservation = optionalReservation.get();
                reservation.setStatus("Accepted");
                reservationDao.save(reservation);

                String customerEmail = reservation.getEmail();
                if (customerEmail == null) {
                    return CafeUtils.getResponseEntity("Customer email missing in reservation", HttpStatus.BAD_REQUEST);
                }

                Optional<Customer> optionalCustomer = customerDao.findByEmail(customerEmail);
                if (optionalCustomer.isEmpty()) {
                    return CafeUtils.getResponseEntity("Customer not found for this reservation", HttpStatus.BAD_REQUEST);
                }

                // SMS sending removed here
                return CafeUtils.getResponseEntity("Reservation accepted!", HttpStatus.OK);
            } else {
                return CafeUtils.getResponseEntity("Reservation not found!", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            log.error("Error accepting reservation: ", e);
            return CafeUtils.getResponseEntity(CafeConstents.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
