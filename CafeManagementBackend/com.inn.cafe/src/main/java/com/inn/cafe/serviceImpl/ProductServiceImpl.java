package com.inn.cafe.serviceImpl;

import com.inn.cafe.JWT.JwtFilter;
import com.inn.cafe.POJO.Category;
import com.inn.cafe.POJO.Customer;
import com.inn.cafe.POJO.Product;
import com.inn.cafe.POJO.User;
import com.inn.cafe.constents.CafeConstents;
import com.inn.cafe.dao.CustomerDao;
import com.inn.cafe.dao.ProductDao;
import com.inn.cafe.dao.UserDao;
import com.inn.cafe.service.ProductService;
import com.inn.cafe.utils.CafeUtils;
import com.inn.cafe.wrapper.ProductWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    ProductDao productDao;

    @Autowired
    JwtFilter jwtFilter;

    @Autowired
    UserDao userDao;

    @Autowired
    CustomerDao customerDao;

    @Override
    public ResponseEntity<String> addNewProduct(Map<String, String> requestMap) {
        try {
            if (jwtFilter.isAdmin()) {
                if (validateProductMap(requestMap, false)) {
                    String imageUrl = requestMap.get("imageUrl");

                    Product product = getProductFromMap(requestMap, false);
                    product.setImageUrl(imageUrl);

                    productDao.save(product);
                    return CafeUtils.getResponseEntity("Product Added Successfully.", HttpStatus.OK);
                }
                return CafeUtils.getResponseEntity(CafeConstents.INVALID_DATA, HttpStatus.BAD_REQUEST);
            } else {
                return CafeUtils.getResponseEntity(CafeConstents.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstents.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private boolean validateProductMap(Map<String, String> requestMap, boolean validateId) {
        if (requestMap.containsKey("name")) {
            if (requestMap.containsKey("id") && validateId) {
                return true;
            } else if (!validateId) {
                return true;
            }
        }
        return false;
    }

    private Product getProductFromMap(Map<String, String> requestMap, boolean isAdd) {
        Category category = new Category();
        category.setId(Integer.parseInt(requestMap.get("categoryId")));

        Product product = new Product();
        if (isAdd) {
            product.setId(Integer.parseInt(requestMap.get("id")));
        } else {
            product.setStatus("true");
        }
        product.setCategory(category);
        product.setName(requestMap.get("name"));
        product.setDescription(requestMap.get("description"));
        product.setPrice(Integer.parseInt(requestMap.get("price")));
        product.setImageUrl(requestMap.get("imageUrl"));
        return product;
    }

    @Override
    public ResponseEntity<List<ProductWrapper>> getAllProduct() {
        try {
            return new ResponseEntity<>(productDao.getAllProduct(), HttpStatus.OK);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> updateProduct(Map<String, String> requestMap) {
        try {
            if (jwtFilter.isAdmin()) {
                if (validateProductMap(requestMap, true)) {
                    Optional<Product> optional = productDao.findById(Integer.parseInt(requestMap.get("id")));
                    if (!optional.isEmpty()) {
                        Product product = getProductFromMap(requestMap, true);
                        product.setStatus(optional.get().getStatus());
                        productDao.save(product);
                        return CafeUtils.getResponseEntity("Product updated Successfully", HttpStatus.OK);
                    } else {
                        return CafeUtils.getResponseEntity("Product does not exist", HttpStatus.OK);
                    }
                } else {
                    return CafeUtils.getResponseEntity(CafeConstents.INVALID_DATA, HttpStatus.BAD_REQUEST);
                }
            } else {
                return CafeUtils.getResponseEntity(CafeConstents.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstents.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> deleteProduct(Integer id) {
        try {
            if (jwtFilter.isAdmin()) {
                Optional<Product> optional = productDao.findById(id);
                if (!optional.isEmpty()) {
                    productDao.deleteById(id);
                    return CafeUtils.getResponseEntity("Product deleted Successfully", HttpStatus.OK);
                } else {
                    return CafeUtils.getResponseEntity("Product Id does not exist", HttpStatus.OK);
                }
            } else {
                return CafeUtils.getResponseEntity(CafeConstents.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstents.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> updateStatus(Map<String, String> requestMap) {
        try {
            if (jwtFilter.isAdmin()) {
                Optional<Product> optional = productDao.findById(Integer.parseInt(requestMap.get("id")));
                if (!optional.isEmpty()) {
                    productDao.updateProductStatus(requestMap.get("status"), Integer.parseInt(requestMap.get("id")));
                    return CafeUtils.getResponseEntity("Product Status Updated Successfully.", HttpStatus.OK);
                } else {
                    return CafeUtils.getResponseEntity("Product Id does not exist", HttpStatus.OK);
                }
            } else {
                return CafeUtils.getResponseEntity(CafeConstents.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstents.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<List<ProductWrapper>> getByCategory(Integer id) {
        try {
            return new ResponseEntity<>(productDao.getProductByCategory(id), HttpStatus.OK);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<ProductWrapper> getProductById(Integer id) {
        try {
            return new ResponseEntity<>(productDao.getProductById(id), HttpStatus.OK);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return new ResponseEntity<>(new ProductWrapper(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> uploadImage(MultipartFile file) {
        try {
            if (!jwtFilter.isAdmin()) {
                return CafeUtils.getResponseEntity(CafeConstents.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
            }
            if (file == null || file.isEmpty()) {
                return CafeUtils.getResponseEntity("File is empty", HttpStatus.BAD_REQUEST);
            }
            String uploadDirPath = "C:/Users/Admin/CafeApp/uploads/";
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

        } catch (Exception e) {
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstents.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> addToFavorite(Map<String, Integer> requestMap) {
        try {
            Integer productId = requestMap.get("productId");
            String userEmail = jwtFilter.getCurrentUserEmail();
            if(userEmail == null){
                return CafeUtils.getResponseEntity(CafeConstents.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
            }

            Optional<Product> optionalProduct = productDao.findById(productId);
            if(optionalProduct.isPresent()){
                Product product = optionalProduct.get();

                String favoritedBy = product.getFavoritedBy();
                Set<String> emails = new HashSet<>();
                if(favoritedBy !=null && favoritedBy.isEmpty()){
                    emails.addAll(Arrays.asList(favoritedBy.split(",")));
                }

                emails.add(userEmail);
                product.setFavoritedBy(String.join(",", emails));
                productDao.save(product);
                return CafeUtils.getResponseEntity("Product marked as marked.", HttpStatus.OK);
            }else{
                return CafeUtils.getResponseEntity("Product not found", HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstents.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> removeFavorite(Map<String, String> requestMap) {
        try {
            String email = jwtFilter.getCurrentUser(); // Extract email from token
            Optional<Customer> user = customerDao.findByEmail(email);

            if (user == null) {
                return CafeUtils.getResponseEntity("Unauthorized", HttpStatus.UNAUTHORIZED);
            }

            int productId = Integer.parseInt(requestMap.get("productId"));
            Optional<Product> optionalProduct = productDao.findById(productId);

            if (optionalProduct.isPresent()) {
                Product product = optionalProduct.get();
                String favoritedBy = product.getFavoritedBy();

                if (favoritedBy == null || favoritedBy.isEmpty()) {
                    return CafeUtils.getResponseEntity("Product not favorited", HttpStatus.BAD_REQUEST);
                }

                List<String> emails = new ArrayList<>(Arrays.asList(favoritedBy.split(",")));

                if (emails.contains(email)) {
                    emails.remove(email);
                    product.setFavoritedBy(String.join(",", emails));
                    productDao.save(product);
                    return CafeUtils.getResponseEntity("Product removed from favorites.", HttpStatus.OK);
                } else {
                    return CafeUtils.getResponseEntity("You haven't favorited this product.", HttpStatus.BAD_REQUEST);
                }
            } else {
                return CafeUtils.getResponseEntity("Product not found.", HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return CafeUtils.getResponseEntity(CafeConstents.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @Override
    public ResponseEntity<List<ProductWrapper>> getFavorite() {
        try{
            String email = jwtFilter.getCurrentUser();

            List<ProductWrapper> favoriteProducts = productDao.getFavoritesByUserEmail(email);
            return new ResponseEntity<>(favoriteProducts, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}