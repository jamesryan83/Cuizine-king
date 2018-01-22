-- Create a web user
CREATE PROCEDURE people_create_web_user
	@first_name NVARCHAR(64),
    @last_name NVARCHAR(64),
    @email NVARCHAR(256),
	@password NVARCHAR(64),
    @jwt NVARCHAR(512),
    @verification_token NVARCHAR(64),
    @id_user_doing_update INT,
    @newPersonId INT OUTPUT AS

    SET NOCOUNT ON
    SET XACT_ABORT ON

    BEGIN TRANSACTION

        -- check if email already exists
        IF (SELECT TOP 1 email FROM App.people WHERE email = @email AND is_deleted = 0) IS NOT NULL
	       THROW 50409, 'Account already taken', 1


        -- Get the person type
        DECLARE @id_person_type INT
        SET @id_person_type = (SELECT id_person_type FROM App.person_types WHERE name = 'web user')
        IF @id_person_type IS NULL THROW 50400, 'Invalid person type', 1


        -- create a user
        INSERT INTO App.people
            (id_person_type, first_name, last_name, email, password, jwt, verification_token, updated_by)
            VALUES
            (@id_person_type, @first_name, @last_name, @email, @password, @jwt, @verification_token, @id_user_doing_update)


        -- output value
        SET @newPersonId = (SELECT CAST(current_value AS INT) FROM sys.sequences WHERE name = 'id_person')

    COMMIT
GO