package com.inn.cafe.JWT;

import com.inn.cafe.POJO.Customer;
import com.inn.cafe.dao.CustomerDao;
import com.inn.cafe.dao.UserDao;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@Service
public class CustomerUsersDetailsService implements UserDetailsService {

    @Autowired
    UserDao userDao;

    @Autowired
    CustomerDao customerDao;

    private Optional<com.inn.cafe.POJO.User> userDetails;
    private Optional<com.inn.cafe.POJO.Customer> customerDetails;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("Inside loadUserByUsername {}", username);
        userDetails = userDao.findByEmailId(username);
        if (userDetails.isPresent()){
            return new org.springframework.security.core.userdetails.User(
                    userDetails.get().getEmail(),
                    userDetails.get().getPassword(),
                    List.of(new SimpleGrantedAuthority("ADMIN"))
            );
        }

        customerDetails = customerDao.findByEmail(username);
        if(customerDetails.isPresent()){
            return new org.springframework.security.core.userdetails.User(
                    customerDetails.get().getEmail(),
                    customerDetails.get().getPassword(),
                    List.of(new SimpleGrantedAuthority("CUSTOMER"))
            );
        }
        throw new UsernameNotFoundException("User/Customer Not Found.");
    }

    public Optional<com.inn.cafe.POJO.User> getUserDetails() {
        return userDetails;
    }

    public Optional<com.inn.cafe.POJO.Customer> getCustomerDetails() {
        return customerDetails;
    }
}
