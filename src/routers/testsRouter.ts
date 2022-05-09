import { Router } from "express";
import * as testsController from "../controllers/testsController.js"

const testsRouter = Router();

testsRouter.post("/reset-database", testsController.resetDatabase);

export default testsRouter;