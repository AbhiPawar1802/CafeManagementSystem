package com.inn.cafe.POJO;

import jakarta.persistence.*;
import lombok.Data;

@NamedQuery(
        name = "Chef.getAllChefs",
        query = "select new com.inn.cafe.wrapper.ChefWrapper(c.id, c.name, c.speciality, c.description, c.imageUrl) from Chef c"
)

@NamedQuery(
        name = "Chef.getChefById",
        query = "select new com.inn.cafe.wrapper.ChefWrapper(c.id, c.name, c.speciality, c.description, c.imageUrl) from Chef c where c.id = :id"
)

@Entity
@Data
@Table(name = "chefs")
public class Chef {

    @Id
    @GeneratedValue
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;

    @Column(name = "speciality")
    private String speciality;

    @Column(name = "description")
    private String description;

    @Column(name = "image_url")
    private String imageUrl;
}
