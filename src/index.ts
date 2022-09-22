import express from 'express'
import mongoose from 'mongoose'
import fileupload from 'express-fileupload'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './router';
import path from 'path';
console.clear()

const app = express()
const port = 3000

app.use(fileupload({}));
app.use(express.json());
app.use('/avatars/', express.static(path.join(__dirname + '/static')));
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: true
}));
app.use('/api', router);

mongoose.set('bufferCommands', false);

mongoose.connect('mongodb+srv://TechUser:07hopore@gocleancluster.ukkxs.mongodb.net/clean?retryWrites=true&w=majority', {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useFindAndModify: false,
  autoIndex:true,
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})