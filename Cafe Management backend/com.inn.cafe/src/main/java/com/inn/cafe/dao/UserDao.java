package com.inn.cafe.dao;

import com.inn.cafe.POJO.User;
import com.inn.cafe.wrapper.UserWrapper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserDao extends JpaRepository<User, Integer> {

    Optional<User> findByEmailId(String email);

    @Query("SELECT new com.inn.cafe.wrapper.UserWrapper(u.id, u.name, u.email,u.contactNumber, u.status, u.role) FROM User u")
    List<UserWrapper> getAllUser();

    @Query("SELECT u.email FROM User u WHERE u.role = 'ADMIN'")
    List<String> getAllAdmin();

    @Transactional
    @Modifying
    @Query("UPDATE User u SET u.status = :status WHERE u.id = :id")
    Integer updateStatus(@Param("status") String status, @Param("id") Integer id);

    User findByEmail(String email);

    @Query("SELECT new com.inn.cafe.wrapper.UserWrapper(u.id, u.name, u.email, u.contactNumber, u.status, u.role) FROM User u WHERE u.role = 'admin'")
    List<UserWrapper> getAllAdminDetails();
}
