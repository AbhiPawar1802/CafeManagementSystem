package com.inn.cafe.rest;

import com.inn.cafe.JWT.JwtUtil;
import com.inn.cafe.service.CustomerService;
import com.inn.cafe.service.ReservationService;
import com.inn.cafe.wrapper.CustomerWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping(path = "/customer")
public interface CustomerRest {

    @PostMapping(path = "/register")
    ResponseEntity<String> registerCustomer(@RequestBody Map<String, String> requestMap);

    @PostMapping(path = "/login")
    ResponseEntity<String> loginCustomer(@RequestBody Map<String, String> requestMap);

    @PostMapping(path = "/forgot")
    ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> requestMap);

    @PostMapping(path = "/verify-otp")
    ResponseEntity<String> verifyOtp(@RequestBody Map<String, String> requestMap);

    @PostMapping(path = "/reset")
    ResponseEntity<String> resetPassword(@RequestBody Map<String, String> requestMap);

    @GetMapping(path = "/profile")
    ResponseEntity<?> getCustomerProfile();

    @PostMapping(path = "/address")
    ResponseEntity<String> saveOrUpdateAddress(@RequestBody Map<String, Object> requestMap);

    @GetMapping(path = "/get")
    ResponseEntity<List<CustomerWrapper>> getAllCustomers();

    @PutMapping(path = "/update")
    ResponseEntity<String> updateCustomer(@RequestBody Map<String, Object> requestMap);

    @DeleteMapping(path = "/delete/{id}")
    ResponseEntity<String> deleteCustomer(@PathVariable Integer id);
}
