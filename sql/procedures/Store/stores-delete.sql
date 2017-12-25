-- Soft deletes a store
CREATE PROCEDURE stores_delete
    @id_store INT,
    @id_user_doing_update INT AS

    UPDATE Store.stores SET is_deleted = 1, updated_by = @id_user_doing_update
        WHERE id_store = @id_store
GO