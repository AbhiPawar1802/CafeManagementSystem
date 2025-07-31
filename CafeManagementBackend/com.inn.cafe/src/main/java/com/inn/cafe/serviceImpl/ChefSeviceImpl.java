package com.inn.cafe.serviceImpl;

import com.inn.cafe.POJO.Chef;
import com.inn.cafe.constents.CafeConstents;
import com.inn.cafe.dao.ChefDao;
import com.inn.cafe.service.ChefService;
import com.inn.cafe.utils.CafeUtils;
import com.inn.cafe.wrapper.ChefWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ChefSeviceImpl implements ChefService {

    @Autowired
    private ChefDao chefDao;

    @Value("${upload.dir}")
    private String uploadDirPath;

    @Override
    public ResponseEntity<String> addChef(Map<String, String> requestMap) {
        try {
            if (validateChefMap(requestMap)) {
                Chef chef = new Chef();
                chef.setName(requestMap.get("name"));
                chef.setSpeciality(requestMap.get("speciality"));
                chef.setDescription(requestMap.get("description"));
                chef.setImageUrl(requestMap.get("imageUrl"));
                chefDao.save(chef);
                return CafeUtils.getResponseEntity("Chef Added Successfully", HttpStatus.OK);
            } else {
                return CafeUtils.getResponseEntity("Invalid Data", HttpStatus.BAD_REQUEST);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstents.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private boolean validateChefMap(Map<String, String> requestMap) {

        return requestMap.containsKey("name") && requestMap.containsKey("speciality") && requestMap.containsKey("description") && requestMap.containsKey("imageUrl");

    }

    @Override
    public ResponseEntity<List<ChefWrapper>> getAllChefs() {
        try {
            List<Chef> chefList = chefDao.findAll();
            List<ChefWrapper> wrapperList = chefList.stream()
                    .map(chef -> new ChefWrapper(
                            chef.getId(),
                            chef.getName(),
                            chef.getSpeciality(),
                            chef.getDescription(),
                            chef.getImageUrl()
                    )).collect(Collectors.toList());
            return ResponseEntity.ok(wrapperList);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.status(500).build();
    }

    @Override
    public ResponseEntity<String> deleteChef(Integer id) {
        try {
            if (chefDao.existsById(id)) {
                chefDao.deleteById(id);
                return CafeUtils.getResponseEntity("Chef deleted Successfully", HttpStatus.OK);
            } else {
                return CafeUtils.getResponseEntity("Chef not found", HttpStatus.BAD_REQUEST);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstents.SOMETHING_WENT_WRONG, HttpStatus.BAD_REQUEST);
    }

    @Override
    public ResponseEntity<String> uploadChefImage(MultipartFile file) {
        try {
            String uploadDirPath = "C:/Users/Admin/CafeApp/uploads"; // Full absolute path for uploads

            File uploadDir = new File(uploadDirPath);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }


            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path fullPath = Paths.get(uploadDir.getAbsolutePath(), fileName);

            file.transferTo(fullPath.toFile());


            String baseUrl = "http://localhost:8082";
            String imageUrl = baseUrl + "/uploads/" + fileName;

            return ResponseEntity.ok(imageUrl);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return ResponseEntity.status(500).body("Image upload failed");
    }
}
