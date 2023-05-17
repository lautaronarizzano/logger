export const incompleteFieldError = () => {
    return `El producto que usted quiere agregar le faltan campos. Este producto debe tener los siguientes campos:
    title, description, price, thumbnail, code, stock, category`
}
export const productNotFound = (pid) => {
    return `El producto que usted quiere agregar no se encuentra disponible. El id del producto que usted quiere agregar es: ${pid}`
}
export const incompleteLoginFields = (email, password) => {
    return `Login fallido. El campo de email o de contraseña estan incompletos o email no termina en @gmail.com . email recibido: ${email}, password recibido: ${password} `
}
export const incompleteRegisterFields = (first_name, last_name, email, age) => {
    return `Registro fallido. Alguno de los campos esta incompleto. recibimos: first_name: ${first_name}, last_name: ${last_name}, email: ${email}, age: ${age}`
}
export const userOrPasswordIncorrect = () => {
    return `Login Fallido. El usuario o la contraseña no coinciden.`
}
export const userNotFound = (user) => {
    return `Login fallido. El usuario no ha sido encontrado en la base de datos. El usuario que usted desea ingresar es: ${user}`
}