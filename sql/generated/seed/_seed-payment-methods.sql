

SET NOCOUNT ON
SET XACT_ABORT ON

BEGIN TRANSACTION
	INSERT INTO App.payment_methods(id_payment_method,name,updated_by) VALUES (1,'credit card',3)
	INSERT INTO App.payment_methods(id_payment_method,name,updated_by) VALUES (2,'cash',3)
	INSERT INTO App.payment_methods(id_payment_method,name,updated_by) VALUES (3,'paypal',3)
COMMIT

GO


