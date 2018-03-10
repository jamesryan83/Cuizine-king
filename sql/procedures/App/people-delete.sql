-- Delete a person
CREATE OR ALTER PROCEDURE people_delete
    @id_person INT,
    @jwt NVARCHAR(512) AS

    SET NOCOUNT ON
    SET XACT_ABORT ON

    BEGIN TRANSACTION

        DECLARE @is_store_user BIT
        DECLARE @is_system_user BIT
        DECLARE @is_store_owner BIT
        DECLARE @email NVARCHAR(256)
        DECLARE @jwt_person NVARCHAR(512)


        -- some test accounts can't be deleted
        IF (@id_person <= @const_number_of_protected_users) THROW 50400, 'protectedAccount', 1


        -- get user type and jwt
        SELECT @email = email, @jwt_person = jwt, @is_store_user = is_store_user, @is_system_user = is_system_user
        FROM App.people
        WHERE id_person = @id_person AND is_deleted = 0


        -- no user found
        IF @email IS NULL THROW 50400, 'accountNotFound', 1


        -- check jwt
        -- If a jwt is null the user has never logged in, ok to delete account
        IF @jwt_person IS NOT NULL AND @jwt <> @jwt_person THROW 50401, 'invalidToken', 1


        IF (@is_store_user = 1)
            BEGIN
                -- store owners have to be deleted using the admin program
                IF (SELECT is_store_owner FROM Store.stores_people WHERE id_person = @id_person) = 1
                    THROW 50401, 'storeOwnersContactSupport', 1

                -- delete store users link to store
                DELETE FROM Store.stores_people WHERE id_person = @id_person
            END


        -- delete user
        UPDATE App.people
        SET email = @id_person, is_deleted = 1, is_deleted_email = @email, updated_by = @id_person
        WHERE id_person = @id_person

    COMMIT
GO