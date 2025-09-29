package com.pharmacy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController // <-- Add this annotation
public class PharmacyInventoryApplication {

    public static void main(String[] args) {
        SpringApplication.run(PharmacyInventoryApplication.class, args);
    }

    // Add this new method directly inside this class
    @GetMapping("/hello")
    public String sayHello() {
        return "Hello, the server is working!";
    }
}