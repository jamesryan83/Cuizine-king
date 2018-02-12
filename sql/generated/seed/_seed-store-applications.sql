

SET NOCOUNT ON
SET XACT_ABORT ON

BEGIN TRANSACTION
	INSERT INTO Store.store_applications(name,email,message,is_completed,is_cancelled,internal_notes,updated_by) VALUES ('james','jamesryan4171@gmail.com','test application',1,0,'test application',3)
	INSERT INTO Store.store_applications(name,email,message,is_completed,is_cancelled,internal_notes,updated_by) VALUES ('test','jamesryan4171+1@gmail.com',NULL,0,0,'test application',3)
	INSERT INTO Store.store_applications(name,email,message,is_completed,is_cancelled,internal_notes,updated_by) VALUES ('something','jamesryan4171+2@gmail.com','hey there !  'Here's a string in quotes'',0,1,'test application',3)
COMMIT

GO


