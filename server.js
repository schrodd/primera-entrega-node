import express from 'express'
import { productRoute } from './routes/products.js'
import cartRoute from './routes/cart.js'
const app = express()
const port = 8080 // Reemplazar con process.env.PORT en glitch.com

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/api/products', productRoute)
app.use('/api/cart', cartRoute)

app.listen(port, () => {
    console.log('Server is running')
})

app.get('/', (req,res) => {
    res.send('Funciona')
})

