-- Update a persons jwt
CREATE OR ALTER PROCEDURE people_update_jwt
	@id_person INT,
    @jwt NVARCHAR(512) AS

    SET NOCOUNT ON


    -- error if account not found
    IF (SELECT TOP 1 id_person FROM App.people
       WHERE id_person = @id_person AND is_deleted = 0) IS NULL
       THROW 50400, 'accountNotFound', 1


    -- update person jwt
	UPDATE App.people SET jwt = @jwt
	WHERE id_person = @id_person


    -- return person
    SELECT id_person, is_web_user, is_store_user, is_system_user FROM App.people
    WHERE id_person = @id_person

GO