-- Get a person by id
CREATE PROCEDURE people_get_by_id
	@id INT,
    @id_person_type TINYINT AS

    IF @id_person_type IS NULL SET @id_person_type = 1

    SELECT * FROM App.people
    WHERE id_person = @id AND id_person_type = @id_person_type AND is_deleted = 0
GO