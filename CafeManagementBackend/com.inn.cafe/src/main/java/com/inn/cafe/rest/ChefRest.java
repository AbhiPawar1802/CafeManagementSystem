package com.inn.cafe.rest;

import com.inn.cafe.POJO.Chef;
import com.inn.cafe.wrapper.ChefWrapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RequestMapping("/chef")
public interface ChefRest {

    @PostMapping("/add")
    ResponseEntity<String> addChef(@RequestBody Map<String, String> requestMap);

    @GetMapping("/get")
    ResponseEntity<List<ChefWrapper>> getAllChefs();

    @DeleteMapping("/delete/{id}")
    ResponseEntity<String> deleteChef(@PathVariable Integer id);

    @PostMapping(path = "/upload-image")
    ResponseEntity<String> uploadChefImage(@RequestParam("file") MultipartFile file);
}
