let currentPage = 1;
const postPerPage = 10;
let totalPages = 1;
let ubicacionSeleccionada = '';


function cargarPosts() {
    return fetch(`/getPublicaciones?page=${currentPage}&pageSize=${postPerPage}&categoria=${ubicacionSeleccionada}`, {
        method: 'GET',
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("No se pudo obtener la lista de usuarios");
            }
            // Actualizar el número de página actual
            document.querySelector("#paginaActual").innerText = currentPage;

            // Obtener el número total de páginas del encabezado personalizado
            const lastPageHeader = response.headers.get('X-Last-Page');
            totalPages = parseInt(lastPageHeader);

            // Habilitar o deshabilitar los botones de paginación
            const prevButton = document.querySelector("#btn-prev");
            const nextButton = document.querySelector("#btn-next");
            prevButton.disabled = currentPage === 1;
            nextButton.disabled = currentPage === totalPages;
            return response.json();
        })
        .then((posts) => {

            let listadoHtml = '';
            for (let post of posts) {
                if (post.ubicacion === ubicacionSeleccionada || ubicacionSeleccionada === '' || ubicacionSeleccionada === 'Todos') {
                    let postHtml =
                        ` 
                            <div class="col-lg-6">
                                <div class="card border-none my-card" onclick="cargarPost(${post.id})">
                                    <div class="card-image">
                                        <img src="data:image/png;base64,${post.foto}" alt="Foto del servicio" class="img-fluid"  style="height: 200px;"/>
                                    </div>
                                    <div class="card-body text-uppercase">
                                        <div class="card-meta text-muted">
                                            <span class="meta-date">${post.fecha}</span>
                                            <span class="meta-category">${post.ubicacion}</span>
                                        </div>
                                        <h3 class="card-title">
                                            <a href="#">${post.header}</a>
                                        </h3>
                                    </div>
                                </div>
                            </div>`;
                    listadoHtml += postHtml;
                }
            }
            document.querySelector("#publicaciones main").innerHTML = listadoHtml;
            return '';
        })
        .catch((error) => {
            console.error("Error al cargar las publicaciones:", error);
        });
}

cargarPosts()
    .then(() => {
    })
    .catch((error) => {
        console.error("Error en el manejo de la promesa cargarPosts():", error);
    });



function paginaAnterior() {
    if (currentPage > 1) {
        currentPage--;
        cargarPosts().then(() => {});
    }
}

function paginaSiguiente() {
    if (currentPage < totalPages) {
        currentPage++;
        cargarPosts().then(() => {});
    }
}

async function crearPost() {

    const username = localStorage.username;

    const request = await fetch('secured/findUserByUsername/' + username, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.token
        }
    });
    const usuario = await request.json();

    const {value: formValues} = await Swal.fire({
        title: 'Crear publicación',
        html:`
          <form id="myForm">
            <div class="row">
              <div class="col">
                <div class="form-group">
                  <label for="swal-input1">Título:</label>
                  <input id="swal-input1" class="form-control" placeholder="Título de la publicación" required>
                </div>
              </div>
              <div class="col">
                <div class="form-group">
                  <label for="swal-input2">Ciudad:</label>
                  <select id="swal-input2" class="form-control" required>
                    <option value="Medellín">Medellín</option>
                    <option value="Bogotá">Bogotá</option>
                    <option value="Pereira">Pereira</option>
                    <option value="Bucaramanga">Bucaramanga</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="form-group">
                  <label for="swal-input3">Tipo de servicio:</label>
                  <input id="swal-input3" class="form-control" placeholder="Tipo de servicio" required>
                </div>
              </div>
            </div>
            <div class="row">
                <div class="col">
                    <div class="form-group">
                        <label for="swal-input5">Cargar Foto:</label>
                        <input type="file" id="swal-input5" accept="image/*">
                    </div>
                </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="form-group">
                  <label for="swal-input4">Descripción:</label>
                  <textarea id="swal-input4" class="form-control" placeholder="Si desea, puede agregar información más detallada sobre la publicación" rows="6" maxlength="500"></textarea>
                </div>
              </div>
            </div>       
          </form>
        `,

        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Crear',
        cancelButtonText: 'Cancelar'
    });

    if (formValues) {
        const header = document.getElementById("swal-input1").value;
        const ubicacion = document.getElementById("swal-input2").value;
        const tipo = document.getElementById("swal-input3").value;
        const descripcion = document.getElementById("swal-input4").value;
        const fotoInput = document.querySelector('#swal-input5');
        const file = fotoInput.files[0];
        let foto = null;
        const idUsuario = usuario.id;

        if (file) {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            await new Promise((resolve) => {
                reader.onload = resolve;
            });
            const fileData = new Uint8Array(reader.result);
            foto = Array.from(fileData);
        }

        const nuevoPost = {
            header,
            ubicacion,
            descripcion,
            tipo,
            foto,
            idUsuario
        };

        const response = await fetch('/createPublicacion/' + usuario.id, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.token
            },
            body: JSON.stringify(nuevoPost)
        });
        if (!response.ok) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No se pudo crear la publicación',
                showConfirmButton: false,
                timer: 1000
            }).then(() => {
                return;
            });
        }else if(response.ok){
            Swal.fire({
                icon: 'success',
                title: 'Publicación creada correctamente',
                showConfirmButton: false,
                timer: 1000
            }).then(() => {
                cargarPosts();
            });
        }
    }
}
document.addEventListener("DOMContentLoaded", () => {
    cargarPosts();

    const checkboxes = document.querySelectorAll(".checkbox-wrapper-13 input[type='checkbox']");
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
            // Obtener el valor del atributo value del checkbox seleccionado
            ubicacionSeleccionada = checkbox.value;

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

async function cargarPost(id){
    const response = await fetch('/getPublicacionById/' + id, {
        method: 'GET',
        headers: getHeaders()
    });

    const post = await response.json();

    if(response.ok){
        let img = 'data:image/png;base64,' + post.foto;
        swal.fire({
            title: post.header,
            html:`
                <div class="row">
                  <div class="col">
                    <div class="form-group">
                      <img src="${img}">
                    </div>
                  </div>
                <div class="row">
                  <div class="col">
                    <div class="form-group">
                      <label>Fecha:${post.fecha}</label>
                    </div>
                  </div>
                  <div class="row">
                      <div class="col">
                        <div class="form-group">
                          <label>Ciudad:${post.ubicacion}</label>
                        </div>
                      </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="form-group">
                      <label>Tipo de servicio:${post.tipo}</label>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="form-group">
                      <label>${post.descripcion}</label>
                    </div>
                  </div>
                </div>
            `,
        });
    }else{
        swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No se pudo cargar la publicación',
        });
    }
}