-- Get a person by id
CREATE OR ALTER PROCEDURE people_get_by_id
	@id INT AS

    SELECT * FROM App.people
    WHERE id_person = @id AND is_deleted = 0
GO