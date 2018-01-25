-- GENERATED FILE




 -- Drop Stored Procedures

DROP PROCEDURE IF EXISTS people_create_web_user
DROP PROCEDURE IF EXISTS people_get_by_email
DROP PROCEDURE IF EXISTS people_get_by_id
DROP PROCEDURE IF EXISTS people_get_by_jwt
DROP PROCEDURE IF EXISTS people_invalidate_jwt
DROP PROCEDURE IF EXISTS people_update_is_verified
DROP PROCEDURE IF EXISTS people_update_jwt
DROP PROCEDURE IF EXISTS people_update_password
DROP PROCEDURE IF EXISTS people_update_reset_password_token
DROP PROCEDURE IF EXISTS reviews_get
DROP PROCEDURE IF EXISTS stores_create
DROP PROCEDURE IF EXISTS stores_delete
DROP PROCEDURE IF EXISTS stores_get
GO


 -- Create Stored Procedures

-- Create a web user
CREATE PROCEDURE people_create_web_user
	@first_name NVARCHAR(64),
    @last_name NVARCHAR(64),
    @email NVARCHAR(256),
	@password NVARCHAR(64),
    @jwt NVARCHAR(512),
    @verification_token NVARCHAR(64),
    @id_user_doing_update INT,
    @newPersonId INT OUTPUT AS

    SET NOCOUNT ON
    SET XACT_ABORT ON

    BEGIN TRANSACTION

        -- check if email already exists
        IF (SELECT TOP 1 email FROM App.people WHERE email = @email AND is_deleted = 0) IS NOT NULL
	       THROW 50409, 'Account already taken', 1


        -- Get the person type
        DECLARE @id_person_type INT
        SET @id_person_type = (SELECT id_person_type FROM App.person_types WHERE name = 'web user')
        IF @id_person_type IS NULL THROW 50400, 'Invalid person type', 1


        -- create a user
        INSERT INTO App.people
            (id_person_type, first_name, last_name, email, password, jwt, verification_token, updated_by)
            VALUES
            (@id_person_type, @first_name, @last_name, @email, @password, @jwt, @verification_token, @id_user_doing_update)


        -- output value
        SET @newPersonId = (SELECT CAST(current_value AS INT) FROM sys.sequences WHERE name = 'id_person')

    COMMIT
GO


-- Get a person by email
CREATE PROCEDURE people_get_by_email
	@email NVARCHAR(256),
    @id_person_type TINYINT AS

    IF @id_person_type IS NULL SET @id_person_type = 1

    SELECT * FROM App.people
    WHERE email = @email AND id_person_type = @id_person_type AND is_deleted = 0
GO


-- Get a person by id
CREATE PROCEDURE people_get_by_id
	@id INT,
    @id_person_type TINYINT AS

    IF @id_person_type IS NULL SET @id_person_type = 1

    SELECT * FROM App.people
    WHERE id_person = @id AND id_person_type = @id_person_type AND is_deleted = 0
GO


-- Get a person by jwt
CREATE PROCEDURE people_get_by_jwt
	@jwt NVARCHAR(512),
	@email NVARCHAR(256)AS

    IF @jwt IS NULL OR LEN(@jwt) < 30 THROW 50400, 'Bad token', 1

	SET NOCOUNT ON

    DECLARE @jwt_person AS NVARCHAR(512)
    DECLARE @id_person AS INT

	SELECT @id_person = id_person, @jwt_person = jwt
    FROM App.people
	WHERE @email = email AND is_deleted = 0

    IF @id_person IS NULL THROW 50400, 'Account not found', 1

    IF @jwt <> @jwt_person THROW 50401, 'Invalid token', 1

    SELECT * FROM App.people
    WHERE id_person = @id_person
GO


-- Invalidate a jwt
CREATE PROCEDURE people_invalidate_jwt
	@jwt NVARCHAR(512) AS

    UPDATE App.people SET jwt = '' WHERE jwt = @jwt

    IF @@ROWCOUNT = 0 THROW 50400, 'Account not found', 1
GO


-- Update is verified
CREATE PROCEDURE people_update_is_verified
	@email NVARCHAR(256),
	@verification_token NVARCHAR(64) AS

    DECLARE @id_person AS INT
    DECLARE @token AS NVARCHAR(64)
    DECLARE @is_verified AS BIT = 0

    SET NOCOUNT ON
    SET XACT_ABORT ON

    BEGIN TRANSACTION

        -- find person id
        SELECT @id_person = id_person, @token = verification_token, @is_verified = is_verified
        FROM App.people
        WHERE (email = @email OR email = @email) AND is_deleted = 0

        IF @id_person IS NULL THROW 50400, 'Account not found', 1

        IF @is_verified = 1 THROW 50400, 'Account already verified', 1

        IF @verification_token <> @token THROW 50401, 'Invalid token', 1

        SET NOCOUNT OFF

        -- set person as verified
        UPDATE App.people SET is_verified = 1 WHERE id_person = @id_person

    COMMIT

GO


-- Update a persons jwt
CREATE PROCEDURE people_update_jwt
	@email NVARCHAR(255),
    @jwt NVARCHAR(512) AS

    SET NOCOUNT ON

    DECLARE @id_person INT

    SELECT @id_person = id_person
    FROM App.people
	WHERE @email = email AND is_deleted = 0

    IF @id_person IS NULL THROW 50400, 'Account not found', 1

	UPDATE App.people SET jwt = @jwt
	WHERE id_person = @id_person

    SELECT id_person, id_store, id_person_type FROM App.people
    WHERE id_person = @id_person
GO


-- Update password
CREATE PROCEDURE people_update_password
	@email NVARCHAR(256),
	@reset_password_token NVARCHAR(64),
    @password NVARCHAR (64) AS

    IF @reset_password_token IS NULL OR LEN(@reset_password_token) < 64 THROW 50400, 'Bad token', 1

    DECLARE @person_reset_password_token AS NVARCHAR(64)
    DECLARE @id_person AS INT

    SELECT @id_person = id_person, @person_reset_password_token = reset_password_token
        FROM App.people WHERE email = @email AND is_deleted = 0

    IF @id_person IS NULL THROW 50400, 'Account not found', 1

    IF @person_reset_password_token <> @reset_password_token THROW 50401, 'Invalid token', 1

    UPDATE App.people SET password = @password WHERE id_person = @id_person
GO


-- Update reset password token
CREATE PROCEDURE people_update_reset_password_token
	@email NVARCHAR(512),
    @reset_password_token NVARCHAR(64) AS

    DECLARE @id_person AS INT
    DECLARE @is_verified AS BIT

    SELECT @id_person = id_person, @is_verified = is_verified
    FROM App.people
    WHERE email = @email AND is_deleted = 0

    IF @@ROWCOUNT = 0 THROW 50400, 'Account not found', 1

    IF @is_verified = 0 THROW 50400, 'Please verify your account', 1

    UPDATE App.people
    SET reset_password_token = @reset_password_token
    WHERE id_person = @id_person
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
        IF (SELECT TOP 1 email FROM App.people WHERE email = @email AND is_deleted = 0) IS NOT NULL
	       THROW 50409, 'Invalid Email. Account already exists', 1

        IF (SELECT TOP 1 email FROM Store.stores WHERE email = @email AND is_deleted = 0) IS NOT NULL
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


        -- Get the person type
        DECLARE @id_person_type INT
        SET @id_person_type = (SELECT id_person_type FROM App.person_types WHERE name = 'store user')
        IF @id_person_type IS NULL THROW 50400, 'Invalid person type', 1


        -- create a store user
        INSERT INTO App.people
            (id_person_type, id_address, first_name, last_name, email, phone_number, password,
            jwt, verification_token, is_verified, internal_notes, updated_by)
            VALUES
            (@id_person_type, null, @first_name, @last_name, @email, @phone_number_user, @password,
             @jwt, 'na', 1, @internal_notes_user, @id_user_doing_update)

        SET @newPersonId = (SELECT CONVERT(INT, current_value) FROM sys.sequences WHERE name = 'id_person')


        -- Create store
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

    -- Get store email
    DECLARE @email NVARCHAR(256)
    SELECT @email = email FROM Store.stores WHERE id_store = @id_store and is_deleted = 0
    IF @email IS NULL THROW 50400, 'Store not found', 1

    -- Set store deleted
    UPDATE Store.stores SET is_deleted = 1, is_deleted_email = @email, email = @id_store, updated_by = @id_user_doing_update
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
    WHERE s.id_store = @id_store AND is_deleted = 0
    FOR JSON PATH

GO