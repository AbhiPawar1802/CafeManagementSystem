package com.inn.cafe.rest;

import com.inn.cafe.wrapper.ProductWrapper;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RequestMapping(path = "/product")
public interface ProductRest {

    @PostMapping(path = "/add")
    ResponseEntity<String> addNewProduct(@RequestBody Map<String, String> requestMap);

    @GetMapping(path = "/get")
    ResponseEntity<List<ProductWrapper>> getAllProduct();

    @PutMapping(path = "/update")
    ResponseEntity<String> updateProduct(@RequestBody Map<String, String> requestMap);

    @DeleteMapping(path = "/delete/{id}")
    ResponseEntity<String> deleteProduct(@PathVariable Integer id);

    @PostMapping(path = "/updateStatus")
    ResponseEntity<String> updateStatus(@RequestBody Map<String, String> requestMap);

    @GetMapping(path = "/getByCategory/{id}")
    ResponseEntity<List<ProductWrapper>> getByCategory(@PathVariable Integer id);

    @GetMapping(path = "/getById/{id}")
    ResponseEntity<ProductWrapper> getProductById(@PathVariable Integer id);

    @PostMapping(path = "/upload-image")
    ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file);

    @PostMapping(path = "/add-favorite")
    ResponseEntity<String> addToFavorite(@RequestBody Map<String, Integer> requestMap);

    @PostMapping(path ="/remove-favorite")
    ResponseEntity<String> removeFavorite(@RequestBody Map<String, String> requestMap);

    @GetMapping(path = "/favorite")
    ResponseEntity<List<ProductWrapper>> getFavorite();
}