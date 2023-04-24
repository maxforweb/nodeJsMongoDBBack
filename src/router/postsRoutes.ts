import { Router } from 'express';
import { AdsController } from '../controllers';

const postsRouter = Router();
const Ad = new AdsController();

// postsRouter.get('/posts/:id', Ad.index);
// postsRouter.get('/posts', Ad.getAll);
// postsRouter.delete('/posts/:id', Ad.delete);
// postsRouter.post('/posts/create', Ad.create);
// postsRouter.post('/posts/update/:id', Ad.update);

export default postsRouter;