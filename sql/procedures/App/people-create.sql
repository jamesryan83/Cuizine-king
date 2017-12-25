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

    SET NOCOUNT ON
    SET XACT_ABORT ON

    DECLARE @id_postcode INT
    DECLARE @newAddressId INT
    DECLARE @newPersonId INT

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