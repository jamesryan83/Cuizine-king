-- Create a system user
CREATE OR ALTER PROCEDURE people_create_system_user
    @email NVARCHAR(256),
	@password NVARCHAR(64),
    @verification_token NVARCHAR(64),
    @id_user_doing_update INT,
    @newPersonId INT OUTPUT AS

    SET NOCOUNT ON
    SET XACT_ABORT ON

    BEGIN TRANSACTION

        -- check if user doing update is a system user
        IF (SELECT TOP 1 id_person FROM App.people
            WHERE id_person = @id_user_doing_update AND is_system_user = 1 AND is_deleted = 0) IS NULL
            THROW 50401, 'notAuthorized', 1


        -- check account isn't already taken
        IF (SELECT TOP 1 email FROM App.people WHERE email = @email AND is_deleted = 0) IS NOT NULL
            THROW 50409, 'accountAlreadyTaken', 1


        -- create a user
        INSERT INTO App.people
            (is_web_user, is_store_user, is_system_user, first_name, last_name,
             verification_token, email, password, updated_by)
            VALUES
            (1, 1, 1, 'na', 'na',
             @verification_token, @email, @password, @id_user_doing_update)


        -- output value
        SET @newPersonId = dbo.get_sequence_value('id_person')

    COMMIT
GO