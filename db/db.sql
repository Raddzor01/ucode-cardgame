CREATE DATABASE IF NOT EXISTS cardgame;
CREATE USER IF NOT EXISTS 'dharin'@'localhost' IDENTIFIED BY 'securepass';
GRANT ALL PRIVILEGES ON cardgame.* TO 'dharin'@'localhost';

USE cardgame;

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    login VARCHAR(30) NOT NULL UNIQUE,
    email VARCHAR(256) NOT NULL UNIQUE,
    password VARCHAR(256) NOT NULL,
    wins INT NOT NULL DEFAULT 0,
    loses INT NOT NULL DEFAULT 0,
    picture_path VARCHAR(256) NOT NULL DEFAULT '/avatars/default_avatar.png'
);

CREATE TABLE IF NOT EXISTS cards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    mana INT NOT NULL,
    damage INT NOT NULL,
    hp INT NOT NULL,
    picture_path VARCHAR(256) NOT NULL
);

INSERT INTO cards (name, mana, damage, hp, picture_path) VALUES
                    ('Diamond shield', 3, 1, 10, 'images/diamond_shield.png'),
                    ('Manastorm', 5, 7, 5, 'images/manashtorm.png');

