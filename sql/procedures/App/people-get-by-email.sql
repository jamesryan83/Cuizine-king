-- Get a person by email
CREATE OR ALTER PROCEDURE people_get_by_email
	@email NVARCHAR(256),
    @alsoGetStoreId BIT = 0 AS

    IF @alsoGetStoreId = 1
        SELECT App.people.*, Store.stores_people.id_store FROM App.people
        JOIN Store.stores_people ON App.people.id_person = Store.stores_people.id_person
        WHERE App.people.email = @email AND App.people.is_deleted = 0
    ELSE
        SELECT * FROM App.people
        WHERE email = @email AND is_deleted = 0
GO