-- Update password
CREATE OR ALTER PROCEDURE people_update_password
	@email NVARCHAR(256),
	@reset_password_token NVARCHAR(64),
    @password NVARCHAR (64) AS


    -- check for bad token
    IF @reset_password_token IS NULL OR LEN(@reset_password_token) < 64 THROW 50400, 'invalidToken', 1


    -- check person data
    DECLARE @person_reset_password_token AS NVARCHAR(64)
    DECLARE @id_person AS INT

    SELECT @id_person = id_person, @person_reset_password_token = reset_password_token
        FROM App.people WHERE email = @email AND is_deleted = 0

    IF @id_person IS NULL THROW 50400, 'accountNotFound', 1

    IF @person_reset_password_token <> @reset_password_token THROW 50401, 'invalidToken', 1


    -- update person
    UPDATE App.people SET password = @password WHERE id_person = @id_person

GO