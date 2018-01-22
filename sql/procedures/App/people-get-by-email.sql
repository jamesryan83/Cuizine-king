-- Get a person by email
CREATE PROCEDURE people_get_by_email
	@email NVARCHAR(256),
    @id_person_type TINYINT AS

    IF @id_person_type IS NULL SET @id_person_type = 1

    SELECT * FROM App.people
    WHERE email = @email AND id_person_type = @id_person_type AND is_deleted = 0
GO