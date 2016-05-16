# Schema to set up database

CREATE DATABASE cards_db;
USE cards_db;

CREATE TABLE cards
(
	id int AUTO_INCREMENT,
	suite varchar(30) NOT NULL,
	rank varchar(30) NOT NULL,
	image_link varchar(20) NOT NULL,
	dealt boolean DEFAULT false,
	PRIMARY KEY(id)
); 

