
DECLARE @adminPersonType TINYINT
DECLARE @adminPassword NVARCHAR(256)
DECLARE @adminJwt NVARCHAR(512)

SET @adminPersonType = 3
SET @adminPassword = '$2a$10$ygT7MsumPH8e1gbcTU9Jte/G.mw8GmnEhcE7DySLU57zMe3Srdu1W'
SET @adminJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbWVzNDE3MUBob3RtYWlsLmNvbSIsImlhdCI6MTUxNjYzNDUyNSwiZXhwIjoxNTQ4MTkyMTI1fQ.KxXG85zo9ND4XVa4zMKa5daUh4azThxQm8T1LgfIrnI'

SET NOCOUNT ON

INSERT INTO App.people
(id_person_type, first_name, last_name, email,
 password, jwt, is_verified, verification_token, updated_by)
VALUES
(@adminPersonType, 'james', 'ryan', 'james4171@hotmail.com',
 @adminPassword, @adminJwt, 1, 'na', 1)

 GO