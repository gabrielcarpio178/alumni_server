import express, { urlencoded } from 'express'
import cors from 'cors'
import authRouter from './routes/authRoutes.js'

const app = express()

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: false}));
app.use("/uploads", express.static("uploads"));
app.use('/auth', authRouter)


app.get('/', (req, res) => {
    console.log("req.body")
})

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Server is Running ${PORT}`);
})