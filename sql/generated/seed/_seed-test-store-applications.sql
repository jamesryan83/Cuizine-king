

SET NOCOUNT ON
SET XACT_ABORT ON

BEGIN TRANSACTION
	INSERT INTO Store.store_applications(name,email,message,is_completed,is_cancelled,internal_notes,updated_by) VALUES ('james','jamesryan4171@gmail.com','test application',1,0,'test application',3)
COMMIT

GO


