import fs from 'fs'
const route = './data/products.json'
const utf = 'utf-8'

export default class Products {
    constructor(productArray) {
        this.productArray = productArray
        this.updateFile()
    }
    async updateFile() { // Uso interno
        try {
            this.productArray = JSON.parse(await fs.promises.readFile(route, utf))
            return this.productArray
        }
        catch (err) {
            console.log(err)
        }
    }
    async saveFile(prod) { // Uso interno
        try {
            await fs.promises.writeFile(route, JSON.stringify(prod), utf)
        }
        catch (err) {
            console.log(err)
        }
    }
    save = async prod => {
        await this.updateFile()
        let id = 1
        if (this.productArray.length > 0){
            id = this.productArray.at(-1).id + 1
        }
        prod.id = id
        prod.timestamp = new Date(Date.now()).toLocaleString()
        this.productArray.push(prod)
        await this.saveFile(this.productArray)
        console.log('Se ha guardado con éxito')
        return id
    }
    getById = async id => {
        await this.updateFile()
        const prod = this.productArray.find(e => e.id == id)
        console.log(prod ? prod : 'No se encontró, no existe un objeto con ese ID')
        return prod ? prod : null
    }
    getAll = async () => {
        await this.updateFile()
        console.log(this.productArray)
        return this.productArray
    }
    deleteById = async id => {
        await this.updateFile()
        let index = this.productArray.findIndex(e => e.id == id)
        if (index != -1){
            this.productArray.splice(index, 1)
            await this.saveFile(this.productArray)
            console.log('Se ha eliminado con éxito')
            return null
        }
    }
    updateById = async (id, prod) => {
        await this.updateFile()
        const prodInArrayIndex = this.productArray.findIndex(e => e.id == id)
        const prodInArray = this.productArray.find(e => e.id == id)
        const prodId = prodInArray.id
        const timestamp = prodInArray.timestamp
        if (prodInArray){
            prod.id = prodId
            prod.timestamp = timestamp
            this.productArray.splice(prodInArrayIndex, 1)
            this.productArray.push(prod)
            await this.saveFile(this.productArray)
            console.log('Se ha actualizado con éxito')
            return null
        }
        console.log('No existe un objeto con ese ID')
    }
}