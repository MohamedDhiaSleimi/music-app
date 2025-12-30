package com.musicapp.auth_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AuthServiceApplication {

    public static void main(String[] args) {
        if (System.getenv("MONGODB_URI") == null) {
            throw new IllegalStateException("MONGODB_URI NOT LOADED — .env NOT USED");
        }
        SpringApplication.run(AuthServiceApplication.class, args);
    }
}