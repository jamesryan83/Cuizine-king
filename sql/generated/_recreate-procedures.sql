-- GENERATED FILE




 -- Drop Stored Procedures

DROP PROCEDURE IF EXISTS people_create
DROP PROCEDURE IF EXISTS people_get
DROP PROCEDURE IF EXISTS people_validate_email
DROP PROCEDURE IF EXISTS reviews_get
DROP PROCEDURE IF EXISTS stores_create
DROP PROCEDURE IF EXISTS stores_delete
DROP PROCEDURE IF EXISTS stores_get
GO


 -- Create Stored Procedures

-- Create a person (not for store users)
CREATE PROCEDURE people_create
    @postcode NVARCHAR(6),
    @suburb NVARCHAR(64),

    @address_line_1 NVARCHAR(128),
	@address_line_2 NVARCHAR(128),
	@address_latitude DECIMAL(9,4),
    @address_longitude DECIMAL(9,4),

	@first_name NVARCHAR(64),
    @last_name NVARCHAR(64),
    @email NVARCHAR(256),
    @phone_number NVARCHAR(32),
	@password NVARCHAR(64),
    @jwt NVARCHAR(512),
    @is_verified BIT = 0,
    @verification_token NVARCHAR(64),
    @is_system_user BIT = 0,
    @is_web_user BIT = 1,
    @internal_notes NVARCHAR(256),

    @id_user_doing_update INT AS

    DECLARE @id_postcode INT
    DECLARE @newAddressId INT
    DECLARE @newPersonId INT

    SET NOCOUNT ON
    SET XACT_ABORT ON

    BEGIN TRANSACTION

        IF @is_system_user = 1 AND @is_web_user = 1
            THROW 50400, 'Invalid is_system_user or is_web_user.  Both values cannot be 1', 1

        IF @is_system_user = 0 AND @is_web_user = 0
            THROW 50400, 'Invalid is_system_user or is_web_user.  Values missing', 1

        -- stores need their own account, check if email already exists
        IF (SELECT TOP 1 email FROM App.people WHERE email = @email) IS NOT NULL
	       THROW 50409, 'Account already taken', 1

        IF (SELECT TOP 1 email FROM Store.stores WHERE email = @email) IS NOT NULL
	       THROW 50409, 'Account already taken', 1


        -- Get postcode id
        IF @postcode IS NOT NULL AND @suburb IS NOT NULL
        BEGIN
            SELECT @id_postcode = id_postcode FROM App.postcodes
            WHERE postcode = @postcode AND suburb = @suburb

            IF @id_postcode IS NULL THROW 50400, 'Invalid postcode or suburb', 1
        END

        -- create person address if supplied
        IF @id_postcode IS NOT NULL AND @address_line_1 IS NOT NULL
        BEGIN
            INSERT INTO App.addresses
                (id_postcode, line1, line2, latitude, longitude, updated_by)
                VALUES
                (@id_postcode, @address_line_1, @address_line_2, @address_latitude, @address_longitude, @id_user_doing_update)

            SET @newAddressId = (SELECT CONVERT(INT, current_value) FROM sys.sequences WHERE name = 'id_address')
        END

        -- create a store user
        INSERT INTO App.people
            (id_address, first_name, last_name, email, phone_number, password,
            jwt, is_verified, is_web_user, is_store_user, internal_notes, updated_by)
            VALUES
            (@newAddressId, @first_name, @last_name, @email, @phone_number, @password,
             @jwt, 1, 0, 1, @internal_notes, @id_user_doing_update)

    COMMIT
GO


-- Get a person by id or email
CREATE PROCEDURE people_get
	@id INT = -1,
	@email NVARCHAR(255) = '' AS

	IF @id = -1 AND @email = '' THROW 50400, 'Must provide id or email', 1

	SET NOCOUNT ON

	SELECT * FROM App.people
	WHERE id_person = @id OR email = @email
GO


-- Validate a persons email
CREATE PROCEDURE people_validate_email
	@email NVARCHAR(256),
	@verification_token NVARCHAR(64) AS

    DECLARE @id_person AS INT
    DECLARE @token AS NVARCHAR(64)

    SET NOCOUNT ON
    SET XACT_ABORT ON

    BEGIN TRANSACTION

        -- find person id
        SELECT @id_person = id_person, @token = verification_token FROM App.people
        WHERE email = @email OR email = @email

        IF @id_person IS NULL THROW 50400, 'Account not found', 1
        IF @verification_token <> @token THROW 50401, 'Invalid verification token', 1

        -- set person as validated
        UPDATE App.people SET is_verified = 1 WHERE id_person = @id_person

    COMMIT

GO


-- Get reviews for a store
CREATE PROCEDURE reviews_get
    @id_store INT AS

	SET NOCOUNT ON

    SELECT title, review, rating, created, updated
    FROM Store.reviews
    WHERE id_store = @id_store
GO


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
    @bank_name NVARCHAR(128),
    @bank_bsb NVARCHAR(16),
    @bank_account_name NVARCHAR(128),
    @bank_account_number NVARCHAR(32),

    @hours_mon_dinein_open NVARCHAR(8),
    @hours_tue_dinein_open NVARCHAR(8),
    @hours_wed_dinein_open NVARCHAR(8),
    @hours_thu_dinein_open NVARCHAR(8),
    @hours_fri_dinein_open NVARCHAR(8),
    @hours_sat_dinein_open NVARCHAR(8),
    @hours_sun_dinein_open NVARCHAR(8),
    @hours_mon_dinein_close NVARCHAR(8),
    @hours_tue_dinein_close NVARCHAR(8),
    @hours_wed_dinein_close NVARCHAR(8),
    @hours_thu_dinein_close NVARCHAR(8),
    @hours_fri_dinein_close NVARCHAR(8),
    @hours_sat_dinein_close NVARCHAR(8),
    @hours_sun_dinein_close NVARCHAR(8),
    @hours_mon_delivery_open NVARCHAR(8),
    @hours_tue_delivery_open NVARCHAR(8),
    @hours_wed_delivery_open NVARCHAR(8),
    @hours_thu_delivery_open NVARCHAR(8),
    @hours_fri_delivery_open NVARCHAR(8),
    @hours_sat_delivery_open NVARCHAR(8),
    @hours_sun_delivery_open NVARCHAR(8),
    @hours_mon_delivery_close NVARCHAR(8),
    @hours_tue_delivery_close NVARCHAR(8),
    @hours_wed_delivery_close NVARCHAR(8),
    @hours_thu_delivery_close NVARCHAR(8),
    @hours_fri_delivery_close NVARCHAR(8),
    @hours_sat_delivery_close NVARCHAR(8),
    @hours_sun_delivery_close NVARCHAR(8),

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
             facebook, twitter, abn, bank_name, bank_bsb,
             bank_account_name, bank_account_number, internal_notes, updated_by)
            VALUES
            (@newAddressId, @logo, @name, @description, @email, @phone_number_store, @website,
             @facebook, @twitter, @abn, @bank_name, @bank_bsb,
             @bank_account_name, @bank_account_number, @internal_notes_store, @id_user_doing_update)

        SET @newStoreId = (SELECT CONVERT(INT, current_value) FROM sys.sequences WHERE name = 'id_store')


        -- Add the store id to the user that was created
        UPDATE App.people SET id_store = @newStoreId WHERE id_person = @newPersonId


        -- create store business hours
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 1, 1, @hours_mon_dinein_open, @hours_mon_dinein_close, @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 1, 2, @hours_tue_dinein_open, @hours_tue_dinein_close, @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 1, 3, @hours_wed_dinein_open, @hours_wed_dinein_close, @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 1, 4, @hours_thu_dinein_open, @hours_thu_dinein_close, @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 1, 5, @hours_fri_dinein_open, @hours_fri_dinein_close, @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 1, 6, @hours_sat_dinein_open, @hours_sat_dinein_close, @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 1, 7, @hours_sun_dinein_open, @hours_sun_dinein_close, @id_user_doing_update)

        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 0, 1, @hours_mon_delivery_open, @hours_mon_delivery_close, @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 0, 2, @hours_tue_delivery_open, @hours_tue_delivery_close, @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 0, 3, @hours_wed_delivery_open, @hours_wed_delivery_close, @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 0, 4, @hours_thu_delivery_open, @hours_thu_delivery_close, @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 0, 5, @hours_fri_delivery_open, @hours_fri_delivery_close, @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 0, 6, @hours_sat_delivery_open, @hours_sat_delivery_close, @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 0, 7, @hours_sun_delivery_open, @hours_sun_delivery_close, @id_user_doing_update)

    COMMIT

GO


-- Soft deletes a store
CREATE PROCEDURE stores_delete
    @id_store INT,
    @id_user_doing_update INT AS

    UPDATE Store.stores SET is_deleted = 1, updated_by = @id_user_doing_update
        WHERE id_store = @id_store
GO


-- Get a store
CREATE PROCEDURE stores_get
    @id_store INT AS

    SELECT id_store, name, description, phone_number, email, logo,

        -- addresses
        (SELECT a.id_address, a.line1, a.line2, a.latitude AS address_latitude, a.longitude AS address_longitude,
        pc.id_postcode, pc.postcode, pc.suburb, pc.state, pc.latitude AS postcode_latitude, pc.longitude AS postcode_longitude
        FROM App.addresses a
        JOIN App.postcodes pc ON pc.id_postcode = a.id_postcode
        WHERE a.id_address = s.id_address FOR JSON PATH) AS 'address',

        -- hours
        (SELECT bh.id_business_hour, bh.day, bh.dine_in_hours, bh.opens, bh.closes
        FROM Store.business_hours bh
        WHERE bh.id_store = @id_store FOR JSON PATH) AS 'hours',

        -- reviews
        (SELECT COUNT(*)
        FROM Store.reviews r
        WHERE r.id_store = @id_store) AS 'review_count',

        -- products and product options
        (SELECT pr.id_product, pr.name, pr.description, pr.store_notes, pr.delivery_available,
         pr.gluten_free, pr.vegetarian, pr.in_stock, pr.position_id_previous, pr.position_id_next,
             (SELECT po.id_product_option, po.id_product, po.name, po.store_notes, po.price, po.limit_per_customer,
              po.in_stock, po.position_id_previous, po.position_id_next
              FROM Product.product_options po
              WHERE po.id_product = pr.id_product FOR JSON PATH) AS 'options'
         FROM Product.products pr
         WHERE pr.id_store = @id_store AND pr.active = 1 FOR JSON PATH) AS 'products',

        -- product extras
        (SELECT pe.id_product_extra, pe.name, pe.price, pe.store_notes, pe.limit_per_product,
         pe.in_stock, pe.position_id_previous, pe.position_id_next
         FROM Product.product_extras pe
         WHERE pe.id_store = @id_store AND pe.active = 1 FOR JSON PATH) AS 'product_extras'

    FROM Store.stores AS s
    WHERE s.id_store = @id_store
    FOR JSON PATH

GO