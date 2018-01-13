

SET NOCOUNT ON
SET XACT_ABORT ON

BEGIN TRANSACTION
	INSERT INTO App.order_types(name,updated_by) VALUES ('Delivery',1)
	INSERT INTO App.order_types(name,updated_by) VALUES ('Dine In',1)
	INSERT INTO App.order_types(name,updated_by) VALUES ('Take Away',1)
COMMIT

GO
