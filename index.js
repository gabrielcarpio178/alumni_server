import express, { urlencoded } from 'express'
import cors from 'cors'
import authRouter from './routes/authRoutes.js'
import moment from 'moment'

const app = express()

const logger = (req, res, next) =>{
    console.log(`${req.protocol}://${req.get('host')}${req.originalUrl} : ${moment().format()}`);
    next();
}

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

