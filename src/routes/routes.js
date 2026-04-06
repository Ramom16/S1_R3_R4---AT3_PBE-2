import { Router } from "express";
const routes = Router();
import categoriaRoutes from "./categoriaRoutes.js";
import produtoRoutes from "./produtoRoutes.js";
import clienteRoutes from "./clienteRoutes.js";

routes.use('/categoria', categoriaRoutes);
routes.use('/produto', produtoRoutes);
routes.use('/cliente', clienteRoutes);

export default routes;