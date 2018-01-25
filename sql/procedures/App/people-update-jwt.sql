-- Update a persons jwt
CREATE PROCEDURE people_update_jwt
	@email NVARCHAR(255),
    @jwt NVARCHAR(512) AS

    SET NOCOUNT ON

    DECLARE @id_person INT

    SELECT @id_person = id_person
    FROM App.people
	WHERE @email = email AND is_deleted = 0

    IF @id_person IS NULL THROW 50400, 'Account not found', 1

	UPDATE App.people SET jwt = @jwt
	WHERE id_person = @id_person

    SELECT id_person, id_store, id_person_type FROM App.people
    WHERE id_person = @id_person
GO