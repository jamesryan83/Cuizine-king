-- GENERATED FILE




 -- Create Schemas

CREATE SCHEMA Sequences
GO
CREATE SCHEMA App
GO
CREATE SCHEMA Store
GO
CREATE SCHEMA Product
GO
CREATE SCHEMA Sales
GO


 -- Create Sequences

CREATE SEQUENCE Sequences.id_address AS INT START WITH 1 INCREMENT BY 1
CREATE SEQUENCE Sequences.id_person AS INT START WITH 1 INCREMENT BY 1
CREATE SEQUENCE Sequences.id_postcode AS INT START WITH 1 INCREMENT BY 1

CREATE SEQUENCE Sequences.id_product_extra AS INT START WITH 1 INCREMENT BY 1
CREATE SEQUENCE Sequences.id_product_heading AS INT START WITH 1 INCREMENT BY 1
CREATE SEQUENCE Sequences.id_product_option AS INT START WITH 1 INCREMENT BY 1
CREATE SEQUENCE Sequences.id_product AS INT START WITH 1 INCREMENT BY 1
CREATE SEQUENCE Sequences.id_product_product_extra AS INT START WITH 1 INCREMENT BY 1

CREATE SEQUENCE Sequences.id_order_product AS INT START WITH 1 INCREMENT BY 1
CREATE SEQUENCE Sequences.id_order_product_extra AS INT START WITH 1 INCREMENT BY 1
CREATE SEQUENCE Sequences.id_order AS INT START WITH 1 INCREMENT BY 1
CREATE SEQUENCE Sequences.id_transaction AS INT START WITH 1 INCREMENT BY 1

CREATE SEQUENCE Sequences.id_business_hour AS INT START WITH 1 INCREMENT BY 1
CREATE SEQUENCE Sequences.id_review AS INT START WITH 1 INCREMENT BY 1
CREATE SEQUENCE Sequences.id_store_application AS INT START WITH 1 INCREMENT BY 1
CREATE SEQUENCE Sequences.id_store AS INT START WITH 1 INCREMENT BY 1
CREATE SEQUENCE Sequences.id_store_person AS INT START WITH 1 INCREMENT BY 1