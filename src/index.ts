import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser';

import {UserController, AdsController} from './controllers';

const app = express()
const port = 3000

app.use(bodyParser.json());

const User = new UserController;
const Ad = new AdsController;

mongoose.set('bufferCommands', false);

mongoose.connect('mongodb://localhost:27017/clean', {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useFindAndModify: false
}).
catch( error => {
  let handleError: any = error;
  console.log(handleError);
});

app.get( '/user/:id', User.index )
app.delete( '/user/:id', User.delete );
app.post( '/user/create', User.create )

app.get( '/ads/:id', Ad.index );
app.get( '/ads', Ad.getAll );
app.delete( '/ads/:id', Ad.delete);
app.post( '/ads/create-ad', Ad.create );
app.post( '/ads/update/:id', Ad.update );


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})