

SET NOCOUNT ON
SET XACT_ABORT ON

BEGIN TRANSACTION
	INSERT INTO App.person_types(id_person_type,name,updated_by) VALUES (1,'web user',1)
	INSERT INTO App.person_types(id_person_type,name,updated_by) VALUES (2,'store user',1)
	INSERT INTO App.person_types(id_person_type,name,updated_by) VALUES (3,'system user',1)
COMMIT

GO


