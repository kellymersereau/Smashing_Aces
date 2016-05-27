# Schema to set up database

CREATE DATABASE cards_db;
USE cards_db;

CREATE TABLE cards
(
	id int AUTO_INCREMENT,
	suite varchar(30) NOT NULL,
	rank varchar(30) NOT NULL,
	image_link varchar(20) NOT NULL,
	back_image_link varchar(20) NOT NULL,
	dealt boolean DEFAULT false,
	PRIMARY KEY(id)
); 

# Schema for user sign-in

CREATE TABLE users
(
	id int AUTO_INCREMENT,
	username varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	password_hash varchar(255) NOT NULL,
	photo varchar(500) NOT NULL,
	play_money int DEFAULT 0,
	bit_coins int DEFAULT 0,
	PRIMARY KEY (id)
);

