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

        IF @id_postcode IS NULL THROW 50400, 'invalidPostcodeOrSuburb', 1


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