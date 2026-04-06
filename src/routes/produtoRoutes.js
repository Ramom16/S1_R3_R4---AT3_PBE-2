import { Router } from 'express';
import produtoController from '../controllers/produtoController.js';
import uploadImageMiddleware from '../middlewares/uploadImage.middleware.js';

const produtoRoutes = Router();

produtoRoutes.post('/', uploadImageMiddleware, produtoController.criar);
produtoRoutes.put('/:id', uploadImageMiddleware, produtoController.atualizar);
produtoRoutes.delete('/:id', produtoController.deletar);
produtoRoutes.get('/', produtoController.selecionar);

export default produtoRoutes;