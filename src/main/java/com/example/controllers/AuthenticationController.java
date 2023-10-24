package com.example.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthenticationController {

    @GetMapping("/validateAuthentication")
    public ResponseEntity<?> validateAuthentication() {
        return ResponseEntity.ok().build();
    }
}
