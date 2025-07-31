package com.inn.cafe.serviceImpl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.inn.cafe.JWT.JwtFilter;
import com.inn.cafe.POJO.Order;
import com.inn.cafe.POJO.Product;
import com.inn.cafe.constents.CafeConstents;
import com.inn.cafe.dao.OfferDao;
import com.inn.cafe.dao.OrderDao;
import com.inn.cafe.dao.ProductDao;
import com.inn.cafe.service.OrderService;
import com.inn.cafe.utils.CafeUtils;
import com.inn.cafe.wrapper.OrderWrapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import com.inn.cafe.utils.BillPdfGenerator;

import com.inn.cafe.POJO.Offer;


import java.io.ByteArrayOutputStream;
import java.security.PrivateKey;
import java.util.*;

@Slf4j
@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    OrderDao orderDao;

    @Autowired
    JwtFilter jwtFilter;

    @Autowired
    ProductDao productDao;

    @Autowired
    private OfferDao offerDao;


    private final Map<String, Map<Integer, Object>> customerCartStore = new HashMap<>();

    @Override
    public ResponseEntity<String> placeOrder(Map<String, Object> requestMap) {
        try {
            if (jwtFilter.isCustomer()) {
                String email = (String) requestMap.get("email");
                int orderCount = orderDao.countByEmail(email) + 1;

                Order order = new Order();
                order.setCustomerName((String) requestMap.get("customerName"));
                order.setContactNumber((String) requestMap.get("contactNumber"));
                order.setEmail(email);
                order.setOrderDate(new Date());

                Object totalAmountObj = requestMap.get("totalAmount");
                Object taxObj = requestMap.get("tax");
                Object serviceChargeObj = requestMap.get("serviceCharge");

                int totalAmount = (totalAmountObj instanceof Number) ? ((Number) totalAmountObj).intValue() : 0;
                int tax = (taxObj instanceof Number) ? ((Number) taxObj).intValue() : 0;
                int serviceCharge = (serviceChargeObj instanceof Number) ? ((Number) serviceChargeObj).intValue() : 0;

                // Apply discount on every 7th order
                if (orderCount % 7 == 0) {
                    int discountPercent = new Random().nextInt(17) + 23;
                    int discountAmount = (totalAmount * discountPercent) / 100;
                    totalAmount -= discountAmount;
                }

                order.setTotalAmount(totalAmount);
                order.setTax(tax);
                order.setServiceCharge(serviceCharge);

                order.setStatus("Pending Payment");

                // No payment info at this stage
                order.setPaymentMode(null);
                order.setPaymentStatus("Pending");
                order.setTransactionId(null);

                orderDao.save(order);

                // Just confirm order placed, payment to be handled separately
                Map<String, Object> response = new HashMap<>();
                response.put("orderId", order.getId());
                response.put("message", "Order created successfully. Please proceed with payment.");

                ObjectMapper mapper = new ObjectMapper();
                String jsonResponse = mapper.writeValueAsString(response);

                return new ResponseEntity<>(jsonResponse, HttpStatus.OK);
            }
            return CafeUtils.getResponseEntity("Unauthorized Access", HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity("Something Went Wrong", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<List<OrderWrapper>> getAllOrders() {
        try {
            List<Order> orders = orderDao.findAll();
            List<OrderWrapper> wrappers = new ArrayList<>();

            for (Order o : orders) {
                wrappers.add(new OrderWrapper(o));
            }
            return new ResponseEntity<>(wrappers, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<List<OrderWrapper>> getOrdersByCustomer(String name) {
        try {
            List<Order> orders = orderDao.findByCustomerNameContainingIgnoreCase(name);
            List<OrderWrapper> wrappers = new ArrayList<>();

            for (Order o : orders) {
                wrappers.add(new OrderWrapper(o));
            }
            return new ResponseEntity<>(wrappers, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<String> deleteOrder(Integer id) {
        try {
            Optional<Order> optional = orderDao.findById(id);
            if (optional.isPresent()) {
                orderDao.deleteById(id);
                return CafeUtils.getResponseEntity("Order deleted successfully", HttpStatus.OK);
            } else {
                return CafeUtils.getResponseEntity("Order not found", HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<Map<String, Object>> calculateOrder(List<Map<String, Object>> cartItems) {
        try {
            double subtotal = 0.0;

            for (Map<String, Object> item : cartItems) {
                Integer productId = (Integer) item.get("productId");
                Integer quantity = (Integer) item.get("quantity");

                Optional<Product> optionalProduct = productDao.findById(Math.toIntExact(Long.valueOf(productId)));
                if (optionalProduct.isPresent()) {
                    double price = optionalProduct.get().getPrice();
                    subtotal += price * quantity;
                } else {
                    return CafeUtils.getErrorMapResponse("Product not found with Id: " + productId, HttpStatus.BAD_REQUEST);
                }
            }
            double gst = subtotal * 0.18;
            double serviceCharge = subtotal * 0.07;
            double total = subtotal + gst + serviceCharge;

            Map<String, Object> response = new HashMap<>();
            response.put("subtotal", subtotal);
            response.put("gst", gst);
            response.put("serviceCharge", serviceCharge);
            response.put("total", total);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(new HashMap<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<List<OrderWrapper>> getOrdersByLoggedInCustomer() {
        try {
            String email = jwtFilter.getCurrentUser();
            List<Order> orders = orderDao.findAll();
            List<OrderWrapper> wrappers = new ArrayList<>();

            for (Order o : orders) {
                if (o.getEmail().equalsIgnoreCase(email)) {
                    wrappers.add(new OrderWrapper(o));
                }
            }
            return new ResponseEntity<>(wrappers, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<String> updatePayment(Map<String, Object> requestMap) {
        try {
            if (jwtFilter.isCustomer()) {
                Integer orderId = (Integer) requestMap.get("orderId");
                String paymentMode = (String) requestMap.get("paymentMode");
                String transactionId = (String) requestMap.get("transactionId");

                Optional<Order> optionalOrder = orderDao.findById(orderId);
                if (optionalOrder.isPresent()) {
                    Order order = optionalOrder.get();
                    order.setPaymentMode(paymentMode);
                    order.setTransactionId(transactionId);
                    order.setPaymentStatus("Success");
                    order.setStatus("Confirmed");

                    orderDao.save(order);
                    return CafeUtils.getResponseEntity("Payment updated successfully", HttpStatus.OK);
                } else {
                    return CafeUtils.getResponseEntity("Order not found", HttpStatus.BAD_REQUEST);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> updatePaymentStatus(Map<String, Object> requestMap) {
        try {
            if(!requestMap.containsKey("paymentStatus") ||
                    !requestMap.containsKey("transactionId") ||
                    !requestMap.containsKey("paymentMode")){
                return CafeUtils.getResponseEntity("Missing required fields", HttpStatus.BAD_REQUEST);
            }

            Integer orderId = (Integer) requestMap.get("orderId");
            String paymentStatus = (String) requestMap.get("paymentStatus");
            String transactionId = (String) requestMap.get("transactionId");
            String paymentMode = (String) requestMap.get("paymentMode");

            if(!paymentStatus.equalsIgnoreCase("Paid") && !paymentStatus.equalsIgnoreCase("Not Paid") && !paymentStatus.equalsIgnoreCase("Pending") && !paymentStatus.equalsIgnoreCase("Success")) {
                return CafeUtils.getResponseEntity("Invalid payment status value", HttpStatus.BAD_REQUEST);
            }

            Optional<Order> optionalOrder = orderDao.findById(orderId);
            if (optionalOrder.isEmpty()) {
                return CafeUtils.getResponseEntity("Order not found", HttpStatus.NOT_FOUND);
            }

            Order order = optionalOrder.get();
            order.setPaymentStatus(paymentStatus);
            order.setTransactionId(transactionId);
            order.setPaymentMode(paymentMode);

            if (paymentStatus.equalsIgnoreCase("Paid") || paymentStatus.equalsIgnoreCase("Success")) {
                order.setStatus("Confirmed");
            } else if (paymentStatus.equalsIgnoreCase("Not Paid")) {
                order.setStatus("Pending Payment");
            }

            orderDao.save(order);

            return CafeUtils.getResponseEntity("Payment status updated successfully", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstents.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> saveCart(Map<Integer, Object> cartItems) {
        try{
            String email = jwtFilter.getCurrentUser();
            customerCartStore.put(email, cartItems);
            return CafeUtils.getResponseEntity("Cart saved successfully", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstents.SOMETHING_WENT_WRONG, HttpStatus.BAD_REQUEST);
    }

    @Override
    public ResponseEntity<Map<Integer, Object>> getSavedCart() {
        try{
            String email = jwtFilter.getCurrentUser();
            Map<Integer, Object> savedCart = customerCartStore.getOrDefault(email, new HashMap<>());
            return new ResponseEntity<>(savedCart, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(new HashMap<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<Map<String, Object>> getOrderStatus(Integer orderId) {
        try{
            if(orderId == null){
                return CafeUtils.getErrorMapResponse("Order ID is required", HttpStatus.BAD_REQUEST);
            }

            Optional<Order> optional = orderDao.findById(orderId);
            if(optional.isEmpty()){
                return CafeUtils.getErrorMapResponse("Order not found", HttpStatus.BAD_REQUEST);
            }

            Order order = optional.get();
            Map<String, Object> response = new HashMap<>();
            response.put("orderId", order.getId());
            response.put("status", order.getStatus());
            response.put("paymentStatus", order.getPaymentStatus());
            response.put("paymentMode", order.getPaymentMode());
            response.put("transactionId", order.getTransactionId());

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return CafeUtils.getErrorMapResponse(CafeConstents.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<byte[]> downloadBill(Integer orderId) {
        try {
            Optional<Order> optionalOrder = orderDao.findById(orderId);
            if (optionalOrder.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            Order order = optionalOrder.get();

            // 🔥 If you don't want to fetch any offer, set this to null
            Offer offer = null;

            // 🧾 Generate styled bill
            byte[] pdfBytes = BillPdfGenerator.generateStyledBill(order, offer);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "bill_order_" + orderId + ".pdf");

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }




}
