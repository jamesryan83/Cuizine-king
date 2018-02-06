

SET NOCOUNT ON
SET XACT_ABORT ON

BEGIN TRANSACTION
	INSERT INTO Product.product_headings(id_store,title,subtitle,position_id_previous,position_id_next,updated_by) VALUES (,'Pizzas','These are some pizzas',,,)
	INSERT INTO Product.product_headings(id_store,title,subtitle,position_id_previous,position_id_next,updated_by) VALUES (,'Burgers','Burgers are good',,,)
	INSERT INTO Product.product_headings(id_store,title,subtitle,position_id_previous,position_id_next,updated_by) VALUES (,'Pasta',NULL,,,)
	INSERT INTO Product.product_headings(id_store,title,subtitle,position_id_previous,position_id_next,updated_by) VALUES (,NULL,NULL,,,)
	INSERT INTO Product.product_headings(id_store,title,subtitle,position_id_previous,position_id_next,updated_by) VALUES (,NULL,NULL,,,)
COMMIT

GO


