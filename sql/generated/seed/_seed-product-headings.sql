

SET NOCOUNT ON
SET XACT_ABORT ON

BEGIN TRANSACTION
	INSERT INTO Product.product_headings(id_store,title,subtitle,above_product_id,updated_by) VALUES (1,'Pizzas','These are some pizzas',1,3)
	INSERT INTO Product.product_headings(id_store,title,subtitle,above_product_id,updated_by) VALUES (1,'Burgers','Burgers are good',5,3)
	INSERT INTO Product.product_headings(id_store,title,subtitle,above_product_id,updated_by) VALUES (1,'Pasta',NULL,8,3)
COMMIT

GO


