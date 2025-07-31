package com.inn.cafe.dao;

import com.inn.cafe.POJO.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderDao extends JpaRepository<Order, Integer> {

    List<Order> findByCustomerNameContainingIgnoreCase(String name);

    int countByEmail(String email);

}
