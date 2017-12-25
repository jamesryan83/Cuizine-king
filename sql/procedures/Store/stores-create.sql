-- Create a store
-- creates an address, user and store
CREATE PROCEDURE stores_create
    @postcode NVARCHAR(6),
    @suburb NVARCHAR(64),

    @address_line_1 NVARCHAR(128),
	@address_line_2 NVARCHAR(128),
	@address_latitude DECIMAL(9,4),
    @address_longitude DECIMAL(9,4),

    @first_name NVARCHAR(64),
    @last_name NVARCHAR(64),
    @email NVARCHAR(256),
    @phone_number_user NVARCHAR(32),
	@password NVARCHAR(64),
    @jwt NVARCHAR(512),
    @internal_notes_user NVARCHAR(256),

    @logo NVARCHAR(255),
    @name NVARCHAR(128),
    @description NVARCHAR(1024),
	@phone_number_store NVARCHAR(32),
    @website NVARCHAR(256),
    @facebook NVARCHAR(256),
    @twitter NVARCHAR(256),
    @abn NVARCHAR(16),
    @internal_notes_store NVARCHAR(256),

    @id_user_doing_update INT AS

	SET NOCOUNT ON
    SET XACT_ABORT ON

    DECLARE @id_postcode INT
    DECLARE @newAddressId INT
    DECLARE @newPersonId INT
    DECLARE @newStoreId INT


    BEGIN TRANSACTION

        -- stores need their own account, check if email already exists
        IF (SELECT TOP 1 email FROM App.people WHERE email = @email) IS NOT NULL
	       THROW 50409, 'Invalid Email. Account already exists', 1

        IF (SELECT TOP 1 email FROM Store.stores WHERE email = @email) IS NOT NULL
	       THROW 50409, 'Invalid Email. Store Account already exists', 1


        -- Get postcode id
        SELECT @id_postcode = id_postcode FROM App.postcodes
        WHERE postcode = @postcode AND suburb = @suburb

        IF @id_postcode IS NULL THROW 50400, 'Invalid postcode or suburb', 1


        -- create store address
        INSERT INTO App.addresses
            (id_postcode, line1, line2, latitude, longitude, updated_by)
            VALUES
            (@id_postcode, @address_line_1, @address_line_2, @address_latitude, @address_longitude, @id_user_doing_update)

        SET @newAddressId = (SELECT CONVERT(INT, current_value) FROM sys.sequences WHERE name = 'id_address')


        -- create a store user
        INSERT INTO App.people
            (id_address, first_name, last_name, email, phone_number, password,
            jwt, is_verified, is_web_user, is_store_user, internal_notes, updated_by)
            VALUES
            (null, @first_name, @last_name, @email, @phone_number_user, @password,
             @jwt, 1, 0, 1, @internal_notes_user, @id_user_doing_update)

        SET @newPersonId = (SELECT CONVERT(INT, current_value) FROM sys.sequences WHERE name = 'id_person')


        -- create store
        INSERT INTO Store.stores
            (id_address, logo, name, description, email, phone_number, website,
            facebook, twitter, abn, internal_notes, updated_by)
            VALUES
            (@newAddressId, @logo, @name, @description, @email, @phone_number_store, @website,
            @facebook, @twitter, @abn, @internal_notes_store, @id_user_doing_update)

        SET @newStoreId = (SELECT CONVERT(INT, current_value) FROM sys.sequences WHERE name = 'id_store')


        -- Add the store id to the user that was created
        UPDATE App.people SET id_store = @newStoreId WHERE id_person = @newPersonId

    COMMIT

GO