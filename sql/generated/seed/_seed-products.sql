

SET NOCOUNT ON
SET XACT_ABORT ON

BEGIN TRANSACTION
	INSERT INTO Product.products(id_store,name,description,store_notes,delivery_available,gluten_free,vegetarian,active,position_id_previous,position_id_next,updated_by) VALUES (1,'Ham and Cheese','Ham, cheese and tomato sauce','is good',1,0,0,1,NULL,2,3)
	INSERT INTO Product.products(id_store,name,description,store_notes,delivery_available,gluten_free,vegetarian,active,position_id_previous,position_id_next,updated_by) VALUES (1,'Pepperoni','Ham, onion, capsicum and pepperoni',NULL,1,0,0,1,1,3,3)
	INSERT INTO Product.products(id_store,name,description,store_notes,delivery_available,gluten_free,vegetarian,active,position_id_previous,position_id_next,updated_by) VALUES (1,'Supreme','Ham, onion, pepperoni, capsicum, bacon, olives, mushroom and anchovies',NULL,0,1,0,1,2,4,3)
	INSERT INTO Product.products(id_store,name,description,store_notes,delivery_available,gluten_free,vegetarian,active,position_id_previous,position_id_next,updated_by) VALUES (1,'Vegetarian','Onion, capsicum, olives, pineapple and mushroom',NULL,1,1,1,1,3,5,3)
	INSERT INTO Product.products(id_store,name,description,store_notes,delivery_available,gluten_free,vegetarian,active,position_id_previous,position_id_next,updated_by) VALUES (1,'Cheese Burger','Char grilled beef patties, tasty cheese, tomato ketchup and spanish onions','Make it heaps cheesey',1,0,0,1,4,6,3)
	INSERT INTO Product.products(id_store,name,description,store_notes,delivery_available,gluten_free,vegetarian,active,position_id_previous,position_id_next,updated_by) VALUES (1,'Beef BLT Burger','Char grilled beef patties, crispy bacon, fresh lettuce, ripe tomato and house made tomato relish',NULL,1,1,0,1,5,7,3)
	INSERT INTO Product.products(id_store,name,description,store_notes,delivery_available,gluten_free,vegetarian,active,position_id_previous,position_id_next,updated_by) VALUES (1,'Our Classic Burger','Char grilled beef patties, spanish onions, beetroot, lettuce, our own herb mayo, tasty cheese',NULL,0,1,0,1,6,8,3)
	INSERT INTO Product.products(id_store,name,description,store_notes,delivery_available,gluten_free,vegetarian,active,position_id_previous,position_id_next,updated_by) VALUES (1,'Chicken Pesto','Creamy pesto sauce, chicken breast medallions, semi dried tomatos, and pine nuts with tagliatelle','10% off with coupon',1,0,0,1,7,9,3)
	INSERT INTO Product.products(id_store,name,description,store_notes,delivery_available,gluten_free,vegetarian,active,position_id_previous,position_id_next,updated_by) VALUES (1,'Carbonara Fettuccine','Double smoked bacon and onion, cooked in a creamy garlic and parmesan sauce topped with crispy pancetta',NULL,1,1,0,1,8,10,3)
	INSERT INTO Product.products(id_store,name,description,store_notes,delivery_available,gluten_free,vegetarian,active,position_id_previous,position_id_next,updated_by) VALUES (1,'Napoli','Garlic, onions, capers and black olices, in a herby tomato sauce',NULL,1,1,1,1,9,11,3)
	INSERT INTO Product.products(id_store,name,description,store_notes,delivery_available,gluten_free,vegetarian,active,position_id_previous,position_id_next,updated_by) VALUES (1,'Portobello Mushroom and Sage','In a creamy sauce with fettuccine',NULL,0,1,1,1,10,12,3)
	INSERT INTO Product.products(id_store,name,description,store_notes,delivery_available,gluten_free,vegetarian,active,position_id_previous,position_id_next,updated_by) VALUES (2,'out of stock item','test',NULL,1,1,1,1,11,13,3)
	INSERT INTO Product.products(id_store,name,description,store_notes,delivery_available,gluten_free,vegetarian,active,position_id_previous,position_id_next,updated_by) VALUES (2,'inactive item','test',NULL,1,1,1,0,12,NULL,3)
COMMIT

GO


