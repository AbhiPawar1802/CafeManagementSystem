package com.inn.cafe.rest;

import com.inn.cafe.wrapper.OrderWrapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RequestMapping(path = "/order")
public interface OrderRest {

    @PostMapping(path = "/place")
    ResponseEntity<String> placeOrder(@RequestBody Map<String, Object> requestMap);

    @GetMapping(path = "/get")
    ResponseEntity<List<OrderWrapper>> getAllOrders();

    @GetMapping(path = "/search/{name}")
    ResponseEntity<List<OrderWrapper>> getOrderByCustomer(@PathVariable String name);

    @DeleteMapping(path = "/delete/{id}")
    ResponseEntity<String> deleteOrder(@PathVariable Integer id);

    @PostMapping(path = "/calculate")
    ResponseEntity<Map<String, Object>> calculateOrder(@RequestBody List<Map<String, Object>> cartItems);

    @GetMapping(path = "/customer")
    ResponseEntity<List<OrderWrapper>> getLoggedInCustomerOrders();

    @PostMapping("/update-payment")
    ResponseEntity<String> updatePayment(@RequestBody Map<String, Object> requestMap);

    @PostMapping(path = "/updatePaymentStatus")
    ResponseEntity<String> updatePaymentStatus(@RequestBody Map<String, Object> requestMap);

    @PostMapping(path = "/cart")
    ResponseEntity<String> saveCart(@RequestBody Map<Integer, Object> cartItems);

    @GetMapping(path = "/cart")
    ResponseEntity<Map<Integer, Object>> getSavedCart();

    @GetMapping(path = "/status/{orderId}")
    ResponseEntity<Map<String, Object>> getOrderStatus(@PathVariable Integer orderId);

    @GetMapping(path = "/download-bill/{orderId}")
    ResponseEntity<byte[]> downloadBill(@PathVariable Integer orderId);

}
