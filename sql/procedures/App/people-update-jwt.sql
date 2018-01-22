-- Update a persons jwt
CREATE PROCEDURE people_update_jwt
	@email NVARCHAR(255),
    @jwt NVARCHAR(512),
    @id_person INT OUTPUT AS

    SET NOCOUNT ON

	UPDATE App.people SET jwt = @jwt
	WHERE email = @email AND is_deleted = 0

    SELECT @id_person = id_person FROM App.people
    WHERE email = @email AND is_deleted = 0
GO