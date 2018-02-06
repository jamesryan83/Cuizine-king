

SET NOCOUNT ON
SET XACT_ABORT ON

BEGIN TRANSACTION
	INSERT INTO Store.store_applications(name,email,message,is_completed,is_cancelled,internal_notes,updated_by) VALUES ('james','james4165@hotmail.com','test application',1,0,'test application',3)
	INSERT INTO Store.store_applications(name,email,message,is_completed,is_cancelled,internal_notes,updated_by) VALUES ('test','test@test.com',NULL,0,0,'test application',3)
	INSERT INTO Store.store_applications(name,email,message,is_completed,is_cancelled,internal_notes,updated_by) VALUES ('something','something@email.com','hey there !  'Here's a string in quotes'',0,1,'test application',3)
COMMIT

GO


