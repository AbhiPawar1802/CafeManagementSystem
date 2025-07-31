package com.inn.cafe.restImpl;

import com.inn.cafe.POJO.Chef;
import com.inn.cafe.rest.ChefRest;
import com.inn.cafe.service.ChefService;
import com.inn.cafe.wrapper.ChefWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/chef")
public class ChefRestImpl implements ChefRest {

    @Autowired
    private ChefService chefService;

    @Override
    public ResponseEntity<String> addChef(Map<String, String> requestMap) {
        return chefService.addChef(requestMap);
    }

    @Override
    public ResponseEntity<List<ChefWrapper>> getAllChefs() {
        return chefService.getAllChefs();
    }

    @Override
    public ResponseEntity<String> deleteChef(Integer id) {
        return chefService.deleteChef(id);
    }

    @Override
    public ResponseEntity<String> uploadChefImage(@RequestParam("file") MultipartFile file) {
        try {
            return chefService.uploadChefImage(file);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return new ResponseEntity<>("Image Upload Failed", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
