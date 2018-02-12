

SET NOCOUNT ON
SET XACT_ABORT ON

BEGIN TRANSACTION
	INSERT INTO Product.product_extras(id_store,name,price,store_notes,limit_per_product,active,position_id_previous,position_id_next,updated_by) VALUES (1,'Pineapple',0.45,NULL,10,1,NULL,2,3)
	INSERT INTO Product.product_extras(id_store,name,price,store_notes,limit_per_product,active,position_id_previous,position_id_next,updated_by) VALUES (1,'Extra Cheese',1,NULL,10,1,1,3,3)
	INSERT INTO Product.product_extras(id_store,name,price,store_notes,limit_per_product,active,position_id_previous,position_id_next,updated_by) VALUES (1,'Extra Sauce',0,'Don''t use too much',10,1,2,4,3)
	INSERT INTO Product.product_extras(id_store,name,price,store_notes,limit_per_product,active,position_id_previous,position_id_next,updated_by) VALUES (1,'Olives',0.5,NULL,10,1,3,5,3)
	INSERT INTO Product.product_extras(id_store,name,price,store_notes,limit_per_product,active,position_id_previous,position_id_next,updated_by) VALUES (1,'Pepperoni',0.95,NULL,10,1,4,6,3)
	INSERT INTO Product.product_extras(id_store,name,price,store_notes,limit_per_product,active,position_id_previous,position_id_next,updated_by) VALUES (1,'Salami',0.95,NULL,5,1,5,NULL,3)
COMMIT

GO


