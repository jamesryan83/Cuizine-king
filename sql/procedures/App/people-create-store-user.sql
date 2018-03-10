-- Create a store user
CREATE OR ALTER PROCEDURE people_create_store_user
    @id_store INT,
	@first_name NVARCHAR(64),
    @last_name NVARCHAR(64),
    @email NVARCHAR(256),
	@password NVARCHAR(64),
    @verification_token NVARCHAR(64),
    @id_user_doing_update INT,
    @newPersonId INT OUTPUT AS

    SET NOCOUNT ON
    SET XACT_ABORT ON

    BEGIN TRANSACTION

        DECLARE @is_web_user BIT
        DECLARE @is_store_user BIT
        DECLARE @is_system_user BIT


        -- get user type
        SELECT TOP 1 @is_store_user = is_store_user, @is_system_user = is_system_user
        FROM App.people
        WHERE id_person = @id_user_doing_update AND is_deleted = 0


        -- not a store or system user
        IF (@is_store_user = 0) THROW 50401, 'notAuthorized', 1


        -- does the store exist
        IF (SELECT TOP 1 id_store FROM Store.stores WHERE id_store = @id_store AND is_deleted = 0) IS NULL
            THROW 50400, 'storeNotFound', 1


        -- if a store_user, check if user doing update is member of the store
        IF (@is_system_user = 0)
        BEGIN
            IF (SELECT TOP 1 id_person FROM Store.stores_people WHERE id_store = @id_store AND id_person = @id_user_doing_update) IS NULL
                THROW 50401, 'notAuthorized', 1
        END


        -- check account isn't already taken
        IF (SELECT TOP 1 email FROM App.people WHERE email = @email AND is_deleted = 0) IS NOT NULL
            THROW 50409, 'accountAlreadyTaken', 1


        -- create user
        INSERT INTO App.people
            (is_web_user, is_store_user, is_system_user, first_name, last_name, email, password, verification_token, updated_by)
            VALUES
            (1, 1, 0, @first_name, @last_name, @email, @password, @verification_token, @id_user_doing_update)


        -- output value
        SET @newPersonId = dbo.get_sequence_value('id_person')


        -- create link to store
        INSERT INTO Store.stores_people (id_store, id_person, is_store_owner, updated_by)
            VALUES (@id_store, @newPersonId, 0, @id_user_doing_update)

    COMMIT
GO