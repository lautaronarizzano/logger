const form = document.getElementById('resetForm')
const btnGuardar = document.getElementById('btn-guardar')

//obtener el params (token del user)\
const values = window.location.search
const urlParams = new URLSearchParams(values)

const changePassword = async (obj, token) => {
    const res = await fetch(`/api/sessions/change-password/${token}`, {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const resp = await res.json()
    console.log(resp)
    return resp
}

form.addEventListener('submit', async e => {
    e.preventDefault()
    btnGuardar.setAttribute("disabled", "disabled")

    let token = urlParams.get('user')
    const data = new FormData(form)
    const obj = {}

    data.forEach((value, key) => obj[key] = value)


    if(obj.passwordNew === obj.passwordRepeat) {

        const resp = await changePassword(obj, token)
        console.log(resp)
        if(resp.status == 'error') {
            Swal.fire({
                timer:3000,
                title: 'Error',
                text: resp.message,
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Confirmar'
            }).then((result) => {
                window.location.replace('/reset-password')
            })
        } else {
            Swal.fire({
                title: 'Exito',
                text: "tu contraseña ha sido cambiada con exito",
                icon: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Confirmar'
            }).then((result) => {
                if(result.isConfirmed) {
                    window.location.replace('/login')
                } else {
                    window.location.replace('/login')
                }
            })
        }
    } else {
        Swal.fire({
            showConfirmButton: false,
            timer: 3000,
            title: 'Creedenciales invalidas',
            text: 'Las contraseñas ingresadas deben coincidir',
            icon: 'error'
        })
    }
    btnGuardar.removeAttribute("disabled")
})