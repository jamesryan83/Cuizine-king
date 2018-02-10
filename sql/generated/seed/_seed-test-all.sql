

SET NOCOUNT ON
SET XACT_ABORT ON

BEGIN TRANSACTION
	INSERT INTO App.addresses(id_postcode,line1,line2,latitude,longitude,updated_by) VALUES (9177,'2 Hythe St',NULL,-37.7885161869,153.444458,3)
COMMIT

GO



SET NOCOUNT ON
SET XACT_ABORT ON

BEGIN TRANSACTION
	INSERT INTO App.people(id_address,is_web_user,is_store_user,is_system_user,first_name,last_name,email,phone_number,password,reset_password_token,jwt,is_verified,verification_token,is_deleted,is_deleted_email,internal_notes,updated_by) VALUES (NULL,1,0,0,'abc','test1','james4165@hotmail.com','3829 9210','$2a$10$r8roGLyywW3mGT0YKUEDnekZvKkyI1L2gU59HN9lfLyGVQmamMAdO','9RLFIGnqRoZESioRt2ZsOiCbGrYujlTDk8UxNu8MRb62Sjn4UoqVJ7tkzU8fSsFI','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwic2hvcnRFeHAiOiIzMDAwMDAiLCJpYXQiOjE1MTc3NDE1OTYsImV4cCI6MTU0OTI5OTE5Nn0.RvCp0bNgdtUoaFQNcBZMzCXTM5l3pfc2xO9Aw5QsjU0',1,'T5TEQheJSuC8GVqcowqcOnExinHR5sKDBPFTapTuiO9Ct1zYXFckU0BTaJHGGdLr',0,NULL,'james admin web account',3)
	INSERT INTO App.people(id_address,is_web_user,is_store_user,is_system_user,first_name,last_name,email,phone_number,password,reset_password_token,jwt,is_verified,verification_token,is_deleted,is_deleted_email,internal_notes,updated_by) VALUES (NULL,1,1,0,'def','test2','jamesryan4171@gmail.com','3830 9211','$2a$10$NPLNSYTnFxzP98cqd5iFdOdHvS63CZ2GPvL/aQiKTDBOIJNwJm.g2','Dh3fv9H9BIGkLEAsxlrcmfDb09FQ1o5yrLSqts5HL9lS8RWXCGvawPbzcGP6exLw','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwic2hvcnRFeHAiOiIzMDAwMDAiLCJpYXQiOjE1MTc3NDE2MDcsImV4cCI6MTU0OTI5OTIwN30.CjvcjnfZgybk4kTo8LE8WfpDKE3o_nWprxuTmnXUfos',1,'VUTOf05XFLZQYlCSfAciFU8wl9yZfpsYg4UESWnQZxS0Ef5mbB8oVxaoNB53CW4N',0,NULL,'james admin store account',3)
	INSERT INTO App.people(id_address,is_web_user,is_store_user,is_system_user,first_name,last_name,email,phone_number,password,reset_password_token,jwt,is_verified,verification_token,is_deleted,is_deleted_email,internal_notes,updated_by) VALUES (NULL,1,1,1,'ghi','test3','james4171@hotmail.com','3830 9211','$2a$10$07dMEZGdynhXzQNPKf/zme9A0jUZBQgBgJf3Tm9PMk4mxdfVERPj6','CNRWPnmLCTNIsJxdv5sgU6JCXqS6q7ozADRIEzAtBPUZWyD4v2Brsk81bsesFkN0','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwic2hvcnRFeHAiOiIzMDAwMDAiLCJpYXQiOjE1MTc3NDE2MjEsImV4cCI6MTU0OTI5OTIyMX0.gNpzQhDhwlPI6GpVXN9JfVtelK0_X-Sj16aRvTOj1cw',1,'PYEjn191qkTD8QCoMOUegQn8Fdo9ZrexFE1nhy1a7qQuC6mqS2bH2YILqFnVFjHI',0,NULL,'james admin system account',3)
COMMIT

GO



SET NOCOUNT ON
SET XACT_ABORT ON

BEGIN TRANSACTION
	INSERT INTO Store.stores(id_address,name,description,email,phone_number,website,facebook,twitter,abn,bank_name,bank_bsb,bank_account_name,bank_account_number,is_deleted,is_deleted_email,internal_notes,updated_by) VALUES (1,'The Abyssinian','There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don''t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn''t anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary','james4165@hotmail.com','33330000','https://www.zomato.com/melbourne/the-abyssinian-flemington?utm_source=api_basic_user&utm_medium=api&utm_campaign=v2.1',NULL,NULL,'12345678912','Test1','123-1','test-1','1231',0,NULL,NULL,3)
COMMIT

GO



SET NOCOUNT ON
SET XACT_ABORT ON

BEGIN TRANSACTION
	INSERT INTO Store.stores_people(id_store,id_person,updated_by) VALUES (1,2,3)
COMMIT

GO



SET NOCOUNT ON
SET XACT_ABORT ON

BEGIN TRANSACTION
	INSERT INTO Product.products(id_store,name,description,store_notes,delivery_available,gluten_free,vegetarian,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (1,'Ham and Cheese','Ham, cheese and tomato sauce','is good',1,0,0,1,1,NULL,2,3)
	INSERT INTO Product.products(id_store,name,description,store_notes,delivery_available,gluten_free,vegetarian,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (1,'Pepperoni','Ham, onion, capsicum and pepperoni',NULL,1,0,0,1,1,1,3,3)
	INSERT INTO Product.products(id_store,name,description,store_notes,delivery_available,gluten_free,vegetarian,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (1,'Supreme','Ham, onion, pepperoni, capsicum, bacon, olives, mushroom and anchovies',NULL,0,1,0,1,1,2,4,3)
	INSERT INTO Product.products(id_store,name,description,store_notes,delivery_available,gluten_free,vegetarian,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (1,'Vegetarian','Onion, capsicum, olives, pineapple and mushroom',NULL,1,1,1,1,1,3,5,3)
	INSERT INTO Product.products(id_store,name,description,store_notes,delivery_available,gluten_free,vegetarian,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (1,'Cheese Burger','Char grilled beef patties, tasty cheese, tomato ketchup and spanish onions','Make it heaps cheesey',1,0,0,1,1,4,6,3)
	INSERT INTO Product.products(id_store,name,description,store_notes,delivery_available,gluten_free,vegetarian,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (1,'Beef BLT Burger','Char grilled beef patties, crispy bacon, fresh lettuce, ripe tomato and house made tomato relish',NULL,1,1,0,1,1,5,7,3)
	INSERT INTO Product.products(id_store,name,description,store_notes,delivery_available,gluten_free,vegetarian,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (1,'Our Classic Burger','Char grilled beef patties, spanish onions, beetroot, lettuce, our own herb mayo, tasty cheese',NULL,0,1,0,1,1,6,8,3)
	INSERT INTO Product.products(id_store,name,description,store_notes,delivery_available,gluten_free,vegetarian,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (1,'Chicken Pesto','Creamy pesto sauce, chicken breast medallions, semi dried tomatos, and pine nuts with tagliatelle','10% off with coupon',1,0,0,1,1,7,9,3)
	INSERT INTO Product.products(id_store,name,description,store_notes,delivery_available,gluten_free,vegetarian,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (1,'Carbonara Fettuccine','Double smoked bacon and onion, cooked in a creamy garlic and parmesan sauce topped with crispy pancetta',NULL,1,1,0,1,1,8,10,3)
	INSERT INTO Product.products(id_store,name,description,store_notes,delivery_available,gluten_free,vegetarian,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (1,'Napoli','Garlic, onions, capers and black olices, in a herby tomato sauce',NULL,1,1,1,1,1,9,11,3)
	INSERT INTO Product.products(id_store,name,description,store_notes,delivery_available,gluten_free,vegetarian,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (1,'Portobello Mushroom and Sage','In a creamy sauce with fettuccine',NULL,0,1,1,1,1,10,12,3)
COMMIT

GO



SET NOCOUNT ON
SET XACT_ABORT ON

BEGIN TRANSACTION
	INSERT INTO Product.product_extras(id_store,name,price,store_notes,limit_per_product,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (1,'Pineapple',0.45,NULL,10,1,1,NULL,2,3)
	INSERT INTO Product.product_extras(id_store,name,price,store_notes,limit_per_product,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (1,'Extra Cheese',1,NULL,10,1,1,1,3,3)
	INSERT INTO Product.product_extras(id_store,name,price,store_notes,limit_per_product,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (1,'Extra Sauce',0,'Don''t use too much',10,1,1,2,4,3)
	INSERT INTO Product.product_extras(id_store,name,price,store_notes,limit_per_product,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (1,'Olives',0.5,NULL,10,1,1,3,5,3)
	INSERT INTO Product.product_extras(id_store,name,price,store_notes,limit_per_product,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (1,'Pepperoni',0.95,NULL,10,1,1,4,6,3)
	INSERT INTO Product.product_extras(id_store,name,price,store_notes,limit_per_product,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (1,'Salami',0.95,NULL,5,1,1,5,NULL,3)
COMMIT

GO



SET NOCOUNT ON
SET XACT_ABORT ON

BEGIN TRANSACTION
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (1,'Small',NULL,7.95,10,1,1,NULL,2,3)
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (1,'Regular',NULL,9,10,1,1,1,3,3)
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (1,'Large',NULL,12.5,10,1,1,2,4,3)
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (1,'Family','test comment',15.95,10,1,1,3,NULL,3)
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (2,'Small',NULL,7.95,10,1,1,NULL,2,3)
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (2,'Regular',NULL,9,10,1,1,1,3,3)
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (2,'Large',NULL,12.5,10,1,1,2,4,3)
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (3,'Small',NULL,7.95,10,1,1,NULL,2,3)
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (3,'Regular',NULL,9,10,1,1,1,3,3)
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (3,'Large',NULL,12.5,10,1,1,2,NULL,3)
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (4,'Small',NULL,7.95,10,1,1,NULL,2,3)
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (4,'Regular',NULL,9,10,1,1,1,3,3)
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (4,'Large',NULL,12.5,10,1,1,2,4,3)
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (4,'Family',NULL,15.95,10,1,1,3,NULL,3)
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (5,'Regular',NULL,8.95,10,1,1,NULL,2,3)
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (5,'Large',NULL,12.95,10,1,1,1,NULL,3)
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (6,'Regular',NULL,8.95,10,1,1,NULL,2,3)
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (6,'Large',NULL,12.95,10,1,1,1,NULL,3)
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (7,'Regular',NULL,8.95,10,1,1,NULL,2,3)
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (7,'Large',NULL,12.95,10,1,1,1,NULL,3)
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (8,'Main',NULL,18.95,5,1,1,NULL,NULL,3)
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (9,'Main',NULL,18.95,5,1,1,NULL,NULL,3)
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (10,'Main',NULL,18.95,5,1,1,NULL,NULL,3)
	INSERT INTO Product.product_options(id_product,name,store_notes,price,limit_per_customer,in_stock,active,position_id_previous,position_id_next,updated_by) VALUES (11,'Main',NULL,18.95,5,1,1,NULL,NULL,3)
COMMIT

GO



SET NOCOUNT ON
SET XACT_ABORT ON

BEGIN TRANSACTION
	INSERT INTO Product.product_headings(id_store,title,subtitle,above_product_id,updated_by) VALUES (1,'Pizzas','These are some pizzas',1,3)
	INSERT INTO Product.product_headings(id_store,title,subtitle,above_product_id,updated_by) VALUES (1,'Burgers','Burgers are good',5,3)
	INSERT INTO Product.product_headings(id_store,title,subtitle,above_product_id,updated_by) VALUES (1,'Pasta',NULL,8,3)
COMMIT

GO



SET NOCOUNT ON
SET XACT_ABORT ON

BEGIN TRANSACTION
	INSERT INTO Store.business_hours(id_store,dine_in_hours,day,opens,closes,updated_by) VALUES (1,1,1,'9am','11pm',3)
	INSERT INTO Store.business_hours(id_store,dine_in_hours,day,opens,closes,updated_by) VALUES (1,1,2,'6am','1am',3)
	INSERT INTO Store.business_hours(id_store,dine_in_hours,day,opens,closes,updated_by) VALUES (1,1,3,'7am','10pm',3)
	INSERT INTO Store.business_hours(id_store,dine_in_hours,day,opens,closes,updated_by) VALUES (1,1,4,'9am','9pm',3)
	INSERT INTO Store.business_hours(id_store,dine_in_hours,day,opens,closes,updated_by) VALUES (1,1,5,'10am','9pm',3)
	INSERT INTO Store.business_hours(id_store,dine_in_hours,day,opens,closes,updated_by) VALUES (1,1,6,'8am','1am',3)
	INSERT INTO Store.business_hours(id_store,dine_in_hours,day,opens,closes,updated_by) VALUES (1,1,7,'9am','10pm',3)
	INSERT INTO Store.business_hours(id_store,dine_in_hours,day,opens,closes,updated_by) VALUES (1,0,1,'7am','10pm',3)
	INSERT INTO Store.business_hours(id_store,dine_in_hours,day,opens,closes,updated_by) VALUES (1,0,2,'6am','9pm',3)
	INSERT INTO Store.business_hours(id_store,dine_in_hours,day,opens,closes,updated_by) VALUES (1,0,3,'8am','1am',3)
	INSERT INTO Store.business_hours(id_store,dine_in_hours,day,opens,closes,updated_by) VALUES (1,0,4,'10am','12am',3)
	INSERT INTO Store.business_hours(id_store,dine_in_hours,day,opens,closes,updated_by) VALUES (1,0,5,'6am','9pm',3)
	INSERT INTO Store.business_hours(id_store,dine_in_hours,day,opens,closes,updated_by) VALUES (1,0,6,'6am','11pm',3)
	INSERT INTO Store.business_hours(id_store,dine_in_hours,day,opens,closes,updated_by) VALUES (1,0,7,'6am','9pm',3)
COMMIT

GO



SET NOCOUNT ON
SET XACT_ABORT ON

BEGIN TRANSACTION
	INSERT INTO Store.reviews(id_store,id_person,title,review,rating,updated_by) VALUES (1,1,'My favourite','I stumbled on this undiscovered gem right in our neighboorhood. I want to hire their decorator to furnish my apartment. The waitress was prompt and polite. Everything I tried was bursting with flavor. Make sure to save room for dessert, because that was the best part of the meal!',4.2,3)
	INSERT INTO Store.reviews(id_store,id_person,title,review,rating,updated_by) VALUES (1,2,'Very nice','Decent place. Make sure to save room for dessert, because that was the best part of the meal! Try out the huge selection of incredible appetizers. After my meal, I was knocked into a food coma. The chicken was a little dry',3.8,3)
	INSERT INTO Store.reviews(id_store,id_person,title,review,rating,updated_by) VALUES (1,3,'Awesome !','I''ve got a fetish for good food and this place gets me hot! Try out the huge selection of incredible appetizers. The waitress was prompt and polite. The food was flavorful, savory, and succulent. After my meal, I was knocked into a food coma',4.4,3)
COMMIT

GO



SET NOCOUNT ON
SET XACT_ABORT ON

BEGIN TRANSACTION
	INSERT INTO Store.store_applications(name,email,message,is_completed,is_cancelled,internal_notes,updated_by) VALUES ('james','james4165@hotmail.com','test application',1,0,'test application',3)
COMMIT

GO


