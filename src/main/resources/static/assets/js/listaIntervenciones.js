let currentPage = 1;
const postPerPage = 6;
let totalPages = 1;
let categoriaSeleccionada = '';

async function cargarPosts() {
    try {
        const request = await fetch(`/getPublicaciones?page=${currentPage}&pageSize=${postPerPage}&categoria=${categoriaSeleccionada}`, {
            method: 'GET',
        });
        if (!request.ok) {
            throw new Error("No se pudo obtener la lista de publicaciones");
        }

        const jsonResponse = await request.json();

        const posts = jsonResponse.content;

        mostrarPosts(posts);

        // Actualizar el número total de páginas del encabezado personalizado
        const lastPageHeader = request.headers.get('X-Last-Page');
        totalPages = parseInt(lastPageHeader);

        // Habilitar o deshabilitar los botones de paginación
        const prevButton = document.querySelector("#btn-prev");
        const nextButton = document.querySelector("#btn-next");
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages;
    } catch (error) {
        console.error("Error al cargar las publicaciones: ", error);
    }
}

function mostrarPosts(posts) {
    const portfolioContainer = document.querySelector("#publicaciones main");
    portfolioContainer.innerHTML = ''; // Limpiar el contenido existente

    const listadoHtml = posts.map(post => {
        console.log(categoriaSeleccionada)
        if (post.categoria === categoriaSeleccionada || categoriaSeleccionada === '' || categoriaSeleccionada === 'Todos') {
            let imgSrc = post.foto ? `data:image/png;base64,${post.foto}` : '/assets/img/service-details.jpg';
            let descripcion = post.descripcion ? post.descripcion : 'Sin descripción';

            return ` 
                            <div class="col-lg-6">
                                <div class="card border-none my-card">
                                    <div class="card-image">
                                        <img onclick="abrirImagenAmpliada(${post.id})" src="${imgSrc}" alt="Servicio" class="img-fluid"/>
                                    </div>
                                    <div class="card-body text-uppercase">
                                        <div class="card-meta text-muted">
                                            <span class="meta-date">${post.fecha}</span>
                                            <span class="meta-category">${post.ubicacion}</span>
                                        </div>
                                        <h3 class="card-title">
                                            <a href="#">${post.header}</a>
                                        </h3>
                                        <p class="card-text">${descripcion}</p>
                                    </div>
                                </div>
                            </div>`;
        }
        return ''; // Si no coincide con la categoría seleccionada, se devuelve una cadena vacía
    });

    portfolioContainer.insertAdjacentHTML('beforeend', listadoHtml.join(''));
}

document.addEventListener("DOMContentLoaded", () => {
    cargarPosts();

    const checkboxes = document.querySelectorAll(".checkbox-wrapper-13 input[type='checkbox']");
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
            // Obtener el valor del atributo value del checkbox seleccionado
            categoriaSeleccionada = checkbox.value;

            // Desmarcar todos los checkboxes excepto el actual
            checkboxes.forEach((cb) => {
                if (cb !== checkbox) {
                    cb.checked = false;
                }
            });

            // Llamar a la función para cargar las intervenciones con la categoría seleccionada
            cargarPosts();
        });
    });
});


// Funciones para paginación

function paginaAnterior() {
    if (currentPage > 1) {
        currentPage--;
        cargarPosts();
    }
}

function paginaSiguiente() {
    if (currentPage < totalPages) {
        currentPage++;
        cargarPosts();
    }
}


// Función para abrir la ventana modal y cargar las fotos paginadas
function abrirImagenAmpliada(intervencion_id) {
    // Obtener el elemento del carrusel de imágenes
    const carouselInner = document.querySelector(".carousel-inner");
    // Limpiar el contenido previo del carrusel
    carouselInner.innerHTML = "";

    // Realizar una solicitud al servidor para obtener las fotos de la intervención
    fetch(`/api/fotosIntervencion/${intervencion_id}`, {
        method: "GET",
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.length === 0) {
                // Si no hay fotos disponibles, muestra un mensaje o manejo de error aquí
                carouselInner.innerHTML = "<p>No hay fotos disponibles.</p>";
            } else {
                // Si hay fotos disponibles, crea elementos de imagen en el carrusel
                data.forEach((foto, index) => {
                    const imgElement = document.createElement("img");
                    imgElement.src = `data:image/png;base64,${foto}`;
                    imgElement.alt = `Imagen ${index + 1}`;
                    imgElement.classList.add("d-block", "w-100");

                    const carouselItem = document.createElement("div");
                    carouselItem.classList.add("carousel-item");
                    if (index === 0) {
                        carouselItem.classList.add("active");
                    }

                    carouselItem.appendChild(imgElement);
                    carouselInner.appendChild(carouselItem);
                });
            }
        })
        .catch((error) => {
            // Manejo de errores en caso de que la solicitud falle
            console.error("Error al cargar las imágenes: ", error);
            carouselInner.innerHTML = "<p>No tiene imágenes disponibles.</p>";
        });

    // Abrir la ventana modal
    const modal = new bootstrap.Modal(document.getElementById("imagenModal"));
    modal.show();
}