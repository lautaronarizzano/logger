const form = document.getElementById('resetForm')
const btnSubmit = document.getElementById('btn-submit')


form.addEventListener('submit', e => {
    e.preventDefault()
    btnSubmit.setAttribute("disabled", "disabled")

    const data = new FormData(form)
    const obj = {}

    data.forEach((value, key) => obj[key] = value)

    fetch('/api/sessions/reset-password', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
        btnSubmit.removeAttribute("disabled")
        if(result.status == 200) {
            Swal.fire({
                title: 'Success',
                text: "Enviamos un link a su email, El link solo es valido por 1 hora.",
                icon: 'sucess',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Confirmar'
            }).then((result) => {
                if(result.isConfirmed) {
                    window.location.replace('/login')
                } else {
                    window.location.replace('/login')
                }
            })
        } else {
            Swal.fire({
                showConfirmButton: false,
                timer: 3000,
                title: 'Error',
                text: "No se pudo encontrar el email",
                icon: 'error'
            })
        }
    })
})