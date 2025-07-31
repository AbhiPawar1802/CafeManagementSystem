package com.inn.cafe.POJO;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.xml.xpath.XPath;
import java.io.Serializable;
import java.util.Date;

@Data
@Entity
@DynamicInsert
@DynamicUpdate
@Table(name = "orders")
public class Order implements Serializable {

    public static final Long serialVersionUID = 123457L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "contact_number")
    private String contactNumber;

    @Column(name = "email")
    private String email;

    @Column(name = "order_date")
    private Date orderDate;

    @Column(name = "total_amount")
    private Integer totalAmount;

    @Column(name = "tax")
    private Integer tax;

    @Column(name = "service_charge")
    private Integer serviceCharge;

    @Column(name = "status")
    private String status;

    @Column(name = "payment_method")
    private String paymentMode;

    @Column(name = "payment_status")
    private String PaymentStatus;

    @Column(name = "transaction_id")
    private String transactionId;

}
