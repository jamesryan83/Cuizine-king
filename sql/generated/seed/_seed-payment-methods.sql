

SET NOCOUNT ON
SET XACT_ABORT ON

BEGIN TRANSACTION
	INSERT INTO App.payment_methods(id_payment_method,name,updated_by) VALUES (1,'credit card',1)
	INSERT INTO App.payment_methods(id_payment_method,name,updated_by) VALUES (2,'cash',1)
	INSERT INTO App.payment_methods(id_payment_method,name,updated_by) VALUES (3,'paypal',1)
COMMIT

GO


