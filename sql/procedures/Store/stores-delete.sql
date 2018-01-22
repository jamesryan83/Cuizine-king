-- Soft deletes a store
CREATE PROCEDURE stores_delete
    @id_store INT,
    @id_user_doing_update INT AS

    -- Get store email
    DECLARE @email NVARCHAR(256)
    SELECT @email = email FROM Store.stores WHERE id_store = @id_store and is_deleted = 0
    IF @email IS NULL THROW 50400, 'Store not found', 1

    -- Set store deleted
    UPDATE Store.stores SET is_deleted = 1, is_deleted_email = @email, email = @id_store, updated_by = @id_user_doing_update
        WHERE id_store = @id_store
GO