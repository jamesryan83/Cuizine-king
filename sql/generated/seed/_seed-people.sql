

SET NOCOUNT ON
SET XACT_ABORT ON

BEGIN TRANSACTION
	INSERT INTO App.people(id_address,is_web_user,is_store_user,is_system_user,first_name,last_name,email,phone_number,password,reset_password_token,jwt,is_verified,verification_token,is_deleted,is_deleted_email,internal_notes,updated_by) VALUES (NULL,1,0,0,'test1','test12','jamesryan4171+2@gmail.com','3829 9210','$2a$10$r8roGLyywW3mGT0YKUEDnekZvKkyI1L2gU59HN9lfLyGVQmamMAdO','9RLFIGnqRoZESioRt2ZsOiCbGrYujlTDk8UxNu8MRb62Sjn4UoqVJ7tkzU8fSsFI','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwic2hvcnRFeHAiOiIzMDAwMDAiLCJpYXQiOjE1MjA2NzQ0NTYsImV4cCI6MTU1MjIzMjA1Nn0.T4hGTLfBhGu2PviSmXvkHflbf2tgZD6XsSBiXEqCItA',1,'T5TEQheJSuC8GVqcowqcOnExinHR5sKDBPFTapTuiO9Ct1zYXFckU0BTaJHGGdLr',0,NULL,'james admin web account',3)
	INSERT INTO App.people(id_address,is_web_user,is_store_user,is_system_user,first_name,last_name,email,phone_number,password,reset_password_token,jwt,is_verified,verification_token,is_deleted,is_deleted_email,internal_notes,updated_by) VALUES (NULL,1,1,0,'test2','test23','jamesryan4171+1@gmail.com','3830 9211','$2a$10$NPLNSYTnFxzP98cqd5iFdOdHvS63CZ2GPvL/aQiKTDBOIJNwJm.g2','Dh3fv9H9BIGkLEAsxlrcmfDb09FQ1o5yrLSqts5HL9lS8RWXCGvawPbzcGP6exLw','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwic2hvcnRFeHAiOiIzMDAwMDAiLCJpYXQiOjE1MjA2NzQ0ODIsImV4cCI6MTU1MjIzMjA4Mn0.xrnQ9mCgbAy7v7R3oVJGT21nNVKPpp9iouEi6T81xJI',1,'VUTOf05XFLZQYlCSfAciFU8wl9yZfpsYg4UESWnQZxS0Ef5mbB8oVxaoNB53CW4N',0,NULL,'james admin store account',3)
	INSERT INTO App.people(id_address,is_web_user,is_store_user,is_system_user,first_name,last_name,email,phone_number,password,reset_password_token,jwt,is_verified,verification_token,is_deleted,is_deleted_email,internal_notes,updated_by) VALUES (NULL,1,1,1,'test3','test34','jamesryan4171@gmail.com','3830 9211','$2a$10$07dMEZGdynhXzQNPKf/zme9A0jUZBQgBgJf3Tm9PMk4mxdfVERPj6','CNRWPnmLCTNIsJxdv5sgU6JCXqS6q7ozADRIEzAtBPUZWyD4v2Brsk81bsesFkN0','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwic2hvcnRFeHAiOiIzMDAwMDAiLCJpYXQiOjE1MjA2NzQ0OTYsImV4cCI6MTU1MjIzMjA5Nn0.64izLBs9h9F9r1kJ-Fjcg1TH7rmuslfJ-oLm2NatU0Y',1,'PYEjn191qkTD8QCoMOUegQn8Fdo9ZrexFE1nhy1a7qQuC6mqS2bH2YILqFnVFjHI',0,NULL,'james admin system account',3)
COMMIT

GO


