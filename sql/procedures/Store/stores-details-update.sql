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
