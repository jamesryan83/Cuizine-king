-- Get a person by email
CREATE OR ALTER PROCEDURE people_get_by_email
	@email NVARCHAR(256) AS

    DECLARE @id_person INT
    DECLARE @is_store_user BIT
    DECLARE @is_system_user BIT

    SET NOCOUNT ON


    -- get user type
    SELECT @id_person = id_person, @is_store_user = is_store_user, @is_system_user = is_system_user FROM App.people
    WHERE email = @email AND is_deleted = 0


    -- no user found
    IF (@id_person IS NULL) THROW 50400, 'Account not found', 1


    -- return user
    IF @is_store_user = 1 AND @is_system_user = 0
        -- get store user
        SELECT App.people.*, Store.stores_people.id_store, Store.stores_people.is_store_owner FROM App.people
        JOIN Store.stores_people
        ON App.people.id_person = Store.stores_people.id_person
        WHERE App.people.id_person = @id_person
    ELSE
        -- get website or system user
        SELECT * FROM App.people
        WHERE id_person = @id_person

GO