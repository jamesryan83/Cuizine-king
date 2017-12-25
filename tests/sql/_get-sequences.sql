-- GENERATE FILE

USE menuthingTest

SELECT name, current_value FROM sys.sequences WHERE name = 'id_person'
SELECT name, current_value FROM sys.sequences WHERE name = 'id_address'
SELECT name, current_value FROM sys.sequences WHERE name = 'id_postcode'
SELECT name, current_value FROM sys.sequences WHERE name = 'id_order_type'
SELECT name, current_value FROM sys.sequences WHERE name = 'id_payment_method'
SELECT name, current_value FROM sys.sequences WHERE name = 'id_store'
SELECT name, current_value FROM sys.sequences WHERE name = 'id_business_hour'
SELECT name, current_value FROM sys.sequences WHERE name = 'id_review'
SELECT name, current_value FROM sys.sequences WHERE name = 'id_product'
SELECT name, current_value FROM sys.sequences WHERE name = 'id_product_option'
SELECT name, current_value FROM sys.sequences WHERE name = 'id_product_extra'
SELECT name, current_value FROM sys.sequences WHERE name = 'id_product_product_extra'
SELECT name, current_value FROM sys.sequences WHERE name = 'id_transaction'
SELECT name, current_value FROM sys.sequences WHERE name = 'id_order'
SELECT name, current_value FROM sys.sequences WHERE name = 'id_order_product'
SELECT name, current_value FROM sys.sequences WHERE name = 'id_order_product_extra'
