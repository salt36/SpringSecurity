package com.example.controllers;

import com.example.controllers.request.CreateUserDTO;
import com.example.models.ERole;
import com.example.models.RoleEntity;
import com.example.models.UserEntity;
import com.example.repositories.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.Set;

@RestController
public class PrincipalController {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/createUser")
    public ResponseEntity<?> createUser(@Valid @RequestBody CreateUserDTO createUserDTO) {

        Set<RoleEntity> roles = Set.of(RoleEntity.builder().name(ERole.USER).build());

        UserEntity userEntity = UserEntity.builder()
                .email(createUserDTO.getEmail())
                .username(createUserDTO.getUsername())
                .password(passwordEncoder.encode(createUserDTO.getPassword()))
                .nombres(createUserDTO.getNombres())
                .apellidos(createUserDTO.getApellidos())
                .roles(roles)
                .build();

        userRepository.save(userEntity);

        return ResponseEntity.ok(userEntity);
    }

    @GetMapping("/findEmail/{email}")
    public ResponseEntity<?> findEmail(@PathVariable String email) {
        Optional<UserEntity> userEntityOptional = userRepository.findByEmail(email);

        if(userEntityOptional.isPresent()){
            return ResponseEntity.ok(HttpStatus.OK);
        }else {
            return ResponseEntity.notFound().build();
        }
    }
}