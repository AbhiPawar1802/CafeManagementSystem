package com.inn.cafe.POJO;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "customers")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "contactNumber")
    private String contactNumber;

    @Column(name = "role")
    private String role = "CUSTOMER";

    @Column(name = "status")
    private String status = "ACTIVE";

    @Column(name = "otp")
    private String otp;

    @Column(name = "otpExpiry")
    private LocalDateTime otpExpiry;

    @Column(name = "address_line")
    private String address;

    @Column(name = "city")
    private String city;

    @Column(name = "pincode")
    private String pincode;

    @Column(name = "state")
    private String state;

    @Column(name = "landmark")
    private String landmark;

}
