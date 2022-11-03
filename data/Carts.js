import fs from 'fs'
import { products } from '../routes/products.js'
const route = './data/carts.json'
const utf = 'utf-8'

export default class Carts {
    constructor(cartArray) {
        this.cartArray = cartArray
        this.updateFile()
    }
    async updateFile() { // Uso interno
        try {
            this.cartArray = JSON.parse(await fs.promises.readFile(route, utf))
            return this.cartArray
        }
        catch (err) {
            console.log(err)
        }
    }
    async saveFile(cart) { // Uso interno
        try {
            await fs.promises.writeFile(route, JSON.stringify(cart), utf)
        }
        catch (err) {
            console.log(err)
        }
    }
    save = async prods => { // 'prods' es un array con ids de productos
        await this.updateFile()
        let newId = 1
        if (this.cartArray.length > 0){
            newId = this.cartArray.at(-1).id + 1
        }
        const cart = {
            id: newId,
            timestamp: new Date(Date.now()).toLocaleString(),
            products: prods.map(e => products.productArray.find(f => f.id == e)),
        }
        
        this.cartArray.push(cart)
        await this.saveFile(this.cartArray)
        console.log('Se ha guardado con éxito')
        return newId
    }
    getById = async id => {
        await this.updateFile()
        const cart = this.cartArray.find(e => e.id == id)
        console.log(cart ? cart : 'No se encontró, no existe un objeto con ese ID')
        return cart ? cart : null
    }
    getAll = async () => {
        await this.updateFile()
        console.log(this.cartArray)
        return this.cartArray
    }
    deleteById = async id => {
        await this.updateFile()
        const index = this.cartArray.findIndex(e => e.id == id)
        if (index != -1){
            this.cartArray.splice(index, 1)
            await this.saveFile(this.cartArray)
            console.log('Se ha eliminado con éxito')
            return null
        }
        console.log('No se borró, no existe un objeto con ese ID')
    }
    deleteProdById = async (idCart, idProd) => {
        await this.updateFile()
        const cart = this.cartArray.find(e => e.id == idCart)
        if (cart){
            const indexProd = cart.products.find(e => e.id == idProd)
            cart.products.splice(indexProd, 1)
            await this.saveFile(this.cartArray)
            console.log('Se ha eliminado con éxito')
            return null
        }
        console.log('No se borró, no existe un objeto con ese ID')
    }
    addProdById = async (idCart, idProd) => {
        await this.updateFile()
        const cart = this.cartArray.find(e => e.id == idCart)
        const product = products.productArray.find(e => e.id == idProd)
        if (cart && product) {
            cart.products.push(product)
            await this.saveFile(this.cartArray)
        } else console.log('Revisa los IDs')
    }
}