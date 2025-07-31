package com.inn.cafe.serviceImpl;

import com.inn.cafe.JWT.JwtFilter;
import com.inn.cafe.JWT.JwtUtil;
import com.inn.cafe.POJO.Customer;
import com.inn.cafe.constents.CafeConstents;
import com.inn.cafe.dao.CustomerDao;
import com.inn.cafe.service.CustomerService;
import com.inn.cafe.utils.CafeUtils;
import com.inn.cafe.utils.EmailUtils;
import com.inn.cafe.utils.OTPUtils;
import com.inn.cafe.wrapper.CustomerWrapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    CustomerDao customerDao;

    @Autowired
    EmailUtils emailUtils;

    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtFilter jwtFilter;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();


    @Override
    public ResponseEntity<String> registerCustomer(Map<String, String> requestMap) {
        try {
            log.info("Inside Customer Signup: {}", requestMap);

            if (validateCustomerRequest(requestMap)) {
                Optional<Customer> optionalCustomer = customerDao.findByEmail(requestMap.get("email"));

                if (optionalCustomer.isPresent()) {
                    log.warn("Signup failed: Email {} already exist.", requestMap.get("email"));
                    return CafeUtils.getResponseEntity("Email already exists.", HttpStatus.BAD_REQUEST);
                }

                Customer newCustomer = getCustomerFromMap(requestMap);
                customerDao.save(newCustomer);

                log.info("Customer {}  successfully registered.", requestMap.get("email"));
                return CafeUtils.getResponseEntity("Successfully registered.", HttpStatus.OK);
            } else {
                log.warn("Invalid Signup data: {}", requestMap);
                return CafeUtils.getResponseEntity(CafeConstents.INVALID_DATA, HttpStatus.BAD_REQUEST);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstents.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private Customer getCustomerFromMap(Map<String, String> requestMap) {
        Customer customer = new Customer();
        customer.setName(requestMap.get("name"));
        customer.setEmail(requestMap.get("email"));
        customer.setPassword(passwordEncoder.encode(requestMap.get("password")));
        customer.setContactNumber(requestMap.get("contactNumber"));
        customer.setRole("CUSTOMER");
        customer.setRole("ACTIVE");
        return customer;
    }

    private boolean validateCustomerRequest(Map<String, String> requestMap) {
        return requestMap.containsKey("name") &&
                requestMap.containsKey("email") &&
                requestMap.containsKey("password") &&
                requestMap.containsKey("contactNumber");
    }

    @Override
    public ResponseEntity<String> loginCustomer(Map<String, String> requestMap) {
        log.info("Inside Customer Login: {}", requestMap.get("email"));

        try {
            Optional<Customer> optionalCustomer = customerDao.findByEmail(requestMap.get("email"));
            if (optionalCustomer.isPresent()) {
                Customer customer = optionalCustomer.get();

                if (!passwordEncoder.matches(requestMap.get("password"), customer.getPassword())) {
                    log.warn("Login failed: Incorrect password for customer {}", requestMap.get("email"));
                    return new ResponseEntity<>("{\"message\":\"Bad Credentials.\"}", HttpStatus.BAD_REQUEST);
                }

                // No need to re-authenticate with Spring Security
                String token = jwtUtil.generateToken(customer.getEmail(), "CUSTOMER");
                log.info("Login successful {}", requestMap.get("email"));
                return new ResponseEntity<>("{\"token\":\"" + token + "\"}", HttpStatus.OK);
            } else {
                log.warn("Login failed: Customer not found {}", requestMap.get("email"));
                return new ResponseEntity<>("{\"message\":\"Customer not found\"}", HttpStatus.BAD_REQUEST);
            }
        } catch (Exception ex) {
            log.error("Login error", ex);
            return CafeUtils.getResponseEntity(CafeConstents.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @Override
    public ResponseEntity<String> forgotPassword(Map<String, String> requestMap) {
        try {
            String email = requestMap.get("email");
            Optional<Customer> customerOptional = customerDao.findByEmail(email);

            if (customerOptional.isPresent()) {
                Customer customer = customerOptional.get();

                String otp = OTPUtils.generateOtp();
                customer.setOtp(otp);
                customer.setOtpExpiry(LocalDateTime.now().plusMinutes(5));

                customerDao.save(customer);

                emailUtils.sendOtpEmail(email, otp);

                return new ResponseEntity<>("OTP sent to your email.", HttpStatus.OK);
            }
            return new ResponseEntity<>("Email not registered.", HttpStatus.BAD_REQUEST);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstents.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> resetPassword(Map<String, String> requestMap) {
        try {
            String email = requestMap.get("email");
            String otp = requestMap.get("otp");
            String newPassword = requestMap.get("newPassword");

            Optional<Customer> customerOptional = customerDao.findByEmail(email);

            if (customerOptional.isPresent()) {
                Customer customer = customerOptional.get();
                if (customer.getOtp().equals(otp) && customer.getOtpExpiry().isAfter(LocalDateTime.now())) {
                    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
                    customer.setPassword(encoder.encode(newPassword));

                    customer.setOtp(null);
                    customer.setOtpExpiry(null);

                    customerDao.save(customer);
                    return new ResponseEntity<>("Password updated successfully.", HttpStatus.OK);
                } else {
                    return new ResponseEntity<>("Invalid or expired OTP.", HttpStatus.BAD_REQUEST);
                }
            }
            return new ResponseEntity<>("Email not registered.", HttpStatus.BAD_REQUEST);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstents.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private String getCurrentUserEmailFromContext() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails userDetails) {
            return userDetails.getUsername();
        }
        return null;
    }

    @Override
    public ResponseEntity<?> getCustomerProfile() {
        try {
            String email = getCurrentUserEmailFromContext();
            if (email == null) {
                return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
            }
             Optional<Customer> optionalCustomer = customerDao.findByEmail(email);

            if(optionalCustomer.isPresent()){
                Customer customer = optionalCustomer.get();
                Map<String, Object> profile = new HashMap<>();
                profile.put("name", customer.getName());
                profile.put("email", customer.getEmail());
                profile.put("contactNumber", customer.getContactNumber());

                return new ResponseEntity<>(profile, HttpStatus.OK);
            }
            return new ResponseEntity<>("Customer not found.", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstents.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> verifyOtp(Map<String, String> requestMap) {
        try{
            String email = requestMap.get("email");
            String otp = requestMap.get("otp");

            Optional<Customer> customerOptional = customerDao.findByEmail(email);

            if(customerOptional.isPresent()){
                Customer customer = customerOptional.get();
                if(customer.getOtp().equals(otp) && customer.getOtpExpiry().isAfter(LocalDateTime.now())){
                    return new ResponseEntity<>("OTP verified successfully.", HttpStatus.OK);
                }else{
                    return new ResponseEntity<>("Email not registered.", HttpStatus.BAD_REQUEST);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstents.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> saveOrUpdateAddress(Map<String, Object> requestMap) {
        try{
            if(!jwtFilter.isCustomer()){
                return CafeUtils.getResponseEntity(CafeConstents.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
            }
            String currentUser = jwtFilter.getCurrentUser();
            Optional<Customer> optional = customerDao.findByEmail(currentUser);
            if(optional.isEmpty()){
                return CafeUtils.getResponseEntity("Customer not found", HttpStatus.BAD_REQUEST);
            }

            Customer customer = optional.get();
            customer.setAddress((String) requestMap.get("address"));
            customer.setCity((String) requestMap.get("city"));
            customer.setPincode((String) requestMap.get("pincode"));
            customer.setState((String) requestMap.get("state"));
            customer.setLandmark((String) requestMap.get("landmark"));

            customerDao.save(customer);
            return CafeUtils.getResponseEntity("Address saved successfully", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstents.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<List<CustomerWrapper>> getAllCustomers() {
        try{
            List<CustomerWrapper> customerList = customerDao.getAllCustomers();
            return new ResponseEntity<>(customerList, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> updateCustomer(Map<String, Object> requestMap) {
        try{
            Integer id = (Integer) requestMap.get("id");
            Optional<Customer> optional = customerDao.findById(id);
            if(optional.isEmpty()){
                return CafeUtils.getResponseEntity("Customer nt found", HttpStatus.BAD_REQUEST);
            }

            Customer customer = optional.get();
            customer.setName((String) requestMap.get("name"));
            customer.setContactNumber((String) requestMap.get("contactNumber"));
            customer.setAddress((String) requestMap.get("address"));
            customer.setCity((String) requestMap.get("city"));
            customer.setPincode((String) requestMap.get("pincode"));
            customer.setState((String) requestMap.get("state"));
            customer.setLandmark((String) requestMap.get("landmark"));

            customerDao.save(customer);
            return CafeUtils.getResponseEntity("Customer updated successfully.", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstents.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> deleteCustomer(Integer id) {
        try{
            if(customerDao.existsById(id)){
                customerDao.deleteById(id);
                return CafeUtils.getResponseEntity("Customer deleted successfully.", HttpStatus.OK);
            }
            return CafeUtils.getResponseEntity("Customer not found.", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstents.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
