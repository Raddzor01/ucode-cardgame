import path from "path";
import jsonwebtoken from "jsonwebtoken";
import User from '../models/User.js';

export default class controller {

    static signup(req, res) {
        res.sendFile(path.resolve('views', 'signup.html'));
    }

    static menu(req, res) {
        res.sendFile(path.resolve('views', 'menu.html'));
    }

    static login(req, res) {
        if(req.cookies.token) {
            // вынести константы в конфиг или отдельный модуль Приоритет: 5
            jsonwebtoken.verify(req.cookies.token, "securepass", (err, decoded) => {
                if (err) {
                    res.clearCookie('token');
                    res.sendFile(path.resolve('views', 'login.html'));
                } else {
                    res.redirect('/');
                }
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
            res.send('Invalid login or password');
            return;
        }
        await newUser.find(userId);
        // вынести константы в конфиг или отдельный модуль
        const token = jsonwebtoken.sign({
            id: newUser.id,
            login: newUser.login
        }, "securepass", {expiresIn: 5000});
        res.cookie("token", token);
        console.log(res.cookie.token + ";" + token);
        res.redirect("/");
    }

    static async registration(req, res) {
        console.log(req.body);
        const data = req.body;
        const userTable = new User('users');
        if (await userTable.exists({
            name: 'login',
            value: data.login
        })) {
            // Сделать error handling потом
            res.end('User exists');
            return;
        }

        await userTable.save(data);
        // Добавить логин сразу после рега
        res.redirect('/login');
    }
}