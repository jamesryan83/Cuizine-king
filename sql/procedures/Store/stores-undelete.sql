-- Undeletes a deleted store
CREATE OR ALTER PROCEDURE stores_undelete
    @id_store INT,
    @id_user_doing_update INT AS

    SET NOCOUNT ON
    SET XACT_ABORT ON

    DECLARE @email NVARCHAR(256)

    BEGIN TRANSACTION

        -- Get store email
        SELECT @email = email FROM Store.stores WHERE id_store = @id_store and is_deleted = 0

        IF @email IS NULL THROW 50400, 'Store not found', 1


        -- Set store deleted
        UPDATE Store.stores SET is_deleted = 1, is_deleted_email = @email, email = @id_store, updated_by = @id_user_doing_update
            WHERE id_store = @id_store


        -- TODO : undelete users too
        -- Set user deleted
        -- UPDATE App.people SET is_deleted = 1, is_deleted_email = @email, email = @id_store, updated_by = @id_user_doing_update
            -- WHERE id_store = @id_store

    COMMIT
GO
