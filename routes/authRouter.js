import express from "express";
import jsonwebtoken from "jsonwebtoken";

import controller from "../controllers/authController.js";

const router = express.Router();

// добавить функцию для аунтентификации вебтокена после почти каждого чиха,
// особенно для меню для перенаправления на логин Приоритет: 9
router.get('/', checkToken, controller.menu);
router.get('/signup', controller.signup);
router.post('/signup', controller.registration);
router.get('/login', controller.login);
router.post('/login', controller.loginUser);
router.get('/logout', checkToken, controller.logout);
// напоминание пароля Приоритет: 5

function checkToken(req, res, next) {
    let token = req.cookies.token;
    if (!token)
        return res.redirect("/login");
    jsonwebtoken.verify(token, "securepass", (err, decoded) => {
        if (err) {
            res.status(403).clearCookie('token').redirect("/login");
            return;
        }
        req.user = decoded;
        next();
    });
}

export default router;