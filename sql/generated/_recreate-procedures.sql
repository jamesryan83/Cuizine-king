-- GENERATED FILE




 -- Create Stored Procedures

-- Create an address
CREATE OR ALTER PROCEDURE addresses_create_or_update
    @id_address INT,
    @postcode NVARCHAR(6),
    @suburb NVARCHAR(64),
    @street_address NVARCHAR(256),
    @id_user_doing_update INT,
    @newAddressId INT OUTPUT AS

    SET NOCOUNT ON
    SET XACT_ABORT ON

    BEGIN TRANSACTION

        DECLARE @id_postcode INT

        -- Get postcode id
        SELECT TOP 1 @id_postcode = id_postcode FROM App.postcodes
        WHERE postcode = @postcode AND suburb = @suburb

        IF @id_postcode IS NULL THROW 50400, 'Invalid postcode or suburb', 1


        -- Create address
        IF @id_address IS NULL
            BEGIN
                INSERT INTO App.addresses
                    (id_postcode, street_address, updated_by)
                    VALUES
                    (@id_postcode, @street_address, @id_user_doing_update)

                SET @newAddressId = dbo.get_sequence_value('id_address')
            END

        -- Update address
        ELSE
            BEGIN
                SET NOCOUNT OFF

                UPDATE App.addresses
                SET id_postcode = @id_postcode, street_address = @street_address, updated_by = @id_user_doing_update
                WHERE id_address = @id_address

                SET @newAddressId = @id_address
            END

    COMMIT
GO


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


        -- get user type
        SELECT TOP 1 @is_store_user = is_store_user, @is_system_user = is_system_user
        FROM App.people
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
        INSERT INTO Store.stores_people (id_store, id_person, is_store_owner, updated_by)
            VALUES (@id_store, @newPersonId, 0, @id_user_doing_update)

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

        -- check if user exists
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


-- Delete a person
CREATE OR ALTER PROCEDURE people_delete
    @id_person INT,
    @jwt NVARCHAR(512) AS

    SET NOCOUNT ON
    SET XACT_ABORT ON

    BEGIN TRANSACTION

        DECLARE @is_store_user BIT
        DECLARE @is_system_user BIT
        DECLARE @is_store_owner BIT
        DECLARE @email NVARCHAR(256)
        DECLARE @jwt_person NVARCHAR(512)


        -- some test accounts can't be deleted
        IF (@id_person <= 3) THROW 50400, 'Protected account', 1


        -- get user type and jwt
        SELECT @email = email, @jwt_person = jwt, @is_store_user = is_store_user, @is_system_user = is_system_user
        FROM App.people
        WHERE id_person = @id_person AND is_deleted = 0


        -- no user found
        IF @email IS NULL THROW 50400, 'Account not found', 1


        -- check jwt
        -- If a jwt is null the user has never logged in, ok to delete account
        IF @jwt_person IS NOT NULL AND @jwt <> @jwt_person THROW 50401, 'Invalid token', 1


        IF (@is_store_user = 1)
            BEGIN
                -- store owners have to be deleted using the admin program
                IF (SELECT is_store_owner FROM Store.stores_people WHERE id_person = @id_person) = 1
                    THROW 50401, 'Store owners need to contact support to have their account deleted', 1

                -- delete store users link to store
                DELETE FROM Store.stores_people WHERE id_person = @id_person
            END


        -- delete user
        UPDATE App.people
        SET email = @id_person, is_deleted = 1, is_deleted_email = @email, updated_by = @id_person
        WHERE id_person = @id_person

    COMMIT
GO


-- Get a person by email
CREATE OR ALTER PROCEDURE people_get_by_email
	@email NVARCHAR(256) AS

    DECLARE @id_person INT
    DECLARE @is_store_user BIT
    DECLARE @is_system_user BIT

    SET NOCOUNT ON


    -- get user type
    SELECT @id_person = id_person, @is_store_user = is_store_user, @is_system_user = is_system_user FROM App.people
    WHERE email = @email AND is_deleted = 0


    -- no user found
    IF (@id_person IS NULL) THROW 50400, 'Account not found', 1


    -- return user
    IF @is_store_user = 1 AND @is_system_user = 0
        -- get store user
        SELECT App.people.*, Store.stores_people.id_store, Store.stores_people.is_store_owner FROM App.people
        JOIN Store.stores_people
        ON App.people.id_person = Store.stores_people.id_person
        WHERE App.people.id_person = @id_person
    ELSE
        -- get website or system user
        SELECT * FROM App.people
        WHERE id_person = @id_person

GO


-- Get a person by id
CREATE OR ALTER PROCEDURE people_get_by_id
	@id_person INT AS

    DECLARE @email NVARCHAR(256)
    DECLARE @is_store_user BIT
    DECLARE @is_system_user BIT

    SET NOCOUNT ON


    -- get user type and jwt
    SELECT @email = email, @is_store_user = is_store_user, @is_system_user = is_system_user
    FROM App.people
    WHERE id_person = @id_person AND is_deleted = 0


    -- no user found
    IF @email IS NULL THROW 50400, 'Account not found', 1


    -- return user
    IF @is_store_user = 1 AND @is_system_user = 0
        -- get store user
        SELECT App.people.*, Store.stores_people.id_store, Store.stores_people.is_store_owner FROM App.people
        JOIN Store.stores_people
        ON App.people.id_person = Store.stores_people.id_person
        WHERE App.people.id_person = @id_person
    ELSE
        -- get website or system user
        SELECT * FROM App.people
        WHERE id_person = @id_person

GO


-- Get a person by jwt
CREATE OR ALTER PROCEDURE people_get_by_jwt
	@jwt NVARCHAR(512),
	@id_person INT AS


    DECLARE @email NVARCHAR(256)
    DECLARE @is_store_user BIT
    DECLARE @is_system_user BIT
    DECLARE @jwt_person AS NVARCHAR(512)

    SET NOCOUNT ON


    -- check for bad token
    IF @jwt IS NULL OR LEN(@jwt) < 30 THROW 50400, 'Bad token', 1


    -- get user type and jwt
    SELECT @email = email, @jwt_person = jwt, @is_store_user = is_store_user, @is_system_user = is_system_user
    FROM App.people
    WHERE id_person = @id_person AND is_deleted = 0


    -- no user found
    IF @email IS NULL THROW 50400, 'Account not found', 1


    -- check jwt
    IF @jwt <> @jwt_person THROW 50401, 'Invalid token', 1


    -- return user
    IF @is_store_user = 1 AND @is_system_user = 0
        -- get store user
        SELECT App.people.*, Store.stores_people.id_store, Store.stores_people.is_store_owner FROM App.people
        JOIN Store.stores_people
        ON App.people.id_person = Store.stores_people.id_person
        WHERE App.people.id_person = @id_person
    ELSE
        -- get website or system user
        SELECT * FROM App.people
        WHERE id_person = @id_person

GO


-- Invalidate a jwt
CREATE OR ALTER PROCEDURE people_invalidate_jwt
	@jwt NVARCHAR(512) AS

    -- set jwt
    UPDATE App.people SET jwt = '' WHERE jwt = @jwt

    -- error if no rows were changed
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


    -- error if account not found
    IF (SELECT TOP 1 id_person FROM App.people
       WHERE id_person = @id_person AND is_deleted = 0) IS NULL
       THROW 50400, 'Account not found', 1


    -- update person jwt
	UPDATE App.people SET jwt = @jwt
	WHERE id_person = @id_person


    -- return person
    SELECT id_person, is_web_user, is_store_user, is_system_user FROM App.people
    WHERE id_person = @id_person

GO


-- Update password
CREATE OR ALTER PROCEDURE people_update_password
	@email NVARCHAR(256),
	@reset_password_token NVARCHAR(64),
    @password NVARCHAR (64) AS


    -- check for bad token
    IF @reset_password_token IS NULL OR LEN(@reset_password_token) < 64 THROW 50400, 'Bad token', 1


    -- check person data
    DECLARE @person_reset_password_token AS NVARCHAR(64)
    DECLARE @id_person AS INT

    SELECT @id_person = id_person, @person_reset_password_token = reset_password_token
        FROM App.people WHERE email = @email AND is_deleted = 0

    IF @id_person IS NULL THROW 50400, 'Account not found', 1

    IF @person_reset_password_token <> @reset_password_token THROW 50401, 'Invalid token', 1


    -- update person
    UPDATE App.people SET password = @password WHERE id_person = @id_person

GO


-- Update reset password token
CREATE OR ALTER PROCEDURE people_update_reset_password_token
	@email NVARCHAR(512),
    @reset_password_token NVARCHAR(64) AS

    DECLARE @id_person AS INT
    DECLARE @is_verified AS BIT

    SET NOCOUNT ON
    SET XACT_ABORT ON

    BEGIN TRANSACTION

        -- check person data
        SELECT @id_person = id_person, @is_verified = is_verified
        FROM App.people
        WHERE email = @email AND is_deleted = 0

        -- IF @@ROWCOUNT = 0 THROW 50400, 'Account not found', 1
        IF @id_person IS NULL THROW 50400, 'Account not found', 1

        IF @is_verified = 0 THROW 50400, 'Please verify your account', 1


        -- update token
        UPDATE App.people
        SET reset_password_token = @reset_password_token
        WHERE id_person = @id_person

    COMMIT
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

        -- create store application
        INSERT INTO Store.store_applications
            (name, email, message, updated_by)
            VALUES
            (@name, @email, @message, @id_user_doing_update)


        -- output new store application id
        SET @newStoreApplicationId = dbo.get_sequence_value('id_store_application')
    COMMIT

GO


-- Create a store
-- creates an address, user and store
CREATE OR ALTER PROCEDURE stores_create
    @postcode NVARCHAR(6),
    @suburb NVARCHAR(64),
    @street_address NVARCHAR(256),

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


        -- Create address
        EXEC addresses_create_or_update NULL, @postcode, @suburb, @street_address, @id_user_doing_update, @newAddressId OUTPUT


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
        INSERT INTO Store.stores_people (id_store, id_person, is_store_owner, updated_by)
            VALUES (@newStoreID, @newPersonId, 1, @id_user_doing_update)


        -- create default store business hours
        INSERT INTO Store.business_hours (id_store, updated_by) VALUES (@newStoreId, @id_user_doing_update)

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

        -- TODO : delete users and addresses and other stuff too
        -- Set user deleted
        -- UPDATE App.people SET is_deleted = 1, is_deleted_email = @email, email = @id_store, updated_by = @id_user_doing_update
            -- WHERE id_store = @id_store

    COMMIT
GO


-- Update store details
CREATE OR ALTER PROCEDURE stores_details_update
    @id_store INT,
    @description NVARCHAR(1024),
    @email NVARCHAR(256),
    @phone_number NVARCHAR(32),
    @street_address NVARCHAR(256),
    @postcode NVARCHAR(6),
    @suburb NVARCHAR(64),
    @hours_mon_dinein_open NVARCHAR(5),
    @hours_tue_dinein_open NVARCHAR(5),
    @hours_wed_dinein_open NVARCHAR(5),
    @hours_thu_dinein_open NVARCHAR(5),
    @hours_fri_dinein_open NVARCHAR(5),
    @hours_sat_dinein_open NVARCHAR(5),
    @hours_sun_dinein_open NVARCHAR(5),
    @hours_mon_dinein_close NVARCHAR(5),
    @hours_tue_dinein_close NVARCHAR(5),
    @hours_wed_dinein_close NVARCHAR(5),
    @hours_thu_dinein_close NVARCHAR(5),
    @hours_fri_dinein_close NVARCHAR(5),
    @hours_sat_dinein_close NVARCHAR(5),
    @hours_sun_dinein_close NVARCHAR(5),
    @hours_mon_delivery_open NVARCHAR(5),
    @hours_tue_delivery_open NVARCHAR(5),
    @hours_wed_delivery_open NVARCHAR(5),
    @hours_thu_delivery_open NVARCHAR(5),
    @hours_fri_delivery_open NVARCHAR(5),
    @hours_sat_delivery_open NVARCHAR(5),
    @hours_sun_delivery_open NVARCHAR(5),
    @hours_mon_delivery_close NVARCHAR(5),
    @hours_tue_delivery_close NVARCHAR(5),
    @hours_wed_delivery_close NVARCHAR(5),
    @hours_thu_delivery_close NVARCHAR(5),
    @hours_fri_delivery_close NVARCHAR(5),
    @hours_sat_delivery_close NVARCHAR(5),
    @hours_sun_delivery_close NVARCHAR(5),
    @id_user_doing_update INT AS

    SET NOCOUNT ON
    SET XACT_ABORT ON

    DECLARE @id_store_temp INT
    DECLARE @id_address INT
    DECLARE @is_store_owner BIT

    BEGIN TRANSACTION

        -- Check if store exists
        SELECT TOP 1 @id_store_temp = id_store, @id_address = id_address
        FROM Store.stores WHERE id_store = @id_store and is_deleted = 0

        IF @id_store_temp IS NULL THROW 50400, 'Store not found', 1


        -- Check if a member of the store
        IF (SELECT TOP 1 id_person FROM Store.stores_people
            WHERE id_store = @id_store AND id_person = @id_user_doing_update) IS NULL
            THROW 50401, 'Not authorized', 1


        -- only store and system users can update stores
        IF (SELECT TOP 1 id_person FROM App.people WHERE id_person = @id_user_doing_update AND is_store_user = 1 AND is_deleted = 0) IS NULL
            THROW 50401, 'Not authorized', 1


        -- Create address
        EXEC addresses_create_or_update @id_address, @postcode, @suburb, @street_address, @id_user_doing_update, @id_address OUTPUT


        -- Update store
        UPDATE Store.stores SET description = @description, phone_number = @phone_number, email = @email, updated_by = @id_user_doing_update
            WHERE id_store = @id_store


        -- Update business hours
        UPDATE Store.business_hours SET
            hours_mon_dinein_open = @hours_mon_dinein_open,
            hours_tue_dinein_open = @hours_tue_dinein_open,
            hours_wed_dinein_open = @hours_wed_dinein_open,
            hours_thu_dinein_open = @hours_thu_dinein_open,
            hours_fri_dinein_open = @hours_fri_dinein_open,
            hours_sat_dinein_open = @hours_sat_dinein_open,
            hours_sun_dinein_open = @hours_sun_dinein_open,
            hours_mon_dinein_close = @hours_mon_dinein_close,
            hours_tue_dinein_close = @hours_tue_dinein_close,
            hours_wed_dinein_close = @hours_wed_dinein_close,
            hours_thu_dinein_close = @hours_thu_dinein_close,
            hours_fri_dinein_close = @hours_fri_dinein_close,
            hours_sat_dinein_close = @hours_sat_dinein_close,
            hours_sun_dinein_close = @hours_sun_dinein_close,
            hours_mon_delivery_open = @hours_mon_delivery_open,
            hours_tue_delivery_open = @hours_tue_delivery_open,
            hours_wed_delivery_open = @hours_wed_delivery_open,
            hours_thu_delivery_open = @hours_thu_delivery_open,
            hours_fri_delivery_open = @hours_fri_delivery_open,
            hours_sat_delivery_open = @hours_sat_delivery_open,
            hours_sun_delivery_open = @hours_sun_delivery_open,
            hours_mon_delivery_close = @hours_mon_delivery_close,
            hours_tue_delivery_close = @hours_tue_delivery_close,
            hours_wed_delivery_close = @hours_wed_delivery_close,
            hours_thu_delivery_close = @hours_thu_delivery_close,
            hours_fri_delivery_close = @hours_fri_delivery_close,
            hours_sat_delivery_close = @hours_sat_delivery_close,
            hours_sun_delivery_close = @hours_sun_delivery_close,
            updated_by = @id_user_doing_update
            WHERE id_store = @id_store

    COMMIT
GO


-- Get a store
CREATE OR ALTER PROCEDURE stores_get
    @id_store INT AS

    -- Check if store exists
    IF (SELECT TOP 1 id_store FROM Store.stores WHERE id_store = @id_store and is_deleted = 0) IS NULL
        THROW 50400, 'Store not found', 1


    SELECT id_store, name, description, phone_number, email,

        -- addresses
        (SELECT a.id_address, a.street_address, a.latitude AS address_latitude, a.longitude AS address_longitude,
        pc.id_postcode, pc.postcode, pc.suburb, pc.state, pc.latitude AS postcode_latitude, pc.longitude AS postcode_longitude
        FROM App.addresses a
        JOIN App.postcodes pc ON pc.id_postcode = a.id_postcode
        WHERE a.id_address = s.id_address FOR JSON PATH) AS 'address',

        -- hours
        (SELECT * FROM Store.business_hours bh
        WHERE bh.id_store = @id_store FOR JSON PATH) AS 'hours',

        -- reviews
        (SELECT COUNT(*)
        FROM Store.reviews r
        WHERE r.id_store = @id_store) AS 'review_count',

        -- products and product options
        (SELECT pr.id_product, pr.name, pr.description, pr.store_notes, pr.delivery_available,
         pr.gluten_free, pr.vegetarian, pr.position_id_previous, pr.position_id_next,

             (SELECT po.id_product_option, po.id_product, po.name, po.store_notes, po.price,
              po.limit_per_customer, po.position_id_previous, po.position_id_next
              FROM Product.product_options po
              WHERE po.id_product = pr.id_product FOR JSON PATH) AS 'options'
         FROM Product.products pr
         WHERE pr.id_store = @id_store AND pr.active = 1 FOR JSON PATH) AS 'products',

        -- product extras
        (SELECT pe.id_product_extra, pe.name, pe.price, pe.store_notes,
         pe.limit_per_product, pe.position_id_previous, pe.position_id_next
         FROM Product.product_extras pe
         WHERE pe.id_store = @id_store AND pe.active = 1 FOR JSON PATH) AS 'product_extras',

         -- product headings
        (SELECT ph.id_product_heading, ph.title, ph.subtitle, ph.above_product_id
         FROM Product.product_headings ph
         WHERE ph.id_store = @id_store FOR JSON PATH) AS 'product_headings'

    -- store
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

        -- Check if store exists
        IF (SELECT TOP 1 id_store FROM Store.stores WHERE id_store = @id_store and is_deleted = 0) IS NULL
            THROW 50400, 'Store not found', 1


        -- Set store deleted
        UPDATE Store.stores SET is_deleted = 1, is_deleted_email = @email, email = @id_store, updated_by = @id_user_doing_update
            WHERE id_store = @id_store


        -- TODO : undelete users too
        -- Set user deleted
        -- UPDATE App.people SET is_deleted = 1, is_deleted_email = @email, email = @id_store, updated_by = @id_user_doing_update
            -- WHERE id_store = @id_store

    COMMIT
GO