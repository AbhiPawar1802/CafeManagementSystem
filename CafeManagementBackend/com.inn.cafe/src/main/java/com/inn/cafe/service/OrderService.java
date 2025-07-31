package com.inn.cafe.service;

import com.inn.cafe.wrapper.OrderWrapper;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface OrderService {

    ResponseEntity<String> placeOrder(Map<String, Object> requestMap);

    ResponseEntity<List<OrderWrapper>> getAllOrders();

    ResponseEntity<List<OrderWrapper>> getOrdersByCustomer(String name);

    ResponseEntity<String> deleteOrder(Integer id);

    ResponseEntity<Map<String, Object>> calculateOrder(List<Map<String, Object>> cartItems);

    ResponseEntity<List<OrderWrapper>> getOrdersByLoggedInCustomer();

    ResponseEntity<String> updatePayment(Map<String, Object> requestMap);

    ResponseEntity<String> updatePaymentStatus(Map<String, Object> requestMap);

    ResponseEntity<String> saveCart(Map<Integer, Object> cartItems);

    ResponseEntity<Map<Integer, Object>> getSavedCart();

    ResponseEntity<Map<String, Object>> getOrderStatus(Integer orderId);

    ResponseEntity<byte[]> downloadBill(Integer orderId);
}
