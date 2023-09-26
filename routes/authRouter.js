import express from "express";
import jsonwebtoken from "jsonwebtoken";

import controller from "../controllers/authController.js";

const authRouter = express.Router();

// добавить функцию для аунтентификации вебтокена после почти каждого чиха,
// особенно для меню для перенаправления на логин Приоритет: 9
authRouter.get('/', checkToken, controller.menu);
authRouter.get('/signup', controller.signup);
authRouter.post('/signup', controller.registration);
authRouter.get('/login', controller.login);
authRouter.post('/login', controller.loginUser);
// напоминание пароля Приоритет: 5

function checkToken(req, res, next) {
    let token = req.cookies ? req.cookies.token : undefined;
    if(!token)
        return res.redirect("/login");
    jsonwebtoken.verify(token, "securepass", (err, decoded) => {
       if(err) {
           res.status(403).redirect("/login");
           return;
       }
    });
}

export default authRouter;