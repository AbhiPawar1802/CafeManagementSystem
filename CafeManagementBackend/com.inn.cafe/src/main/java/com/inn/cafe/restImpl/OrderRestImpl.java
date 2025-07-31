package com.inn.cafe.restImpl;

import com.inn.cafe.constents.CafeConstents;
import com.inn.cafe.rest.OrderRest;
import com.inn.cafe.service.OrderService;
import com.inn.cafe.utils.CafeUtils;
import com.inn.cafe.wrapper.OrderWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class OrderRestImpl implements OrderRest {

    @Autowired
    OrderService orderService;

    @Override
    public ResponseEntity<String> placeOrder(Map<String, Object> requestMap) {
        try{
            return orderService.placeOrder(requestMap);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity("Something Went Wrong", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<List<OrderWrapper>> getAllOrders() {
        try{
            return orderService.getAllOrders();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<List<OrderWrapper>> getOrderByCustomer(String name) {
        try{
            return orderService.getOrdersByCustomer(name);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> deleteOrder(Integer id) {
        try{
            return orderService.deleteOrder(id);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<Map<String, Object>> calculateOrder(List<Map<String, Object>> cartItems) {
        try{
            return orderService.calculateOrder(cartItems);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(new HashMap<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<List<OrderWrapper>> getLoggedInCustomerOrders() {
        try{
            return orderService.getOrdersByLoggedInCustomer();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> updatePayment(Map<String, Object> requestMap) {
        try{
            return orderService.updatePayment(requestMap);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstents.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> updatePaymentStatus(Map<String, Object> requestMap) {
        try{
            return orderService.updatePaymentStatus(requestMap);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstents.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> saveCart(Map<Integer, Object> cartItems) {
        try{
            return orderService.saveCart(cartItems);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity("Something went wrong", HttpStatus.BAD_REQUEST);
    }

    @Override
    public ResponseEntity<Map<Integer, Object>> getSavedCart() {
        try{
            return orderService.getSavedCart();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(new HashMap<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<Map<String, Object>> getOrderStatus(Integer orderId) {
        try{
            return orderService.getOrderStatus(orderId);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return CafeUtils.getErrorMapResponse(CafeConstents.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<byte[]> downloadBill(Integer orderId) {
        try{
            return orderService.downloadBill(orderId);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
