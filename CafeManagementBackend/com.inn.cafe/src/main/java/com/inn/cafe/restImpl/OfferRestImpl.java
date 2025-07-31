package com.inn.cafe.restImpl;

import com.inn.cafe.POJO.Offer;
import com.inn.cafe.constents.CafeConstents;
import com.inn.cafe.rest.OfferRest;
import com.inn.cafe.service.OfferService;
import com.inn.cafe.utils.CafeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/offer")
public class OfferRestImpl implements OfferRest {

    @Autowired
    private OfferService offerService;

    @Override
    public ResponseEntity<String> addOffer(Map<String, Object> requestMap) {
        try{
            return offerService.addOffer(requestMap);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstents.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<List<Offer>> getAllActiveOffers() {
        try{
            return offerService.getAllActiveOffers();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> deleteOffer(Integer id) {
        try{
            return offerService.deleteOffer(id);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstents.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> updateOffer(Map<String, Object> requestMap) {
        try{
            return offerService.updateOffer(requestMap);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstents.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<Map<String, Object>> validateOffer(Map<String, Object> requestMap) {
        try{
            return offerService.validateOffer(requestMap);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return CafeUtils.getErrorMapResponse(CafeConstents.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
