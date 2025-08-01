package com.inn.cafe.dao;

import com.inn.cafe.POJO.Product;
import com.inn.cafe.wrapper.ProductWrapper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ProductDao extends JpaRepository<Product, Integer> {
    List<ProductWrapper> getAllProduct();

    @Modifying
    @Transactional
    Integer updateProductStatus(@Param("status") String status, @Param("id") Integer id);

    List<ProductWrapper> getProductByCategory(@Param("id") Integer id);

    ProductWrapper getProductById(@Param("id") Integer id);

    List<ProductWrapper> getFavorites();

    @Query("SELECT new com.inn.cafe.wrapper.ProductWrapper(p.id, p.name, p.description, p.price) FROM Product p WHERE p.favoritedBy LIKE %:email%")
    List<ProductWrapper> getFavoriteByEmail(@Param("email") String email);

    @Query("SELECT new com.inn.cafe.wrapper.ProductWrapper(p.id, p.name, p.description, p.price, p.imageUrl) FROM Product p WHERE p.favoritedBy LIKE %:email%")
    List<ProductWrapper> getFavoritesByUserEmail(@Param("email") String email);



}