package com.example.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name="publicaciones")
public class PostEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    private byte[] foto;

    @NotBlank
    private String fecha;

    @NotBlank
    private String header;

    @NotBlank
    private String ubicacion;

    @NotBlank
    private String tipo;

    @NotBlank
    private String descripcion;

    private float calificacion;

    @NotNull
    private Long idUsuario;

}
