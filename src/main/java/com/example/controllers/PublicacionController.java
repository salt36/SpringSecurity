package com.example.controllers;

import com.example.controllers.requestPublicaciones.CreatePublicacionDTO;
import com.example.controllers.requestPublicaciones.UpdatePublicacionDTO;
import com.example.repositories.PostRepository;
import com.example.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.example.models.PostEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@RestController
@PreAuthorize("isAuthenticated()")
public class PublicacionController {

    @Autowired
    PostRepository postRepository;

    @Autowired
    UserRepository userRepository;

    @GetMapping("/getPublicacionesByIdUsuario/{idUsuario}")
    public ResponseEntity<List<PostEntity>> getPublicacionesByIdUsuario(@PathVariable Long idUsuario,
                                                                        @RequestParam(defaultValue = "1") int page,
                                                                        @RequestParam(defaultValue = "6") int pageSize) {

        Pageable pageable = PageRequest.of(page - 1, pageSize);
        Page<PostEntity> pageResult = postRepository.findByIdUsuario(idUsuario, pageable);

        List<PostEntity> publicaciones = pageResult.getContent();
        HttpHeaders headers = new HttpHeaders();
        headers.add("X-Last-Page", String.valueOf(pageResult.getTotalPages())); // Agregamos el encabezado personalizado

        return ResponseEntity.ok().headers(headers).body(publicaciones);
    }

    @GetMapping("/getPublicaciones")
    public ResponseEntity<List<PostEntity>> getPublicaciones(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "6") int pageSize
    ) {
        Pageable pageable = PageRequest.of(page - 1, pageSize);
        Page<PostEntity> pageResult = postRepository.findAll(pageable);

        List<PostEntity> publicaciones = pageResult.getContent();
        HttpHeaders headers = new HttpHeaders();
        headers.add("X-Last-Page", String.valueOf(pageResult.getTotalPages())); // Agregamos el encabezado personalizado

        return ResponseEntity.ok().headers(headers).body(publicaciones);
    }

    @GetMapping("/getPublicacionById/{id}")
    public ResponseEntity<?> getPublicacionById(@PathVariable Long id) {
        Optional<PostEntity> postEntityOptional = postRepository.findById(id);

        if (postEntityOptional.isPresent()) {
            return ResponseEntity.ok(postEntityOptional.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/createPublicacion/{idUsuario}")
    public ResponseEntity<?> createPublicacion(
                            @PathVariable Long idUsuario,
                            @RequestBody CreatePublicacionDTO createPublicacionDTO) {

        LocalDate fechaActual = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        String fechaFormateada = fechaActual.format(formatter);

        PostEntity postEntity = PostEntity.builder()
                .fecha(fechaFormateada)
                .header(createPublicacionDTO.getHeader())
                .ubicacion(createPublicacionDTO.getUbicacion())
                .descripcion(createPublicacionDTO.getDescripcion())
                .tipo(createPublicacionDTO.getTipo())
                .foto(createPublicacionDTO.getFoto())
                .idUsuario(idUsuario)
                .build();

        postRepository.save(postEntity);

        return ResponseEntity.ok(postEntity);
    }

    @PutMapping("/updatePublicacion/{id}")
    public ResponseEntity<?> updatePublicacion(@PathVariable Long id,
                                               @RequestBody UpdatePublicacionDTO updatePublicacionDTO) {

        Optional<PostEntity> postEntityOptional = postRepository.findById(id);

        LocalDate fechaActual = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        String fecha = fechaActual.format(formatter);

        if (postEntityOptional.isPresent()) {
            PostEntity postEntity = postEntityOptional.get();

            postEntity.setFecha(fecha);
            postEntity.setHeader(updatePublicacionDTO.getHeader());
            postEntity.setUbicacion(updatePublicacionDTO.getUbicacion());
            postEntity.setDescripcion(updatePublicacionDTO.getDescripcion());
            postRepository.save(postEntity);

            return ResponseEntity.ok(postEntity);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/updateFotoPublicacion/{id}")
    public ResponseEntity<?> updateFotoPublicacion(@PathVariable Long id,
                                                   @RequestParam("foto") MultipartFile foto) {

        Optional<PostEntity> postEntityOptional = postRepository.findById(id);

        if (postEntityOptional.isPresent()) {
            PostEntity postEntity = postEntityOptional.get();

            byte[] imagenBytes = null;

            try {
                imagenBytes = foto.getBytes();
            } catch (Exception e) {
                e.printStackTrace();
            }

            postEntity.setFoto(imagenBytes);
            postRepository.save(postEntity);

            return ResponseEntity.ok(postEntity);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/deletePublicacion/{id}")
    public ResponseEntity<?> deletePublicacion(@PathVariable Long id) {

        Optional<PostEntity> postEntityOptional = postRepository.findById(id);

        if (postEntityOptional.isPresent()) {
            postRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
