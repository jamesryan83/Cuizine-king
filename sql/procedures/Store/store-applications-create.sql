-- Create a store
-- creates an address, user and store
CREATE OR ALTER PROCEDURE store_applications_create
    @name NVARCHAR(128),
    @email NVARCHAR(256),
    @message NVARCHAR(256),
    @id_user_doing_update INT,
    @newStoreApplicationId INT OUTPUT AS

	SET NOCOUNT ON
    SET XACT_ABORT ON

    BEGIN TRANSACTION

        -- create store application
        INSERT INTO Store.store_applications
            (name, email, message, updated_by)
            VALUES
            (@name, @email, @message, @id_user_doing_update)


        -- output new store application id
        SET @newStoreApplicationId = dbo.get_sequence_value('id_store_application')
    COMMIT

GO