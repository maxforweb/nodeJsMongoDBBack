import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './router';

const app = express()
const port = 3000

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api', router);

// const User = new UserController;
// const Ad = new AdsController;

mongoose.set('bufferCommands', false);

mongoose.connect('mongodb+srv://TechUser:07hopore@gocleancluster.ukkxs.mongodb.net/clean?retryWrites=true&w=majority', {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useFindAndModify: false,
  autoIndex:true,
}).
catch( error => {
  let handleError: any = error;
  console.log(handleError);
});

// app.get( '/user/:email', User.index )
// app.delete( '/user/:id', User.delete );
// app.post( '/user/create', User.create )

// app.get( '/ads/:id', Ad.index );
// app.get( '/ads', Ad.getAll );
// app.delete( '/ads/:id', Ad.delete);
// app.post( '/ads/create-ad', Ad.create );
// app.post( '/ads/update/:id', Ad.update );

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})