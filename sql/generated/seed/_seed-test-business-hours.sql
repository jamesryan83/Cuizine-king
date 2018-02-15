

SET NOCOUNT ON
SET XACT_ABORT ON

BEGIN TRANSACTION
	INSERT INTO Store.business_hours(id_store,hours_mon_dinein_open,hours_mon_dinein_close,hours_tue_dinein_open,hours_tue_dinein_close,hours_wed_dinein_open,hours_wed_dinein_close,hours_thu_dinein_open,hours_thu_dinein_close,hours_fri_dinein_open,hours_fri_dinein_close,hours_sat_dinein_open,hours_sat_dinein_close,hours_sun_dinein_open,hours_sun_dinein_close,hours_mon_delivery_open,hours_mon_delivery_close,hours_tue_delivery_open,hours_tue_delivery_close,hours_wed_delivery_open,hours_wed_delivery_close,hours_thu_delivery_open,hours_thu_delivery_close,hours_fri_delivery_open,hours_fri_delivery_close,hours_sat_delivery_open,hours_sat_delivery_close,hours_sun_delivery_open,hours_sun_delivery_close,updated_by) VALUES (1,'07:00','22:00','07:00','22:00','07:00','22:00','07:00','22:00','07:00','22:00','07:00','22:00','NULL','NULL','07:00','22:00','07:00','22:00','07:00','22:00','07:00','22:00','07:00','22:00','07:00','22:00','07:00','22:00',3)
COMMIT

GO


