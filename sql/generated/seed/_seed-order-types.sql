

SET NOCOUNT ON
SET XACT_ABORT ON

BEGIN TRANSACTION
	INSERT INTO App.order_types(id_order_type,name,updated_by) VALUES (1,'delivery',3)
	INSERT INTO App.order_types(id_order_type,name,updated_by) VALUES (2,'dinein',3)
	INSERT INTO App.order_types(id_order_type,name,updated_by) VALUES (3,'takeaway',3)
COMMIT

GO


