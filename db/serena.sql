DROP DATABASE IF EXISTS serena;
CREATE DATABASE serena;
USE serena;

CREATE TABLE Experiencia (
	usuario varchar(30) PRIMARY KEY,
    experiencia int,
    nivel int
);

