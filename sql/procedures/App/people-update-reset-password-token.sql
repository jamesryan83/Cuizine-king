-- Update reset password token
CREATE OR ALTER PROCEDURE people_update_reset_password_token
	@email NVARCHAR(512),
    @reset_password_token NVARCHAR(64) AS

    DECLARE @id_person AS INT
    DECLARE @is_verified AS BIT

    SET NOCOUNT ON
    SET XACT_ABORT ON

    BEGIN TRANSACTION

        -- check person data
        SELECT @id_person = id_person, @is_verified = is_verified
        FROM App.people
        WHERE email = @email AND is_deleted = 0

        IF @id_person IS NULL THROW 50400, 'accountNotFound', 1

        IF @is_verified = 0 THROW 50400, 'pleaseVerifyAccount', 1


        -- update token
        UPDATE App.people
        SET reset_password_token = @reset_password_token
        WHERE id_person = @id_person

    COMMIT
GO