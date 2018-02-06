-- Create a store
-- creates an address, user and store
CREATE OR ALTER PROCEDURE stores_create
    @postcode NVARCHAR(6),
    @suburb NVARCHAR(64),

    @address_line_1 NVARCHAR(128),
	@address_line_2 NVARCHAR(128),

    @first_name NVARCHAR(64),
    @last_name NVARCHAR(64),
    @phone_number_user NVARCHAR(32),
    @email_user NVARCHAR(256),
	@password NVARCHAR(64),
    @verification_token NVARCHAR(64),

    @name NVARCHAR(128),
    @abn NVARCHAR(16),
    @internal_notes_store NVARCHAR(256),

    @id_user_doing_update INT,
    @newStoreId INT OUTPUT,
    @newPersonId INT OUTPUT AS

	SET NOCOUNT ON
    SET XACT_ABORT ON

    DECLARE @id_postcode INT
    DECLARE @newAddressId INT


    BEGIN TRANSACTION

        -- only system users can create stores
        IF (SELECT TOP 1 id_person FROM App.people WHERE id_person = @id_user_doing_update AND is_system_user = 1 AND is_deleted = 0) IS NULL
            THROW 50401, 'Not authorized', 1


        -- stores need an initial user account, check if email already exists
        IF (SELECT TOP 1 email FROM App.people WHERE email = @email_user AND is_deleted = 0) IS NOT NULL
            THROW 50409, 'Account already taken', 1


        -- Get postcode id
        SELECT @id_postcode = id_postcode FROM App.postcodes
        WHERE postcode = @postcode AND suburb = @suburb

        IF @id_postcode IS NULL THROW 50400, 'Invalid postcode or suburb', 1


        -- create store address
        INSERT INTO App.addresses
            (id_postcode, line1, line2, updated_by)
            VALUES
            (@id_postcode, @address_line_1, @address_line_2, @id_user_doing_update)

        SET @newAddressId = dbo.get_sequence_value('id_address')


        -- create a store user
        INSERT INTO App.people
            (is_web_user, is_store_user, is_system_user, id_address, first_name, last_name,
             email, phone_number, password, verification_token, updated_by)
            VALUES
            (1, 1, 0, null, @first_name, @last_name,
             @email_user, @phone_number_user, @password, @verification_token, @id_user_doing_update)

        SET @newPersonId = dbo.get_sequence_value('id_person')


        -- Create store
        INSERT INTO Store.stores
            (id_address, name, email, abn, internal_notes, updated_by)
            VALUES
            (@newAddressId, @name, @email_user, @abn, @internal_notes_store, @id_user_doing_update)

        SET @newStoreId = dbo.get_sequence_value('id_store')


        -- Link new user to new store
        INSERT INTO Store.stores_people (id_store, id_person, updated_by) VALUES (@newStoreID, @newPersonId, @id_user_doing_update)


        -- create default store business hours
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 1, 1, '10:00', '22:00', @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 1, 2, '10:00', '22:00', @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 1, 3, '10:00', '22:00', @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 1, 4, '10:00', '22:00', @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 1, 5, '10:00', '22:00', @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 1, 6, '10:00', '22:00', @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 1, 7, '10:00', '22:00', @id_user_doing_update)

        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 0, 1, '10:00', '22:00', @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 0, 2, '10:00', '22:00', @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 0, 3, '10:00', '22:00', @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 0, 4, '10:00', '22:00', @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 0, 5, '10:00', '22:00', @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 0, 6, '10:00', '22:00', @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 0, 7, '10:00', '22:00', @id_user_doing_update)

    COMMIT

GO