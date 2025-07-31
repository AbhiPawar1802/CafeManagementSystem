package com.inn.cafe.POJO;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
@Table(name = "offers")
public class Offer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "title")
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "discount_percent")
    private Integer discountPercent;

    @Column(name = "min_order_amount")
    private Integer minOrderAmount;

    @Column(name = "code")
    private String code;

    @Column(name = "status")
    private boolean active;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;
}
