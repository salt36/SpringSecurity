cargarPerfil().then(() => {
    })
    .catch((error) => {
        console.error("Error en el manejo de la promesa cargarPerfil():", error);
    });

function getHeaders() {
    return {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.token //
    };
}

async function cargarPerfil() {
    const username = localStorage.username;

    const request = await fetch('secured/findUserByUsername/' + username, {
        method: 'GET',
        headers: getHeaders()
    });

    const usuario = await request.json();

    if (!request.ok) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No tienes acceso a esta pestaña',
            showConfirmButton: false,
            timer: 1000
        }).then(() => {
            location.href = "indexSecured.html";
        });
    }else{

        let url = 'data:image/png;base64,' + usuario.foto;

        let img = '<img class="w-50 h-50 rounded-circle" onclick="subirFoto()" src="'+url+'" id="fotoPerfil" alt="Foto">';

        document.getElementById("fotoPerfil").innerHTML = img;
        document.getElementById("username").innerText = username;
        //document.getElementById("about").value = usuario.about;
        document.getElementById("nombres").value = usuario.nombres;
        document.getElementById("apellidos").value = usuario.apellidos;
        document.getElementById("email").value = usuario.email;
    }
}

function subirFoto() {
    Swal.fire({
        title: 'Cargar foto',
        html: `
      <form id="fotoForm">
        <input type="file" name="foto" id="fotoInput" accept="image/*">
      </form>
    `,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        preConfirm: async () => {

            const foto = new FormData(document.querySelector('#fotoForm'));

            const response = await fetch('secured/cargarFoto/' + localStorage.username, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.token
                },
                body: foto
            });
        },
        focusConfirm: false,
        allowOutsideClick: () => !Swal.isLoading()
    }).then(response => {
        if (response.isConfirmed) {
            if (response.value.ok) {
                Swal.fire({
                    title: 'Foto guardada',
                    icon: 'success'
                });
                cargarPerfil();
            } else {
                Swal.fire({
                    title: 'Error al guardar la foto',
                    icon: 'error'
                });
            }
        }
    });
}