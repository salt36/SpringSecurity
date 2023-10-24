package com.example.controllers.requestPublicaciones;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreatePublicacionDTO {

    @NotBlank
    private String fecha;

    @NotBlank
    private String header;

    @NotBlank
    private String ubicacion;

    @NotBlank
    private String descripcion;

    @NotBlank
    private String tipo;

    @NotBlank
    private byte[] foto;

}