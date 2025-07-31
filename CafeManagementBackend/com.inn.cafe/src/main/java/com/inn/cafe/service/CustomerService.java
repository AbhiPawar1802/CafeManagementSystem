package com.inn.cafe.service;

import com.inn.cafe.wrapper.CustomerWrapper;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public interface CustomerService {

    ResponseEntity<String> registerCustomer(Map<String, String> requestMap);

    ResponseEntity<String> loginCustomer(Map<String, String> requestMap);

    ResponseEntity<String> forgotPassword(Map<String, String> requestMap);

    ResponseEntity<String> resetPassword(Map<String, String> requestMap);

    ResponseEntity<?> getCustomerProfile();

    ResponseEntity<String> verifyOtp(Map<String, String> requestMap);

    ResponseEntity<String> saveOrUpdateAddress(Map<String, Object> requestMap);

    ResponseEntity<List<CustomerWrapper>> getAllCustomers();

    ResponseEntity<String> updateCustomer(Map<String, Object> requestMap);

    ResponseEntity<String> deleteCustomer(Integer id);
}
