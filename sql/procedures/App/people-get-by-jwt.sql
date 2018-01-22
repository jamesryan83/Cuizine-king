-- Get a person by jwt
CREATE PROCEDURE people_get_by_jwt
	@jwt NVARCHAR(512),
	@email NVARCHAR(256),
    @id_person_type TINYINT AS

    IF @jwt IS NULL OR LEN(@jwt) < 30 THROW 50400, 'Bad token', 1

    IF @id_person_type IS NULL SET @id_person_type = 1

	SET NOCOUNT ON

    DECLARE @jwt_person AS NVARCHAR(512)
    DECLARE @id_person AS INT

	SELECT @id_person = id_person, @jwt_person = jwt
    FROM App.people
	WHERE @email = email AND id_person_type = @id_person_type AND is_deleted = 0

    IF @id_person IS NULL THROW 50400, 'Account not found', 1

    IF @jwt <> @jwt_person THROW 50401, 'Invalid token', 1

    SELECT * FROM App.people
    WHERE id_person = @id_person AND id_person_type = @id_person_type AND is_deleted = 0
GO