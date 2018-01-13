

SET NOCOUNT ON
SET XACT_ABORT ON

BEGIN TRANSACTION
	INSERT INTO App.payment_methods(name,updated_by) VALUES ('Credit Card',1)
	INSERT INTO App.payment_methods(name,updated_by) VALUES ('Cash',1)
	INSERT INTO App.payment_methods(name,updated_by) VALUES ('PayPal',1)
COMMIT

GO
