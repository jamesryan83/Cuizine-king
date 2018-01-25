-- Get a person by jwt
CREATE PROCEDURE people_get_by_jwt
	@jwt NVARCHAR(512),
	@email NVARCHAR(256)AS

    IF @jwt IS NULL OR LEN(@jwt) < 30 THROW 50400, 'Bad token', 1

	SET NOCOUNT ON

    DECLARE @jwt_person AS NVARCHAR(512)
    DECLARE @id_person AS INT

	SELECT @id_person = id_person, @jwt_person = jwt
    FROM App.people
	WHERE @email = email AND is_deleted = 0

    IF @id_person IS NULL THROW 50400, 'Account not found', 1

    IF @jwt <> @jwt_person THROW 50401, 'Invalid token', 1

    SELECT * FROM App.people
    WHERE id_person = @id_person
GO