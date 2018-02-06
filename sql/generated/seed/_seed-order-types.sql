

SET NOCOUNT ON
SET XACT_ABORT ON

BEGIN TRANSACTION
	INSERT INTO App.order_types(id_order_type,name,updated_by) VALUES (1,'delivery',1)
	INSERT INTO App.order_types(id_order_type,name,updated_by) VALUES (2,'dinein',1)
	INSERT INTO App.order_types(id_order_type,name,updated_by) VALUES (3,'takeaway',1)
COMMIT

GO


