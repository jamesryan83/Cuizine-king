-- GENERATED FILE




 -- Create Stored Procedures

-- Create a store user
CREATE OR ALTER PROCEDURE people_create_store_user
    @id_store INT,
	@first_name NVARCHAR(64),
    @last_name NVARCHAR(64),
    @email NVARCHAR(256),
	@password NVARCHAR(64),
    @verification_token NVARCHAR(64),
    @id_user_doing_update INT,
    @newPersonId INT OUTPUT AS

    SET NOCOUNT ON
    SET XACT_ABORT ON

    BEGIN TRANSACTION

        DECLARE @is_web_user BIT
        DECLARE @is_store_user BIT
        DECLARE @is_system_user BIT


        SELECT @is_store_user = is_store_user, @is_system_user = is_system_user FROM App.people
            WHERE id_person = @id_user_doing_update AND is_deleted = 0


        -- not a store or system user
        IF (@is_store_user = 0) THROW 50401, 'Not authorized', 1


        -- does the store exist
        IF (SELECT TOP 1 id_store FROM Store.stores WHERE id_store = @id_store AND is_deleted = 0) IS NULL
            THROW 50400, 'Store not found', 1


        -- if a store_user, check if user doing update is member of the store
        IF (@is_system_user = 0)
        BEGIN
            IF (SELECT TOP 1 id_person FROM Store.stores_people WHERE id_store = @id_store AND id_person = @id_user_doing_update) IS NULL
                THROW 50401, 'Not authorized', 1
        END


        -- check account isn't already taken
        IF (SELECT TOP 1 email FROM App.people WHERE email = @email AND is_deleted = 0) IS NOT NULL
            THROW 50409, 'Account already taken', 1


        -- create user
        INSERT INTO App.people
            (is_web_user, is_store_user, is_system_user, first_name, last_name, email, password, verification_token, updated_by)
            VALUES
            (1, 1, 0, @first_name, @last_name, @email, @password, @verification_token, @id_user_doing_update)


        -- output value
        SET @newPersonId = dbo.get_sequence_value('id_person')


        -- create link to store
        INSERT INTO Store.stores_people (id_store, id_person, updated_by) VALUES (@id_store, @newPersonId, @id_user_doing_update)

    COMMIT
GO


-- Create a system user
CREATE OR ALTER PROCEDURE people_create_system_user
    @email NVARCHAR(256),
	@password NVARCHAR(64),
    @verification_token NVARCHAR(64),
    @id_user_doing_update INT,
    @newPersonId INT OUTPUT AS

    SET NOCOUNT ON
    SET XACT_ABORT ON

    BEGIN TRANSACTION

        -- check if user doing update is a system user
        IF (SELECT TOP 1 id_person FROM App.people
            WHERE id_person = @id_user_doing_update AND is_system_user = 1 AND is_deleted = 0) IS NULL
            THROW 50401, 'Not authorized', 1

        -- check account isn't already taken
        IF (SELECT TOP 1 email FROM App.people WHERE email = @email AND is_deleted = 0) IS NOT NULL
            THROW 50409, 'Account already taken', 1

        -- create a user
        INSERT INTO App.people
            (is_web_user, is_store_user, is_system_user, first_name, last_name,
             verification_token, email, password, updated_by)
            VALUES
            (1, 1, 1, 'na', 'na',
             @verification_token, @email, @password, @id_user_doing_update)

        -- output value
        SET @newPersonId = dbo.get_sequence_value('id_person')

    COMMIT
GO


-- Create a web user
CREATE OR ALTER PROCEDURE people_create_web_user
	@first_name NVARCHAR(64),
    @last_name NVARCHAR(64),
    @email NVARCHAR(256),
	@password NVARCHAR(64),
    @verification_token NVARCHAR(64),
    @newPersonId INT OUTPUT AS

    SET NOCOUNT ON
    SET XACT_ABORT ON

    BEGIN TRANSACTION

        IF (SELECT TOP 1 email FROM App.people WHERE email = @email AND is_deleted = 0) IS NOT NULL
            THROW 50409, 'Account already taken', 1

        -- create a user
        INSERT INTO App.people
            (is_web_user, is_store_user, is_system_user, first_name, last_name, email, password, verification_token, updated_by)
            VALUES
            (1, 0, 0, @first_name, @last_name, @email, @password, @verification_token, 3)

        -- output value
        SET @newPersonId = dbo.get_sequence_value('id_person')

    COMMIT
GO


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


-- Get a person by id
CREATE OR ALTER PROCEDURE people_get_by_id
	@id INT AS

    SELECT * FROM App.people
    WHERE id_person = @id AND is_deleted = 0
GO


-- Get a person by jwt
CREATE OR ALTER PROCEDURE people_get_by_jwt
	@jwt NVARCHAR(512),
	@id_person INT AS

    IF @jwt IS NULL OR LEN(@jwt) < 30 THROW 50400, 'Bad token', 1

	SET NOCOUNT ON

    DECLARE @jwt_person AS NVARCHAR(512)

	SELECT @jwt_person = jwt
    FROM App.people
	WHERE id_person = @id_person AND is_deleted = 0

    IF @jwt <> @jwt_person THROW 50401, 'Invalid token', 1

    SELECT * FROM App.people
    WHERE id_person = @id_person
GO


-- Invalidate a jwt
CREATE OR ALTER PROCEDURE people_invalidate_jwt
	@jwt NVARCHAR(512) AS

    UPDATE App.people SET jwt = '' WHERE jwt = @jwt

    IF @@ROWCOUNT = 0 THROW 50400, 'Account not found', 1
GO


-- Update is verified
CREATE OR ALTER PROCEDURE people_update_is_verified
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
        WHERE email = @email AND is_deleted = 0

        IF @id_person IS NULL THROW 50400, 'Account not found', 1

        IF @is_verified = 1 THROW 50400, 'Account already verified', 1

        IF @verification_token <> @token THROW 50401, 'Invalid token', 1

        SET NOCOUNT OFF

        -- set person as verified
        UPDATE App.people SET is_verified = 1 WHERE id_person = @id_person

    COMMIT

GO


-- Update a persons jwt
CREATE OR ALTER PROCEDURE people_update_jwt
	@id_person INT,
    @jwt NVARCHAR(512) AS

    SET NOCOUNT ON

    IF (SELECT TOP 1 id_person FROM App.people
       WHERE id_person = @id_person AND is_deleted = 0) IS NULL
       THROW 50400, 'Account not found', 1

	UPDATE App.people SET jwt = @jwt
	WHERE id_person = @id_person

    SELECT id_person, is_web_user, is_store_user, is_system_user FROM App.people
    WHERE id_person = @id_person
GO


-- Update password
CREATE OR ALTER PROCEDURE people_update_password
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
CREATE OR ALTER PROCEDURE people_update_reset_password_token
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
CREATE OR ALTER PROCEDURE reviews_get
    @id_store INT AS

	SET NOCOUNT ON

    SELECT title, review, rating, created, updated
    FROM Store.reviews
    WHERE id_store = @id_store
GO


-- Create a store
-- creates an address, user and store
CREATE OR ALTER PROCEDURE store_applications_create
    @name NVARCHAR(128),
    @email NVARCHAR(256),
    @message NVARCHAR(256),
    @id_user_doing_update INT,
    @newStoreApplicationId INT OUTPUT AS

	SET NOCOUNT ON
    SET XACT_ABORT ON

    BEGIN TRANSACTION

        -- only system users can create store applications
        IF (SELECT TOP 1 id_person FROM App.people WHERE id_person = @id_user_doing_update AND is_system_user = 1 AND is_deleted = 0) IS NULL
            THROW 50401, 'Not authorized', 1


        -- create store application
        INSERT INTO Store.store_applications
            (name, email, message, updated_by)
            VALUES
            (@name, @email, @message, @id_user_doing_update)


        SET @newStoreApplicationId = dbo.get_sequence_value('id_store_application')
    COMMIT

GO


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


-- Soft deletes a store
CREATE OR ALTER PROCEDURE stores_delete
    @id_store INT,
    @id_user_doing_update INT AS

    SET NOCOUNT ON
    SET XACT_ABORT ON

    DECLARE @email NVARCHAR(255)

    BEGIN TRANSACTION

        -- only system users can delete stores
        IF (SELECT TOP 1 id_person FROM App.people WHERE id_person = @id_user_doing_update AND is_system_user = 1 AND is_deleted = 0) IS NULL
            THROW 50401, 'Not authorized', 1

        -- Get store email
        SELECT @email = email FROM Store.stores WHERE id_store = @id_store and is_deleted = 0

        IF @email IS NULL THROW 50400, 'Store not found', 1

        -- Set store deleted
        UPDATE Store.stores SET is_deleted = 1, is_deleted_email = @email, email = @id_store, updated_by = @id_user_doing_update
            WHERE id_store = @id_store

        -- TODO : delete users too
        -- Set user deleted
        -- UPDATE App.people SET is_deleted = 1, is_deleted_email = @email, email = @id_store, updated_by = @id_user_doing_update
            -- WHERE id_store = @id_store

    COMMIT
GO


-- Get a store
CREATE OR ALTER PROCEDURE stores_get
    @id_store INT AS

    SELECT id_store, name, description, phone_number, email,

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
         WHERE pe.id_store = @id_store AND pe.active = 1 FOR JSON PATH) AS 'product_extras',

         -- product headings
        (SELECT ph.id_product_heading, ph.title, ph.subtitle, ph.above_product_id
         FROM Product.product_headings ph
         WHERE ph.id_store = @id_store FOR JSON PATH) AS 'product_headings'

    FROM Store.stores AS s
    WHERE s.id_store = @id_store AND is_deleted = 0
    FOR JSON PATH, WITHOUT_ARRAY_WRAPPER

GO


-- Undeletes a deleted store
CREATE OR ALTER PROCEDURE stores_undelete
    @id_store INT,
    @id_user_doing_update INT AS

    SET NOCOUNT ON
    SET XACT_ABORT ON

    DECLARE @email NVARCHAR(256)

    BEGIN TRANSACTION

        -- Get store email
        SELECT @email = email FROM Store.stores WHERE id_store = @id_store and is_deleted = 0

        IF @email IS NULL THROW 50400, 'Store not found', 1

        -- Set store deleted
        UPDATE Store.stores SET is_deleted = 1, is_deleted_email = @email, email = @id_store, updated_by = @id_user_doing_update
            WHERE id_store = @id_store

        -- TODO : undelete users too
        -- Set user deleted
        -- UPDATE App.people SET is_deleted = 1, is_deleted_email = @email, email = @id_store, updated_by = @id_user_doing_update
            -- WHERE id_store = @id_store

    COMMIT
GO