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
                    ('Shreck', 5, 5, 5, '/cards/shreck.png'),
                    ('Gang', 7, 6, 6, '/cards/gang.png'),
                    ('Witch', 3, 2, 4, '/cards/witch.png'),
                    ('Skeleton warrior', 4, 4, 5, '/cards/skeleton_warrior.png'),
                    ('Skeleton mage', 5, 5, 5, '/cards/skeleton_mage.png'),
                    ('Cat-soldier', 2, 1, 3, '/cards/cat-soldier.png'),
                    ('Thor', 7, 6, 8, '/cards/thor.png'),
                    ('Golden samurai', 5, 2, 8, '/cards/golden_samurai.png'),
                    ('Biggg knight', 6, 3, 10, '/cards/biggg_knight.png'),
                    ('Meat steak', 0, 0, 0, '/cards/meat_steak.png'),
                    ('Bear', 7, 7, 7, '/cards/bear.png'),
                    ('Baby yoda', 3, 5, 3, '/cards/baby_yoda.png'),
                    ('Gachi bear', 10, 10, 10, '/cards/gachi_bear.png'),
                    ('Ronaldo', 1, 1, 1, '/cards/ronaldo.png'),
                    ('Soldier', 4, 4, 4, '/cards/soldier.png'),
                    ('Walter', 2, 3, 1, '/cards/walter.png'),
                    ('MARIOOO', 10, 10, 10, '/cards/mario.png'),
                    ('Patsyuk', 2, 2, 2, '/cards/patsyuk.png'),
                    ('WoT enjoyer', 9, 9, 9, '/cards/wot_enjoyer.png'),
                    ('Dwarf', 6, 6, 6, '/cards/dwarf.png'),
                    ('Gnome wizard', 4, 4, 4, '/cards/gnome_wizard.png'),
                    ('Robo spider', 8, 8, 8, '/cards/robo_spider.png'),
                    ('Porshe 911', 3, 3, 3, '/cards/porshe_911.png'),
                    ('Victor', 4, 4, 2, '/cards/victor.png'),
                    ('Pilot', 2, 2, 2, '/cards/pilot.png'),
                    ('Robot zombie', 3, 3, 3, '/cards/robot_zombie.png'),
                    ('Boy-cat', 1, 1, 1, '/cards/boy-cat.png');

