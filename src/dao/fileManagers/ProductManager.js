import fs from 'fs'
import __dirname from '../../utils.js';

export default class ProductManager {
        constructor() {
            this.path = `${__dirname}/dao/files/Products.json`;
        }
    
        //funcion para agregar el producto
        save = async (title, description, price, thumbnail, code, stock) => {

            const products = await this.getAll()

            try {
    
                const product = {
                    title,
                    description,
                    price,
                    thumbnail,
                    code,
                    stock
                }
    
                //crear id autoincrementable
                if (products.length === 0) {
                    product._id = 1
                } else {
                    product._id = products[products.length - 1]._id + 1
                }
    
                const codeIndex = products.findIndex(e => e.code === product.code) // identifico si hay un code repetido
    
                const values = Object.values(product) // saco los values del producto asi puedo verificar que no esten vacios
    
                const valuesString = values.filter(e => typeof e == 'string') // filtro los values por string ya que si es un numero me tira error el .trim()
    
                const checkTrim = valuesString.findIndex(e => e.trim() === "") // uso el .trim() para eliminar margenes de error
    
    
    
                //validar code repetido o espacios vacios
                if (codeIndex === false && checkTrim === -1) {
                    products.push(product)
                } else {
                    codeIndex !== -1 && console.error('El identificador code ya esta en otro producto')
                    checkTrim !== -1 && console.error('Hay un campo vacio')
                }
    
    
                await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'))
    
                return product
    
            } catch (error) {
                console.log(error)
            }
    
        }
    
        //mostrar los productos en consola
        getAll = async () => {
            try {
    
                if (fs.existsSync(this.path)) {
                    const data = await fs.promises.readFile(this.path, 'utf-8')
                    const products = JSON.parse(data)
                    return products
                } else {
                    return []
                }
    
            } catch (error) {
                console.log(error)
            }
        }
    
        //buscar producto por id
        getById = async (idProduct) => {

            const products = await this.getAll()

            const productFind = products.find(e => e._id === idProduct)
            if (productFind == undefined) {
                console.error('Not found')
                return
            } else {
                const find = products.find(e => e._id === idProduct)
                console.log('El producto buscado es:')
                console.log(find)
                return find
            }
        }
    
        update = async (idProduct, key) => {
            const products = await this.getAll()
            let productIndex = products.findIndex(e => e._id === idProduct)
            if (productIndex === -1) {
                console.log('Produdcto no encontrado')
                return
            }
            let product = products[productIndex]
            const newProduct = {
                ...product,
                newPrice: key
            }
            await this.deleteProduct(newProduct._id)
            products.push(newProduct)
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'))
        }
    
        delete = async (idProduct) => {
            const objs = await this.getAll()
            const index = objs.findIndex(o => o._id == idProduct)
            if (index == -1) {
                throw new Error(`Error al borrar: no se encontró el id ${idProduct}`)
            }

            objs.splice(index, 1)
            try {
                await fs.promises.writeFile(this.path, JSON.stringify(objs, null, 2))
            } catch (error) {
                throw new Error(`Error al borrar: ${error}`)
            }
        }
    }