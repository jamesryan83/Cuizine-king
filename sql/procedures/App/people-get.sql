-- Get a person by id or email
CREATE PROCEDURE people_get
	@id INT = -1,
	@email NVARCHAR(255) = '' AS

	IF @id = -1 AND @email = '' THROW 50400, 'Must provide id or email', 1

	SET NOCOUNT ON

	SELECT * FROM App.people
	WHERE id_person = @id OR email = @email
GO