USE menuthing

SET NOCOUNT ON
SET XACT_ABORT ON

BEGIN TRANSACTION
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (1,'Small',NULL,7.95,10,1,1,NULL,2,1)
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (1,'Regular',NULL,9,10,1,1,1,3,1)
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (1,'Large',NULL,12.5,10,1,1,2,4,1)
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (1,'Family','test comment',15.95,10,1,1,3,NULL,1)
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (2,'Small',NULL,7.95,10,1,1,NULL,2,1)
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (2,'Regular',NULL,9,10,1,1,1,3,1)
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (2,'Large',NULL,12.5,10,1,1,2,4,1)
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (3,'Small',NULL,7.95,10,1,1,NULL,2,1)
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (3,'Regular',NULL,9,10,1,1,1,3,1)
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (3,'Large',NULL,12.5,10,1,1,2,NULL,1)
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (4,'Small',NULL,7.95,10,1,1,NULL,2,1)
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (4,'Regular',NULL,9,10,1,1,1,3,1)
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (4,'Large',NULL,12.5,10,1,1,2,4,1)
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (4,'Family',NULL,15.95,10,1,1,3,NULL,1)
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (5,'Regular',NULL,8.95,10,1,1,NULL,2,1)
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (5,'Large',NULL,12.95,10,1,1,1,NULL,1)
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (6,'Regular',NULL,8.95,10,1,1,NULL,2,1)
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (6,'Large',NULL,12.95,10,1,1,1,NULL,1)
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (7,'Regular',NULL,8.95,10,1,1,NULL,2,1)
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (7,'Large',NULL,12.95,10,1,1,1,NULL,1)
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (8,'Main',NULL,18.95,5,1,1,NULL,NULL,1)
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (9,'Main',NULL,18.95,5,1,1,NULL,NULL,1)
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (10,'Main',NULL,18.95,5,1,1,NULL,NULL,1)
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (11,'Main',NULL,18.95,5,1,1,NULL,NULL,1)
COMMIT

GO
