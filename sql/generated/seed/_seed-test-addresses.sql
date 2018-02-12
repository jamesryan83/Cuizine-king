

SET NOCOUNT ON
SET XACT_ABORT ON

BEGIN TRANSACTION
	INSERT INTO App.addresses(id_postcode,street_address,latitude,longitude,updated_by) VALUES (9177,'2 Hythe St',-37.7885161869,153.444458,3)
COMMIT

GO


