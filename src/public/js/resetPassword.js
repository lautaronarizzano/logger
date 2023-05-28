const input = document.getElementById('newPassword')
const form = document.getElementById('formNewPassword')

form.addEventListener('submit', e => {
    e.preventDefault()

    const datos = {
        newPassword: form[0].value
    }

    fetch('/api/sessions/resetPassword', {
        method: POST,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
})