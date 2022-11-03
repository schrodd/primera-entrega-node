import express from 'express'
import { products } from './products.js'
import Carts from '../data/Carts.js'
const cartRoute = express.Router()
const carts = new Carts()

// POST: Crea un carrito vacío y devuelve su id (U/A)
cartRoute.post('/', async (req, res) => {
    const id = await carts.save(req.body)
    id != -1
        ? res.send(`Se ha cargado el carrito exitosamente con el id ${id}`)
        : res.send(`No se ha podido cargar el carrito`)
})

// DELETE: Vacía un carrito por su id y lo elimina (U/A)
cartRoute.delete('/:id', (req, res) => {
    const idx = carts.cartArray.find(e => e.id == req.params.id)
    if (idx != -1) {
        carts.deleteById(req.params.id)
        res.send('Se ha eliminado con éxito')
    } else res.send('No se ha encontrado ese carrito')
})

// GET: Lista todos los productos del carrito (U/A)
cartRoute.get('/', (req, res) => {
    res.json(carts.cartArray)
})
cartRoute.get('/:id', (req, res) => {
    const cart = carts.cartArray.find(e => e.id == req.params.id)
    cart ? res.json(cart) : res.send('No hay un carrito con ese id')
})
cartRoute.get('/:id/products', (req, res) => {
    const cart = carts.cartArray.find(e => e.id == req.params.id)
    if (cart) {
        res.json(cart.products)
    } else {
        res.send('No existe un carrito con ese ID')
    }
})

// POST: Incorpora productos al carrito con id de producto (U/A)
cartRoute.post('/:id/products/:idProd', (req, res) => {
    const cart = carts.cartArray.find(e => e.id == req.params.id)
    const prod = products.productArray.find(e => e.id == req.params.idProd)
    if (cart && prod) {
        carts.addProdById(req.params.id, req.params.idProd)
        res.send('Se ha agregado el producto al carrito correctamente')
    } else {
        res.send('Error, carrito o producto no encontrado')
    }
})

// DELETE: Elimina un producto por su id de carrito y de producto (U/A)
cartRoute.delete('/:id/products/:idProd', (req, res) => {
    carts.deleteProdById(req.params.id, req.params.idProd)
    res.send('Se ha eliminado el producto correctamente')
})

export default cartRoute