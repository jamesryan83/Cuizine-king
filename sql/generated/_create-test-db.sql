-- GENERATED FILE

USE master

IF EXISTS (SELECT name FROM master.dbo.sysdatabases WHERE name = N'menuthingTest')
BEGIN
ALTER DATABASE menuthingTest SET SINGLE_USER WITH ROLLBACK IMMEDIATE
DROP DATABASE menuthingTest
END
CREATE DATABASE menuthingTest

GO
