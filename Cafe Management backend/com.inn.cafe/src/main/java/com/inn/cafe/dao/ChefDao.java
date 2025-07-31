package com.inn.cafe.dao;

import com.inn.cafe.POJO.Chef;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChefDao extends JpaRepository<Chef, Integer> {

    List<Chef> findAll();
}
