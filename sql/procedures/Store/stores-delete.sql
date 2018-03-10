-- Soft deletes a store
CREATE OR ALTER PROCEDURE stores_delete
    @id_store INT,
    @id_user_doing_update INT AS

    SET NOCOUNT ON
    SET XACT_ABORT ON

    DECLARE @email NVARCHAR(255)

    BEGIN TRANSACTION

        -- only system users can delete stores
        IF (SELECT TOP 1 id_person FROM App.people WHERE id_person = @id_user_doing_update AND is_system_user = 1 AND is_deleted = 0) IS NULL
            THROW 50401, 'notAuthorized', 1

        -- Get store email
        SELECT @email = email FROM Store.stores WHERE id_store = @id_store and is_deleted = 0

        IF @email IS NULL THROW 50400, 'storeNotFound', 1

        -- Set store deleted
        UPDATE Store.stores SET is_deleted = 1, is_deleted_email = @email, email = @id_store, updated_by = @id_user_doing_update
            WHERE id_store = @id_store

        -- TODO : delete users and addresses and other stuff too
        -- Set user deleted
        -- UPDATE App.people SET is_deleted = 1, is_deleted_email = @email, email = @id_store, updated_by = @id_user_doing_update
            -- WHERE id_store = @id_store

    COMMIT
GO
