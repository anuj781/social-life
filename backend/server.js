import express from 'express'
const app = express();
const port = 6677;
import cors from 'cors'

import connectToDb from './config/db.js';

connectToDb()

app.use(cors())
app.use(express.json())

app.set('view engine', 'ejs')

app.get('/',(req,res)=>{
    res.send('welcome home')
})

import userRoute from './routes/userRoute.js'
app.use('/user',userRoute)
import postRoute from './routes/postRoute.js'
app.use('/post',postRoute)
import messageRoutes from './routes/messageRoutes.js'
app.use('/messages', messageRoutes)

app.listen(port,()=>{
    console.log(`server is running on http://localhost:${port}`)
})