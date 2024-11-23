import express, { urlencoded } from 'express'
import cors from 'cors'
import authRouter from './routes/authRoutes.js'
import logger from './logger/logger.js'

const app = express()
app.use(logger);
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: false}));
app.use("/uploads", express.static("uploads"));
app.use('/auth', authRouter)


app.get('/', (req, res) => {
    return res.json({message: 'Api test for alumni information system', developer: 'gabriel carpio bsis graduate of bago city college'})
})

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Server is Running ${PORT}`);
})