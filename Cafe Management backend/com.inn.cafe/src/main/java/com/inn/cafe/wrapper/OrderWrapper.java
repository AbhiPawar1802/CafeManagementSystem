package com.inn.cafe.wrapper;

import com.inn.cafe.POJO.Order;
import lombok.Data;

import java.util.Date;

@Data
public class OrderWrapper {
    private Integer id;
    private String customerName;
    private String contactNumber;
    private String email;
    private Date orderDate;
    private Integer totalAmount;
    private Integer tax;
    private Integer ServiceCharge;
    private String status;
    private String paymentMode;
    private String paymentStatus;
    private String transactionId;

    public OrderWrapper(Order order){
        this.id = order.getId();
        this.customerName = order.getCustomerName();
        this.contactNumber = order.getContactNumber();
        this.email = order.getEmail();
        this.orderDate = order.getOrderDate();
        this.totalAmount = order.getTotalAmount();
        this.tax = order.getTax();
        this.ServiceCharge = order.getServiceCharge();
        this.status = order.getStatus();
        this.paymentMode = order.getPaymentMode();
        this.paymentStatus = order.getPaymentStatus();
        this.transactionId = order.getTransactionId();

    }
}
