-- Get a store
CREATE PROCEDURE stores_get
    @id_store INT AS

	SET NOCOUNT ON
    SET XACT_ABORT ON

    DECLARE @id_postcode INT
    DECLARE @newAddressId INT
    DECLARE @newPersonId INT
    DECLARE @newStoreId INT


    BEGIN TRANSACTION

        SELECT * FROM Store.stores WHERE id_store = @id_store

    COMMIT

GO