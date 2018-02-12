-- GENERATED FILE




 -- Drop Constraints

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'App' AND TABLE_NAME = 'addresses')
BEGIN
ALTER TABLE App.addresses DROP CONSTRAINT FK_app_addresses_app_postcodes
END
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'App' AND TABLE_NAME = 'people')
BEGIN
ALTER TABLE App.people DROP CONSTRAINT FK_app_people_app_addresses
END
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'Product' AND TABLE_NAME = 'product_extras')
BEGIN
ALTER TABLE Product.product_extras DROP CONSTRAINT FK_product_product_extras_store_stores
END
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'Product' AND TABLE_NAME = 'product_headings')
BEGIN
ALTER TABLE Product.product_headings DROP CONSTRAINT FK_product_product_headings_store_stores
END
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'Product' AND TABLE_NAME = 'product_options')
BEGIN
ALTER TABLE Product.product_options DROP CONSTRAINT FK_product_product_optionss_product_products
END
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'Product' AND TABLE_NAME = 'products_product_extras')
BEGIN
ALTER TABLE Product.products_product_extras DROP CONSTRAINT FK_product_products_product_extras_product_products
END
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'Product' AND TABLE_NAME = 'products_product_extras')
BEGIN
ALTER TABLE Product.products_product_extras DROP CONSTRAINT FK_product_products_product_extras_product_product_extras
END
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'Product' AND TABLE_NAME = 'products')
BEGIN
ALTER TABLE Product.products DROP CONSTRAINT FK_product_products_store_stores
END
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'Sales' AND TABLE_NAME = 'order_products_extras')
BEGIN
ALTER TABLE Sales.order_products_extras DROP CONSTRAINT FK_sales_order_products_extras_sales_order_products
END
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'Sales' AND TABLE_NAME = 'order_products')
BEGIN
ALTER TABLE Sales.order_products DROP CONSTRAINT FK_sales_order_products_sales_orders
END
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'Sales' AND TABLE_NAME = 'orders')
BEGIN
ALTER TABLE Sales.orders DROP CONSTRAINT FK_sales_orders_store_stores
END
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'Sales' AND TABLE_NAME = 'orders')
BEGIN
ALTER TABLE Sales.orders DROP CONSTRAINT FK_sales_orders_app_people
END
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'Sales' AND TABLE_NAME = 'orders')
BEGIN
ALTER TABLE Sales.orders DROP CONSTRAINT FK_sales_orders_app_order_types
END
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'Sales' AND TABLE_NAME = 'transactions')
BEGIN
ALTER TABLE Sales.transactions DROP CONSTRAINT FK_sales_transactions_sales_orders
END
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'Sales' AND TABLE_NAME = 'transactions')
BEGIN
ALTER TABLE Sales.transactions DROP CONSTRAINT FK_sales_transactions_app_people
END
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'Sales' AND TABLE_NAME = 'transactions')
BEGIN
ALTER TABLE Sales.transactions DROP CONSTRAINT FK_sales_transactions_store_stores
END
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'Sales' AND TABLE_NAME = 'transactions')
BEGIN
ALTER TABLE Sales.transactions DROP CONSTRAINT FK_sales_transactions_app_payment_methods
END
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'Store' AND TABLE_NAME = 'business_hours')
BEGIN
ALTER TABLE Store.business_hours DROP CONSTRAINT FK_store_business_hours_store_stores
END
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'Store' AND TABLE_NAME = 'reviews')
BEGIN
ALTER TABLE Store.reviews DROP CONSTRAINT FK_store_reviews_storestore_stores
END
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'Store' AND TABLE_NAME = 'reviews')
BEGIN
ALTER TABLE Store.reviews DROP CONSTRAINT FK_store_reviews_app_people
END
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'Store' AND TABLE_NAME = 'stores_people')
BEGIN
ALTER TABLE Store.stores_people DROP CONSTRAINT FK_store_stores_people_store_stores
END
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'Store' AND TABLE_NAME = 'stores_people')
BEGIN
ALTER TABLE Store.stores_people DROP CONSTRAINT FK_store_stores_people_app_people
END
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'Store' AND TABLE_NAME = 'stores')
BEGIN
ALTER TABLE Store.stores DROP CONSTRAINT FK_store_stores_app_addresses
END


 -- Drop Tables

DROP TABLE IF EXISTS App.addresses
DROP TABLE IF EXISTS App.order_types
DROP TABLE IF EXISTS App.payment_methods
DROP TABLE IF EXISTS App.people
DROP TABLE IF EXISTS App.postcodes
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'Product' AND TABLE_NAME = 'product_extras')
BEGIN
ALTER TABLE Product.product_extras SET (SYSTEM_VERSIONING = OFF)
END
DROP TABLE IF EXISTS Product.product_extras_history
DROP TABLE IF EXISTS Product.product_extras
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'Product' AND TABLE_NAME = 'product_headings')
BEGIN
ALTER TABLE Product.product_headings SET (SYSTEM_VERSIONING = OFF)
END
DROP TABLE IF EXISTS Product.product_headings_history
DROP TABLE IF EXISTS Product.product_headings
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'Product' AND TABLE_NAME = 'product_options')
BEGIN
ALTER TABLE Product.product_options SET (SYSTEM_VERSIONING = OFF)
END
DROP TABLE IF EXISTS Product.product_options_history
DROP TABLE IF EXISTS Product.product_options
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'Product' AND TABLE_NAME = 'products_product_extras')
BEGIN
ALTER TABLE Product.products_product_extras SET (SYSTEM_VERSIONING = OFF)
END
DROP TABLE IF EXISTS Product.products_product_extras_history
DROP TABLE IF EXISTS Product.products_product_extras
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'Product' AND TABLE_NAME = 'products')
BEGIN
ALTER TABLE Product.products SET (SYSTEM_VERSIONING = OFF)
END
DROP TABLE IF EXISTS Product.products_history
DROP TABLE IF EXISTS Product.products
DROP TABLE IF EXISTS Sales.order_products_extras
DROP TABLE IF EXISTS Sales.order_products
DROP TABLE IF EXISTS Sales.orders
DROP TABLE IF EXISTS Sales.transactions
DROP TABLE IF EXISTS Store.business_hours
DROP TABLE IF EXISTS Store.reviews
DROP TABLE IF EXISTS Store.store_applications
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'Store' AND TABLE_NAME = 'stores_people')
BEGIN
ALTER TABLE Store.stores_people SET (SYSTEM_VERSIONING = OFF)
END
DROP TABLE IF EXISTS Store.stores_people_history
DROP TABLE IF EXISTS Store.stores_people
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'Store' AND TABLE_NAME = 'stores')
BEGIN
ALTER TABLE Store.stores SET (SYSTEM_VERSIONING = OFF)
END
DROP TABLE IF EXISTS Store.stores_history
DROP TABLE IF EXISTS Store.stores
GO


 -- Drop Procedures

DROP PROCEDURE IF EXISTS people_create_store_user
DROP PROCEDURE IF EXISTS people_create_system_user
DROP PROCEDURE IF EXISTS people_create_web_user
DROP PROCEDURE IF EXISTS people_delete
DROP PROCEDURE IF EXISTS people_get_by_email
DROP PROCEDURE IF EXISTS people_get_by_id
DROP PROCEDURE IF EXISTS people_get_by_jwt
DROP PROCEDURE IF EXISTS people_invalidate_jwt
DROP PROCEDURE IF EXISTS people_update_is_verified
DROP PROCEDURE IF EXISTS people_update_jwt
DROP PROCEDURE IF EXISTS people_update_password
DROP PROCEDURE IF EXISTS people_update_reset_password_token
DROP PROCEDURE IF EXISTS reviews_get
DROP PROCEDURE IF EXISTS store_applications_create
DROP PROCEDURE IF EXISTS stores_create
DROP PROCEDURE IF EXISTS stores_delete
DROP PROCEDURE IF EXISTS stores_get
DROP PROCEDURE IF EXISTS stores_undelete
GO


 -- Drop Functions

DROP FUNCTION IF EXISTS get_sequence_value
GO


 -- Drop Sequences

DROP SEQUENCE IF EXISTS Sequences.id_address 
DROP SEQUENCE IF EXISTS Sequences.id_person 
DROP SEQUENCE IF EXISTS Sequences.id_postcode 
DROP SEQUENCE IF EXISTS Sequences.id_product_extra 
DROP SEQUENCE IF EXISTS Sequences.id_product_heading 
DROP SEQUENCE IF EXISTS Sequences.id_product_option 
DROP SEQUENCE IF EXISTS Sequences.id_product 
DROP SEQUENCE IF EXISTS Sequences.id_product_product_extra 
DROP SEQUENCE IF EXISTS Sequences.id_order_product 
DROP SEQUENCE IF EXISTS Sequences.id_order_product_extra 
DROP SEQUENCE IF EXISTS Sequences.id_order 
DROP SEQUENCE IF EXISTS Sequences.id_transaction 
DROP SEQUENCE IF EXISTS Sequences.id_business_hour 
DROP SEQUENCE IF EXISTS Sequences.id_review 
DROP SEQUENCE IF EXISTS Sequences.id_store_application 
DROP SEQUENCE IF EXISTS Sequences.id_store 
DROP SEQUENCE IF EXISTS Sequences.id_store_person 
GO


 -- Drop Schemas

DROP SCHEMA IF EXISTS Sequences
DROP SCHEMA IF EXISTS App
DROP SCHEMA IF EXISTS Store
DROP SCHEMA IF EXISTS Product
DROP SCHEMA IF EXISTS Sales
GO