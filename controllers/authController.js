import path from "path";
import jsonwebtoken from "jsonwebtoken";
import User from '../models/User.js';
import config from "../config.json" assert { type: 'json' };

export default class controller {

    static game(req, res) {
        res.sendFile(path.resolve('views', 'field.html'));
    }

    static signup(req, res) {
        res.sendFile(path.resolve('views', 'signup.html'));
    }

    static menu(req, res) {
        res.sendFile(path.resolve('views', 'menu.html'));
    }

    static login(req, res) {
        if(req.cookies.token) {
            jsonwebtoken.verify(req.cookies.token, config.jswt.secretKey, (err, decoded) => {
                if (err)
                    res.clearCookie('token').sendFile(path.resolve('views', 'login.html'));
                else
                    res.redirect('/');
            });
        } else {
            res.sendFile(path.resolve('views', 'login.html'));
        }
    }

    static async loginUser (req, res) {
        const newUser = new User('users');
        const data = req.body;

        let userId = await newUser.check(data);
        if(userId === -1) {
            // Сделать error handling потом Приоритет: 1
            res.status(401).send('Invalid login or password');
            return;
        }
        await newUser.find(userId);

        const token = jsonwebtoken.sign({
            id: newUser.id,
            login: newUser.login
        }, config.jswt.secretKey, {expiresIn: config.jswt.tokenLife});
        res.cookie("token", token);
        res.redirect("/");
    }

    static async registration(req, res) {
        console.log(req.body);
        const data = req.body;
        const userTable = new User('users');
        if (await userTable.checkData({ name: 'login', value: data.login })) {
            res.send('User exists');
            return;
        }

        if(await userTable.checkData({ name: 'email', value: data.email })) {
            res.send('Email in use');
            return;
        }

        await userTable.save(data);
        req.body.login = req.body.name;
        await controller.loginUser(req, res);
    }

    static logout(req, res) {
        res.clearCookie('token');
        res.redirect('/login');
    }
}