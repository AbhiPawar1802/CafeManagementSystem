package com.inn.cafe.dao;

import com.inn.cafe.POJO.Customer;
import com.inn.cafe.wrapper.CustomerWrapper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerDao extends JpaRepository<Customer, Integer> {

    Optional<Customer> findByEmail(String email);

    @Query("select new com.inn.cafe.wrapper.CustomerWrapper(c.id, c.name, c.email, c.contactNumber, c.status) FROM Customer c")
    List<CustomerWrapper> getAllCustomers();

    @Query("SELECT c.email FROM Customer c WHERE c.role = 'CUSTOMER'")
    List<String> getAllCustomerEmails();

    @Transactional
    @Modifying
    @Query("UPDATE Customer c SET c.status = :status WHERE c.id = :id")
    Integer updateStatus(@Param("status") String status, @Param("id") Integer id);



}

