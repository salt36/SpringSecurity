package com.example.controllers;

import com.example.controllers.request.UpdateUserDTO;
import com.example.models.UserEntity;
import com.example.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("secured")
public class PrincipalControllerSecured {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/getUsuarios")
    public ResponseEntity<List<UserEntity>> getUsuarios(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "6") int pageSize
    ) {
        Pageable pageable = PageRequest.of(page - 1, pageSize);
        Page<UserEntity> pageResult = userRepository.findAll(pageable);

        List<UserEntity> usuarios = pageResult.getContent();
        HttpHeaders headers = new HttpHeaders();
        headers.add("X-Last-Page", String.valueOf(pageResult.getTotalPages())); // Agregamos el encabezado personalizado

        return ResponseEntity.ok().headers(headers).body(usuarios);
    }

    @GetMapping("/findUserByUsername/{username}")
    public ResponseEntity<?> findUserByUsername(@PathVariable String username) {
        Optional<UserEntity> userEntityOptional = userRepository.findByUsername(username);

        if(userEntityOptional.isPresent()){
            return ResponseEntity.ok(userEntityOptional.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/findById/{id}")
    public ResponseEntity<?> findById(@PathVariable String id) {
        Optional<UserEntity> userEntityOptional = userRepository.findById(Long.parseLong(id));

        if(userEntityOptional.isPresent()){
            return ResponseEntity.ok(userEntityOptional.get());
        }else {
            return ResponseEntity.notFound().build();
        }
    }
    @PutMapping("/updateUser/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UpdateUserDTO updateUserDTO) {

        Optional<UserEntity> userEntityOptional = userRepository.findById(id);

        if (userEntityOptional.isPresent()) {
            UserEntity userEntity = userEntityOptional.get();
            userEntity.setEmail(updateUserDTO.getEmail());
            userEntity.setUsername(updateUserDTO.getUsername());
            userEntity.setNombres(updateUserDTO.getNombres());
            userEntity.setApellidos(updateUserDTO.getApellidos());

            userRepository.save(userEntity);

            return ResponseEntity.ok(userEntity);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("deleteUser/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        Optional<UserEntity> userEntityOptional = userRepository.findById(id);

        if (userEntityOptional.isPresent()) {
            userRepository.deleteById(id);
            return ResponseEntity.ok(id);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/cargarFoto/{username}")
    public ResponseEntity<?> cargarFoto(@PathVariable String username,
                                        @RequestParam("foto") MultipartFile foto) {
        Optional<UserEntity> userEntityOptional = userRepository.findByUsername(username);

        if (userEntityOptional.isPresent()) {
            UserEntity userEntity = userEntityOptional.get();
            try {
                userEntity.setFoto(foto.getBytes());
            } catch (IOException e) {
                throw new RuntimeException(e);
            }

            userRepository.save(userEntity);

            return ResponseEntity.ok(userEntity);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
