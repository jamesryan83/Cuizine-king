-- Get a person by jwt
CREATE OR ALTER PROCEDURE people_get_by_jwt
	@jwt NVARCHAR(512),
	@id_person INT AS


    DECLARE @email NVARCHAR(256)
    DECLARE @is_store_user BIT
    DECLARE @is_system_user BIT
    DECLARE @jwt_person AS NVARCHAR(512)

    SET NOCOUNT ON

    -- TODO : a better check
    -- check for bad token
    IF @jwt IS NULL OR LEN(@jwt) < 30 THROW 50400, 'invalidToken', 1


    -- get user type and jwt
    SELECT @email = email, @jwt_person = jwt, @is_store_user = is_store_user, @is_system_user = is_system_user
    FROM App.people
    WHERE id_person = @id_person AND is_deleted = 0


    -- no user found
    IF @email IS NULL THROW 50400, 'accountNotFound', 1


    -- check jwt
    IF @jwt <> @jwt_person THROW 50401, 'invalidToken', 1


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