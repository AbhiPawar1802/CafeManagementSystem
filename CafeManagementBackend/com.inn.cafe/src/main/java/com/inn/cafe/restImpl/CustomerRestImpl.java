package com.inn.cafe.restImpl;

import com.inn.cafe.constents.CafeConstents;
import com.inn.cafe.rest.CustomerRest;
import com.inn.cafe.service.CustomerService;
import com.inn.cafe.utils.CafeUtils;
import com.inn.cafe.wrapper.CustomerWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(path = "/customer")
public class CustomerRestImpl implements CustomerRest {

    @Autowired
    CustomerService customerService;

    @Override
    public ResponseEntity<String> registerCustomer(Map<String, String> requestMap) {
        return customerService.registerCustomer(requestMap);
    }

    @Override
    public ResponseEntity<String> loginCustomer(Map<String, String> requestMap) {
        return customerService.loginCustomer(requestMap);
    }

    @Override
    public ResponseEntity<String> forgotPassword(Map<String, String> requestMap) {
        return customerService.forgotPassword(requestMap);
    }

    @Override
    public ResponseEntity<String> verifyOtp(Map<String, String> requestMap) {
        return customerService.verifyOtp(requestMap);
    }

    @Override
    public ResponseEntity<String> resetPassword(Map<String, String> requestMap) {
        return customerService.resetPassword(requestMap);
    }

    @Override
    public ResponseEntity<?> getCustomerProfile() {
        return customerService.getCustomerProfile();
    }

    @Override
    public ResponseEntity<String> saveOrUpdateAddress(Map<String, Object> requestMap) {
        try{
            return customerService.saveOrUpdateAddress(requestMap);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstents.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<List<CustomerWrapper>> getAllCustomers() {
        return customerService.getAllCustomers();
    }

    @Override
    public ResponseEntity<String> updateCustomer(Map<String, Object> requestMap) {
        return customerService.updateCustomer(requestMap);
    }

    @Override
    public ResponseEntity<String> deleteCustomer(Integer id) {
        return customerService.deleteCustomer(id);
    }
}
