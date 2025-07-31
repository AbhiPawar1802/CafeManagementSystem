package com.inn.cafe.serviceImpl;

import com.inn.cafe.JWT.JwtFilter;
import com.inn.cafe.POJO.Offer;
import com.inn.cafe.constents.CafeConstents;
import com.inn.cafe.dao.OfferDao;
import com.inn.cafe.service.OfferService;
import com.inn.cafe.utils.CafeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;


@Service
public class OfferServiceImpl implements OfferService {

    @Autowired
    OfferDao offerDao;

    @Autowired
    JwtFilter jwtFilter;

    @Override
    public ResponseEntity<String> addOffer(Map<String, Object> requestMap) {
        try {
            if (jwtFilter.isAdmin()) {
                if(validateOfferMap(requestMap, false)){
                    Offer offer = getOfferFromMap(requestMap, false);
                    offerDao.save(offer);
                    return CafeUtils.getResponseEntity("Offer added successfully.", HttpStatus.OK);
                }else{
                    return CafeUtils.getResponseEntity("Invalid offer data", HttpStatus.BAD_REQUEST);
                }
            }else{
                return CafeUtils.getResponseEntity(CafeConstents.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstents.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private boolean validateOfferMap(Map<String, Object> requestMap, boolean isUpdate) {
        return requestMap.containsKey("title")
                && requestMap.containsKey("description")
                && requestMap.containsKey("discountPercent")
                && requestMap.containsKey("minOrderAmount")
                && requestMap.containsKey("code")
                && requestMap.containsKey("expiryDate");
    }

    private Offer getOfferFromMap(Map<String, Object> requestMap, boolean isUpdate) {
        Offer offer = new Offer();
        if (isUpdate) {
            offer.setId((Integer) requestMap.get("id"));
        }
        offer.setTitle((String) requestMap.get("title"));
        offer.setDescription((String) requestMap.get("description"));
        offer.setDiscountPercent(Integer.parseInt(requestMap.get("discountPercent").toString()));
        offer.setMinOrderAmount(Integer.parseInt(requestMap.get("minOrderAmount").toString()));
        offer.setCode((String) requestMap.get("code"));
        offer.setActive(true);

        // Parse expiryDate from string (yyyy-MM-dd)
        String dateStr = (String) requestMap.get("expiryDate");
        offer.setExpiryDate(LocalDate.parse(dateStr));

        return offer;
    }



    @Override
    public ResponseEntity<List<Offer>> getAllActiveOffers() {
        try{
            LocalDate today = LocalDate.now();
            List<Offer> offers = offerDao.findByActiveTrueAndExpiryDateGreaterThanEqual(today);
            return ResponseEntity.ok(offers);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.status(500).body(new ArrayList<>());
    }

    @Override
    public ResponseEntity<String> deleteOffer(Integer id) {
        try{
            if(jwtFilter.isAdmin()){
                Optional<Offer> optional = offerDao.findById(id);
                if(optional.isPresent()){
                    offerDao.deleteById(id);
                    return CafeUtils.getResponseEntity("Offer deleted successfully", HttpStatus.OK);
                }else{
                    return CafeUtils.getResponseEntity("Offer not found", HttpStatus.BAD_REQUEST);
                }
            }else{
                return CafeUtils.getResponseEntity(CafeConstents.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstents.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> updateOffer(Map<String, Object> requestMap) {
        try{
            if(jwtFilter.isAdmin()){
                if(validateOfferMap(requestMap, true)){
                    Optional<Offer> optional = offerDao.findById((Integer) requestMap.get("id"));
                    if(optional.isPresent()){
                        Offer offer = optional.get();

                        offer.setTitle((String) requestMap.get("title"));
                        offer.setDescription((String) requestMap.get("description"));
                        offer.setDiscountPercent((Integer) requestMap.get("discountPercent"));
                        offer.setMinOrderAmount((Integer) requestMap.get("minOrderAmount"));
                        offer.setCode((String) requestMap.get("code"));
                        offer.setActive(true);

                        String dateStr = (String) requestMap.get("expiryDate");
                        offer.setExpiryDate(LocalDate.parse(dateStr));

                        offerDao.save(offer);
                        return CafeUtils.getResponseEntity("Offer updated successfully", HttpStatus.OK);
                    }else{
                        return CafeUtils.getResponseEntity("Offer not found", HttpStatus.BAD_REQUEST);
                    }
                }else{
                    return CafeUtils.getResponseEntity("Invalid offer data", HttpStatus.BAD_REQUEST);
                }
            }else{
                return CafeUtils.getResponseEntity(CafeConstents.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstents.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<Map<String, Object>> validateOffer(Map<String, Object> requestMap) {
        try{
            if(!requestMap.containsKey("code") || !requestMap.containsKey("subtotal")){
                return CafeUtils.getErrorMapResponse("Missing required fields", HttpStatus.BAD_REQUEST);
            }

            String code = (String) requestMap.get("code");
            double subtotal = Double.parseDouble(requestMap.get("subtotal").toString());
            LocalDate today = LocalDate.now();

            List<Offer> offers = offerDao.findByActiveTrueAndExpiryDateGreaterThanEqual(today);
            Optional<Offer> optional = offers.stream().filter(o -> o.getCode().equalsIgnoreCase(code)).findFirst();

            if(optional.isEmpty()){
                return CafeUtils.getErrorMapResponse("Invalid or expired offer", HttpStatus.BAD_REQUEST);
            }

            Offer offer = optional.get();
            if(subtotal < offer.getMinOrderAmount()){
                return CafeUtils.getErrorMapResponse("minimum order amount not met", HttpStatus.BAD_REQUEST);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("valid", true);
            response.put("discountPercent", offer.getDiscountPercent());
            response.put("description", offer.getDescription());
            response.put("minOrderAmount", offer.getMinOrderAmount());
            return new ResponseEntity<>(response, HttpStatus.OK);
            
        } catch (Exception e) {
            e.printStackTrace();
        }
        return CafeUtils.getErrorMapResponse(CafeConstents.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
