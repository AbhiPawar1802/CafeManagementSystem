package com.inn.cafe.POJO;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "reservation")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;

    @Column(name = "email")
    private String email;

    @Column(name = "phone")
    private String phone;

    @Column(name = "date")
    private String date;

    @Column(name = "message")
    private String message;

    @Column(name = "status")
    private String status = "Pending";
}
