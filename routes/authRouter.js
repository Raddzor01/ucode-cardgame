import express from "express";
import controller from "../controllers/authController.js";

const authRouter = express.Router();

// добавить функцию для аунтентификации вебтокена после почти каждого чиха,
// особенно для меню для перенаправления на логин Приоритет: 9
authRouter.get('/', controller.menu);
authRouter.get('/signup', controller.signup);
authRouter.post('/signup', controller.registration);
authRouter.get('/login', controller.login);
authRouter.post('/login', controller.loginUser);
// напоминание пароля Приоритет: 5

export default authRouter;