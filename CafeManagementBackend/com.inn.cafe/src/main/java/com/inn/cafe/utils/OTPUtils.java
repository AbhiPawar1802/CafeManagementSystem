package com.inn.cafe.utils;

import java.util.Random;

public class OTPUtils {
    public static String generateOtp(){
        Random random = new Random();
        return String.format("%06d", random.nextInt(999999));
    }
}
