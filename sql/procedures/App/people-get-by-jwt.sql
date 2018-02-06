-- Get a person by jwt
CREATE OR ALTER PROCEDURE people_get_by_jwt
	@jwt NVARCHAR(512),
	@id_person INT AS

    IF @jwt IS NULL OR LEN(@jwt) < 30 THROW 50400, 'Bad token', 1

	SET NOCOUNT ON

    DECLARE @jwt_person AS NVARCHAR(512)

	SELECT @jwt_person = jwt
    FROM App.people
	WHERE id_person = @id_person AND is_deleted = 0

    IF @jwt <> @jwt_person THROW 50401, 'Invalid token', 1

    SELECT * FROM App.people
    WHERE id_person = @id_person
GO