

SET NOCOUNT ON
SET XACT_ABORT ON

BEGIN TRANSACTION
	INSERT INTO App.person_types(name,updated_by) VALUES ('web user',1)
	INSERT INTO App.person_types(name,updated_by) VALUES ('store user',1)
	INSERT INTO App.person_types(name,updated_by) VALUES ('system user',1)
COMMIT

GO
