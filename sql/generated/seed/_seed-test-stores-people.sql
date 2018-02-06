

SET NOCOUNT ON
SET XACT_ABORT ON

BEGIN TRANSACTION
	INSERT INTO Store.stores_people(id_store,id_person,updated_by) VALUES (1,2,3)
COMMIT

GO


