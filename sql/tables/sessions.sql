-- mssql session table
CREATE TABLE sessions
(
	sid VARCHAR(255) NOT NULL PRIMARY KEY,
	session VARCHAR(MAX) NOT NULL,
	expires DateTime NOT NULL
)
GO