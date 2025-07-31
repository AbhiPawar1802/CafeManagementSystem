package com.inn.cafe.wrapper;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChefWrapper {

    private Long id;
    private String name;
    private String speciality;
    private String description;
    private String imageUrl;

    public ChefWrapper() {
        // No-arg constructor
    }

    public ChefWrapper(Long id, String name, String speciality, String description, String imageUrl) {
        this.id = id;
        this.name = name;
        this.speciality = speciality;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    public ChefWrapper(Integer id, String name, String speciality, String description, String imageUrl) {
        this.id = id != null ? Long.valueOf(id) : null;
        this.name = name;
        this.speciality = speciality;
        this.description = description;
        this.imageUrl = imageUrl;
    }
}
