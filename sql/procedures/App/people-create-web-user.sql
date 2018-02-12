-- Create a web user
CREATE OR ALTER PROCEDURE people_create_web_user
	@first_name NVARCHAR(64),
    @last_name NVARCHAR(64),
    @email NVARCHAR(256),
	@password NVARCHAR(64),
    @verification_token NVARCHAR(64),
    @newPersonId INT OUTPUT AS

    SET NOCOUNT ON
    SET XACT_ABORT ON

    BEGIN TRANSACTION

        -- check if user exists
        IF (SELECT TOP 1 email FROM App.people WHERE email = @email AND is_deleted = 0) IS NOT NULL
            THROW 50409, 'Account already taken', 1


        -- create a user
        INSERT INTO App.people
            (is_web_user, is_store_user, is_system_user, first_name, last_name, email, password, verification_token, updated_by)
            VALUES
            (1, 0, 0, @first_name, @last_name, @email, @password, @verification_token, @const_system_admin_user)


        -- output value
        SET @newPersonId = dbo.get_sequence_value('id_person')

    COMMIT
GO