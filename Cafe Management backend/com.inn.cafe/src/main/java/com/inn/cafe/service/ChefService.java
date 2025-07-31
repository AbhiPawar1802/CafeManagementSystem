package com.inn.cafe.service;

import com.inn.cafe.POJO.Chef;
import com.inn.cafe.wrapper.ChefWrapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface ChefService {

    ResponseEntity<String> addChef(Map<String, String> requestMap);

    ResponseEntity<List<ChefWrapper>> getAllChefs();

    ResponseEntity<String> deleteChef(Integer id);

    ResponseEntity<String> uploadChefImage(MultipartFile file);

}
