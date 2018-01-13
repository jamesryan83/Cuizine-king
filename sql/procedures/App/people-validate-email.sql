-- Validate a persons email
CREATE PROCEDURE people_validate_email
	@email NVARCHAR(256),
	@verification_token NVARCHAR(64) AS

    DECLARE @id_person AS INT
    DECLARE @token AS NVARCHAR(64)

    SET NOCOUNT ON
    SET XACT_ABORT ON

    BEGIN TRANSACTION

        -- find person id
        SELECT @id_person = id_person, @token = verification_token FROM App.people
        WHERE email = @email OR email = @email

        IF @id_person IS NULL THROW 50400, 'Account not found', 1
        IF @verification_token <> @token THROW 50401, 'Invalid verification token', 1

        -- set person as validated
        UPDATE App.people SET is_verified = 1 WHERE id_person = @id_person

    COMMIT

GO