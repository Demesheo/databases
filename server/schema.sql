CREATE DATABASE chat;

USE chat;

CREATE TABLE `UserNames` (
	`User ID` INT NOT NULL AUTO_INCREMENT,
	`Names` VARCHAR(255) NOT NULL,
	PRIMARY KEY (`User ID`)
);

CREATE TABLE `Messages` (
	`Message ID` INT NOT NULL AUTO_INCREMENT,
	`User ID` INT NOT NULL,
	`Message Text` VARCHAR(255) NOT NULL,
	`Chatroom ID` INT NOT NULL,
	PRIMARY KEY (`Message ID`)
);

CREATE TABLE `Chatroom` (
	`Chatroom ID` INT NOT NULL AUTO_INCREMENT,
	`Chatroom Name` VARCHAR(255) NOT NULL,
	PRIMARY KEY (`Chatroom ID`)
);

ALTER TABLE `Messages` ADD CONSTRAINT `Messages_fk0` FOREIGN KEY (`User ID`) REFERENCES `UserNames`(`User ID`);

ALTER TABLE `Messages` ADD CONSTRAINT `Messages_fk1` FOREIGN KEY (`Chatroom ID`) REFERENCES `Chatroom`(`Chatroom ID`);



/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql
 *  to create the database and the tables.*/

