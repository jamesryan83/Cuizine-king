

SET NOCOUNT ON
SET XACT_ABORT ON

BEGIN TRANSACTION
	INSERT INTO App.people(id_address,is_web_user,is_store_user,is_system_user,first_name,last_name,email,phone_number,password,reset_password_token,jwt,is_verified,verification_token,is_deleted,is_deleted_email,internal_notes,updated_by) VALUES (NULL,1,0,0,'abc','test1','james4165@hotmail.com','3829 9210','$2a$10$r8roGLyywW3mGT0YKUEDnekZvKkyI1L2gU59HN9lfLyGVQmamMAdO','9RLFIGnqRoZESioRt2ZsOiCbGrYujlTDk8UxNu8MRb62Sjn4UoqVJ7tkzU8fSsFI','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwic2hvcnRFeHAiOiIzMDAwMDAiLCJpYXQiOjE1MTc3NDE1OTYsImV4cCI6MTU0OTI5OTE5Nn0.RvCp0bNgdtUoaFQNcBZMzCXTM5l3pfc2xO9Aw5QsjU0',1,'T5TEQheJSuC8GVqcowqcOnExinHR5sKDBPFTapTuiO9Ct1zYXFckU0BTaJHGGdLr',0,NULL,'james admin web account',1)
	INSERT INTO App.people(id_address,is_web_user,is_store_user,is_system_user,first_name,last_name,email,phone_number,password,reset_password_token,jwt,is_verified,verification_token,is_deleted,is_deleted_email,internal_notes,updated_by) VALUES (NULL,1,1,0,'def','test2','jamesryan4171@gmail.com','3830 9211','$2a$10$NPLNSYTnFxzP98cqd5iFdOdHvS63CZ2GPvL/aQiKTDBOIJNwJm.g2','Dh3fv9H9BIGkLEAsxlrcmfDb09FQ1o5yrLSqts5HL9lS8RWXCGvawPbzcGP6exLw','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwic2hvcnRFeHAiOiIzMDAwMDAiLCJpYXQiOjE1MTc3NDE2MDcsImV4cCI6MTU0OTI5OTIwN30.CjvcjnfZgybk4kTo8LE8WfpDKE3o_nWprxuTmnXUfos',1,'VUTOf05XFLZQYlCSfAciFU8wl9yZfpsYg4UESWnQZxS0Ef5mbB8oVxaoNB53CW4N',0,NULL,'james admin store account',1)
	INSERT INTO App.people(id_address,is_web_user,is_store_user,is_system_user,first_name,last_name,email,phone_number,password,reset_password_token,jwt,is_verified,verification_token,is_deleted,is_deleted_email,internal_notes,updated_by) VALUES (NULL,1,1,1,'ghi','test3','james4171@hotmail.com','3830 9211','$2a$10$07dMEZGdynhXzQNPKf/zme9A0jUZBQgBgJf3Tm9PMk4mxdfVERPj6','CNRWPnmLCTNIsJxdv5sgU6JCXqS6q7ozADRIEzAtBPUZWyD4v2Brsk81bsesFkN0','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwic2hvcnRFeHAiOiIzMDAwMDAiLCJpYXQiOjE1MTc3NDE2MjEsImV4cCI6MTU0OTI5OTIyMX0.gNpzQhDhwlPI6GpVXN9JfVtelK0_X-Sj16aRvTOj1cw',1,'PYEjn191qkTD8QCoMOUegQn8Fdo9ZrexFE1nhy1a7qQuC6mqS2bH2YILqFnVFjHI',0,NULL,'james admin system account',1)
COMMIT

GO


