import express from 'express'
import Products from '../data/Products.js'
export const productRoute = express.Router()
export const products = new Products()

const admin = true
// Middleware a nivel de ruta
const verificarRol = (req, res, next) => {
    if (admin) { 
        console.log('Acceso otorgado')
        next()
    } else {
        console.log('Acceso denegado')
        res.send('No tiene permisos para acceder a esta ruta')
    }
}

// GET: Lista todos los productos o uno por su id (U/A)
productRoute.get('/', (req, res) => {
    res.json(products.productArray)
})
productRoute.get('/:id', (req, res) => {
    const product = products.productArray.find(e => e.id == req.params.id)
    product ? res.json(product) : res.send('No se ha encontrado ese producto')
})

// POST: Incorpora productos al listado (A). No se indica el id.
productRoute.post('/', verificarRol, async (req, res) => {
    const newId = await products.save(req.body)
    newId 
        ? res.send(`Se ha añadido el producto correctamente con el id ${newId}`)
        : res.send(`No se pudo incorporar el producto`)
})

// PUT: Actualiza un producto por su id (A). El objeto del body debe tener ya el atributo id
// y debe coincidir con el param indicado.
productRoute.put('/:id', verificarRol, async (req, res) => {
    const productIndex = products.productArray.findIndex(e => e.id == req.params.id)
    productIndex == -1
        ? res.send(`No se ha encontrado ese producto`) 
        : await products.updateById(req.params.id, req.body); res.send(`Se ha actualizado el producto correctamente`)
})

// DELETE: Borra un producto por su id (A)
productRoute.delete('/:id', verificarRol, async (req, res) => {
    const productIndex = products.productArray.find(e => e.id == req.params.id)
    if (productIndex != -1) {
        await products.deleteById(req.params.id)
        res.send('Se ha eliminado exitosamente')
    } else {
        res.send(`No se ha encontrado ese producto`)
    }
})