

SET NOCOUNT ON
SET XACT_ABORT ON

BEGIN TRANSACTION
	INSERT INTO Store.stores_people(id_store,id_person,updated_by) VALUES (1,5,1)
	INSERT INTO Store.stores_people(id_store,id_person,updated_by) VALUES (2,6,1)
	INSERT INTO Store.stores_people(id_store,id_person,updated_by) VALUES (3,10,1)
	INSERT INTO Store.stores_people(id_store,id_person,updated_by) VALUES (4,11,1)
	INSERT INTO Store.stores_people(id_store,id_person,updated_by) VALUES (5,12,1)
COMMIT

GO


