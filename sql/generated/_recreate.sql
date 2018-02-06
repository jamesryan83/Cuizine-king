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
DROP TABLE IF EXISTS App.person_types
DROP TABLE IF EXISTS App.postcodes
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'Product' AND TABLE_NAME = 'product_extras')
BEGIN
ALTER TABLE Product.product_extras SET (SYSTEM_VERSIONING = OFF)
END
DROP TABLE IF EXISTS Product.product_extras
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'Product' AND TABLE_NAME = 'product_headings')
BEGIN
ALTER TABLE Product.product_headings SET (SYSTEM_VERSIONING = OFF)
END
DROP TABLE IF EXISTS Product.product_headings
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'Product' AND TABLE_NAME = 'product_options')
BEGIN
ALTER TABLE Product.product_options SET (SYSTEM_VERSIONING = OFF)
END
DROP TABLE IF EXISTS Product.product_options
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'Product' AND TABLE_NAME = 'products_product_extras')
BEGIN
ALTER TABLE Product.products_product_extras SET (SYSTEM_VERSIONING = OFF)
END
DROP TABLE IF EXISTS Product.products_product_extras
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'Product' AND TABLE_NAME = 'products')
BEGIN
ALTER TABLE Product.products SET (SYSTEM_VERSIONING = OFF)
END
DROP TABLE IF EXISTS Product.products
DROP TABLE IF EXISTS Sales.order_products_extras
DROP TABLE IF EXISTS Sales.order_products
DROP TABLE IF EXISTS Sales.orders
DROP TABLE IF EXISTS Sales.transactions
DROP TABLE IF EXISTS sessions
DROP TABLE IF EXISTS Store.business_hours
DROP TABLE IF EXISTS Store.reviews
DROP TABLE IF EXISTS Store.store_applications
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'Store' AND TABLE_NAME = 'stores_people')
BEGIN
ALTER TABLE Store.stores_people SET (SYSTEM_VERSIONING = OFF)
END
DROP TABLE IF EXISTS Store.stores_people
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'Store' AND TABLE_NAME = 'stores')
BEGIN
ALTER TABLE Store.stores SET (SYSTEM_VERSIONING = OFF)
END
DROP TABLE IF EXISTS Store.stores
GO


 -- Reset Sequences

ALTER SEQUENCE Sequences.id_address RESTART WITH 1
ALTER SEQUENCE Sequences.id_person RESTART WITH 1
ALTER SEQUENCE Sequences.id_postcode RESTART WITH 1
ALTER SEQUENCE Sequences.id_product_extra RESTART WITH 1
ALTER SEQUENCE Sequences.id_product_heading RESTART WITH 1
ALTER SEQUENCE Sequences.id_product_option RESTART WITH 1
ALTER SEQUENCE Sequences.id_product RESTART WITH 1
ALTER SEQUENCE Sequences.id_product_product_extra RESTART WITH 1
ALTER SEQUENCE Sequences.id_order_product RESTART WITH 1
ALTER SEQUENCE Sequences.id_order_product_extra RESTART WITH 1
ALTER SEQUENCE Sequences.id_order RESTART WITH 1
ALTER SEQUENCE Sequences.id_transaction RESTART WITH 1
ALTER SEQUENCE Sequences.id_business_hour RESTART WITH 1
ALTER SEQUENCE Sequences.id_review RESTART WITH 1
ALTER SEQUENCE Sequences.id_store_application RESTART WITH 1
ALTER SEQUENCE Sequences.id_store RESTART WITH 1
ALTER SEQUENCE Sequences.id_store_person RESTART WITH 1
GO


 -- Create Tables

CREATE TABLE App.addresses
(
    id_address INT NOT NULL CONSTRAINT DF_app_addresses_id_address DEFAULT (NEXT VALUE FOR Sequences.id_address),
    id_postcode INT NOT NULL,
	line1 NVARCHAR(128) NOT NULL,
	line2 NVARCHAR(128),
    latitude DECIMAL(9,4),
    longitude DECIMAL(9,4),
    updated_by INT NOT NULL,
    created DateTime2 NOT NULL DEFAULT GETUTCDATE(),
	updated DateTime2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT PK_app_addresses PRIMARY KEY CLUSTERED (id_address)
)


CREATE TABLE App.order_types
(
    id_order_type TINYINT PRIMARY KEY NOT NULL,
    name NVARCHAR(16) NOT NULL,
    updated_by INT NOT NULL DEFAULT 1,
    created DateTime2 NOT NULL DEFAULT GETUTCDATE(),
	updated DateTime2 NOT NULL DEFAULT GETUTCDATE()
)


CREATE TABLE App.payment_methods
(
    id_payment_method TINYINT PRIMARY KEY NOT NULL,
    name NVARCHAR(16) NOT NULL,
    updated_by INT NOT NULL DEFAULT 1,
    created DateTime2 NOT NULL DEFAULT GETUTCDATE(),
	updated DateTime2 NOT NULL DEFAULT GETUTCDATE()
)


-- Website users (customers), store owners/employees, and us
CREATE TABLE App.people
(
	id_person INT NOT NULL CONSTRAINT DF_app_people_id_person DEFAULT (NEXT VALUE FOR Sequences.id_person),
    id_address INT,
    is_web_user BIT NOT NULL DEFAULT 1,
    is_store_user BIT NOT NULL DEFAULT 0,
    is_system_user BIT NOT NULL DEFAULT 0,
    first_name NVARCHAR(64) NOT NULL,
    last_name NVARCHAR(64) NOT NULL,
    email NVARCHAR(256) NOT NULL UNIQUE,
    phone_number NVARCHAR(32),
	password NVARCHAR(64) NOT NULL,
	reset_password_token NVARCHAR(64),
    jwt NVARCHAR(512),
    is_verified BIT NOT NULL DEFAULT 0,
    verification_token NVARCHAR(64) NOT NULL,
    is_deleted BIT NOT NULL DEFAULT 0,
    is_deleted_email NVARCHAR(256),
    internal_notes NVARCHAR(256) SPARSE NULL,
	updated_by INT NOT NULL,
    created DateTime2 NOT NULL DEFAULT GETUTCDATE(),
	updated DateTime2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT PK_app_people PRIMARY KEY CLUSTERED (id_person)
)


CREATE TABLE App.person_types
(
    id_person_type TINYINT PRIMARY KEY NOT NULL,
    name NVARCHAR(16) NOT NULL,
    updated_by INT NOT NULL DEFAULT 1,
    created DateTime2 NOT NULL DEFAULT GETUTCDATE(),
	updated DateTime2 NOT NULL DEFAULT GETUTCDATE()
)


CREATE TABLE App.postcodes
(
    id_postcode INT NOT NULL CONSTRAINT DF_app_postcodes_id_postcode DEFAULT (NEXT VALUE FOR Sequences.id_postcode),
    postcode NVARCHAR(6) NOT NULL,
    suburb NVARCHAR(64) NOT NULL,
    state NVARCHAR(16) NOT NULL,
    latitude DECIMAL(9,4) NOT NULL,
    longitude DECIMAL(9,4) NOT NULL,
    updated_by INT NOT NULL DEFAULT 1,
    created DateTime2 NOT NULL DEFAULT GETUTCDATE(),
	updated DateTime2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT PK_app_postcodes PRIMARY KEY CLUSTERED (id_postcode),
    CONSTRAINT UQ_app_postcodes UNIQUE (postcode, suburb)
)


CREATE TABLE Product.product_extras
(
	id_product_extra INT NOT NULL CONSTRAINT DF_product_product_extras_id_product_extra DEFAULT (NEXT VALUE FOR Sequences.id_product_extra),
    id_store INT NOT NULL,
	name NVARCHAR(128) NOT NULL,
	price SMALLMONEY NOT NULL DEFAULT 0,
    store_notes NVARCHAR(256),
    limit_per_product TINYINT NOT NULL DEFAULT 1,
    in_stock BIT NOT NULL DEFAULT 1,
    active BIT NOT NULL DEFAULT 1,
    position_id_previous INT,
    position_id_next INT,
    updated_by INT NOT NULL,
	SysStartTime DateTime2 GENERATED ALWAYS AS ROW START,
	SysEndTime DateTime2 GENERATED ALWAYS AS ROW END,
    PERIOD FOR SYSTEM_TIME (SysStartTime, SysEndTime),
    CONSTRAINT PK_product_product_extras PRIMARY KEY CLUSTERED (id_product_extra)
)
WITH
(
    SYSTEM_VERSIONING = ON (HISTORY_TABLE = Store.product_extras_history)
)


CREATE TABLE Product.product_headings
(
	id_product_heading INT NOT NULL CONSTRAINT DF_product_product_headings_id_product_heading DEFAULT (NEXT VALUE FOR Sequences.id_product_heading),
    id_store INT NOT NULL,
	title NVARCHAR(128) NOT NULL,
    subtitle NVARCHAR(256),
    above_product_id INT,
    updated_by INT NOT NULL,
	SysStartTime DateTime2 GENERATED ALWAYS AS ROW START,
	SysEndTime DateTime2 GENERATED ALWAYS AS ROW END,
    PERIOD FOR SYSTEM_TIME (SysStartTime, SysEndTime),
    CONSTRAINT PK_product_product_headings PRIMARY KEY CLUSTERED (id_product_heading)
)
WITH
(
    SYSTEM_VERSIONING = ON (HISTORY_TABLE = Product.product_headings_history)
)


CREATE TABLE Product.product_options
(
	id_product_option INT NOT NULL CONSTRAINT DF_product_product_options_id_product_option DEFAULT (NEXT VALUE FOR Sequences.id_product_option),
    id_product INT NOT NULL,
	name NVARCHAR(128) NOT NULL,
	store_notes NVARCHAR(256),
    price SMALLMONEY NOT NULL DEFAULT 0,
    limit_per_customer TINYINT NOT NULL DEFAULT 1,
    in_stock BIT NOT NULL DEFAULT 1,
    active BIT NOT NULL DEFAULT 1,
    position_id_previous INT,
    position_id_next INT,
	updated_by INT NOT NULL,
	SysStartTime DateTime2 GENERATED ALWAYS AS ROW START,
	SysEndTime DateTime2 GENERATED ALWAYS AS ROW END,
    PERIOD FOR SYSTEM_TIME (SysStartTime, SysEndTime),
    CONSTRAINT PK_product_product_options PRIMARY KEY CLUSTERED (id_product_option)
)
WITH
(
    SYSTEM_VERSIONING = ON (HISTORY_TABLE = Product.product_options_history)
)


CREATE TABLE Product.products_product_extras
(
	id_product_product_extra INT NOT NULL CONSTRAINT DF_product_products_product_extras_id_product_product_extra DEFAULT (NEXT VALUE FOR Sequences.id_product_product_extra),
    id_product INT NOT NULL,
	id_product_extra INT NOT NULL,
	updated_by INT NOT NULL,
	SysStartTime DateTime2 GENERATED ALWAYS AS ROW START,
	SysEndTime DateTime2 GENERATED ALWAYS AS ROW END,
    PERIOD FOR SYSTEM_TIME (SysStartTime, SysEndTime),
    CONSTRAINT PK_product_products_product_extras PRIMARY KEY CLUSTERED (id_product_product_extra)
)
WITH
(
    SYSTEM_VERSIONING = ON (HISTORY_TABLE = Product.products_product_extras_history)
)


CREATE TABLE Product.products
(
	id_product INT NOT NULL CONSTRAINT DF_product_products_id_product DEFAULT (NEXT VALUE FOR Sequences.id_product),
    id_store INT NOT NULL,
	name NVARCHAR(128) NOT NULL,
	description NVARCHAR(256),
    store_notes NVARCHAR(256),
    delivery_available BIT NOT NULL DEFAULT 1,
    gluten_free BIT NOT NULL DEFAULT 0,
    vegetarian BIT NOT NULL DEFAULT 0,
    in_stock BIT NOT NULL DEFAULT 1,
    active BIT NOT NULL DEFAULT 1,
    position_id_previous INT,
    position_id_next INT,
    updated_by INT NOT NULL,
	SysStartTime DateTime2 GENERATED ALWAYS AS ROW START,
	SysEndTime DateTime2 GENERATED ALWAYS AS ROW END,
    PERIOD FOR SYSTEM_TIME (SysStartTime, SysEndTime),
    CONSTRAINT PK_product_products PRIMARY KEY CLUSTERED (id_product)
)
WITH
(
    SYSTEM_VERSIONING = ON (HISTORY_TABLE = Product.products_history)
)


CREATE TABLE Sales.order_products_extras
(
	id_order_product_extra INT NOT NULL CONSTRAINT DF_sales_orders_products_id_order_product_extra DEFAULT (NEXT VALUE FOR Sequences.id_order_product_extra),
	id_order_product INT NOT NULL,
    product_extra_name NVARCHAR(128) NOT NULL,
    product_extra_price SMALLMONEY NOT NULL,
    product_extra_quantity TINYINT NOT NULL,
	created DateTime2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT PK_sales_orders_products PRIMARY KEY CLUSTERED (id_order_product)
)


CREATE TABLE Sales.order_products
(
	id_order_product INT NOT NULL CONSTRAINT DF_sales_orders_products_id_order_product DEFAULT (NEXT VALUE FOR Sequences.id_order_product),
	id_order INT NOT NULL,
    product_name NVARCHAR(128) NOT NULL,
    product_description NVARCHAR(256),
    product_option_name NVARCHAR(128),
    product_option_price SMALLMONEY NOT NULL,
    product_quantity TINYINT NOT NULL,
    customer_notes NVARCHAR(256) SPARSE NULL,
	created DateTime2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT PK_sales_order_products PRIMARY KEY CLUSTERED (id_order_product)
)


CREATE TABLE Sales.orders
(
	id_order INT NOT NULL CONSTRAINT DF_sales_orders_id_order DEFAULT (NEXT VALUE FOR Sequences.id_order),
	id_store INT NOT NULL,
    id_person INT NOT NULL,
	id_order_type TINYINT NOT NULL,
    notes NVARCHAR(256) SPARSE NULL,
    expiry DateTime2 NOT NULL,
    completed BIT NOT NULL DEFAULT 0,
    cancelled BIT NOT NULL DEFAULT 0,
    updated_by INT NOT NULL,
	created DateTime2 NOT NULL DEFAULT GETUTCDATE(),
	updated DateTime2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT PK_sales_orders PRIMARY KEY CLUSTERED (id_order)
)


CREATE TABLE Sales.transactions
(
	id_transaction INT NOT NULL CONSTRAINT DF_sales_transactions_id_transaction DEFAULT (NEXT VALUE FOR Sequences.id_transaction),
    id_order INT NOT NULL,
    id_person INT NOT NULL,
    id_store INT NOT NULL,
    id_payment_method TINYINT NOT NULL,
    commission DECIMAL(4,4) NOT NULL,
    commission_charged SMALLMONEY NOT NULL,
    processing_fee DECIMAL(4,4) NOT NULL,
    processing_fee_charged SMALLMONEY NOT NULL,
    amount_without_tax SMALLMONEY NOT NULL,
    tax_amount SMALLMONEY NOT NULL,
    transaction_amount SMALLMONEY NOT NULL,
	created DateTime2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT PK_sales_transactions PRIMARY KEY CLUSTERED (id_transaction)
)


-- mssql session table
CREATE TABLE sessions
(
	sid VARCHAR(255) NOT NULL PRIMARY KEY,
	session VARCHAR(MAX) NOT NULL,
	expires DateTime NOT NULL
)


CREATE TABLE Store.business_hours
(
	id_business_hour INT NOT NULL CONSTRAINT DF_store_business_hours_id_business_hour DEFAULT (NEXT VALUE FOR Sequences.id_business_hour),
    id_store INT NOT NULL,
    dine_in_hours BIT NOT NULL,
    day TINYINT NOT NULL, -- mon=1, sun=7
    opens NVARCHAR(8) NOT NULL,
    closes NVARCHAR(8) NOT NULL,
    updated_by INT NOT NULL,
	created DateTime2 NOT NULL DEFAULT GETUTCDATE(),
	updated DateTime2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT PK_store_business_hours PRIMARY KEY CLUSTERED (id_business_hour)
)


CREATE TABLE Store.reviews
(
	id_review INT NOT NULL CONSTRAINT DF_store_reviews_id_review DEFAULT (NEXT VALUE FOR Sequences.id_review),
    id_store INT NOT NULL,
    id_person INT NOT NULL,
    title NVARCHAR(128),
    review NVARCHAR(512),
    rating TINYINT NOT NULL,
    updated_by INT NOT NULL,
	created DateTime2 NOT NULL DEFAULT GETUTCDATE(),
	updated DateTime2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT PK_store_reviews PRIMARY KEY CLUSTERED (id_review)
)


CREATE TABLE Store.store_applications
(
	id_store_application INT NOT NULL CONSTRAINT DF_store_applications_id_store_application DEFAULT (NEXT VALUE FOR Sequences.id_store_application),
    name NVARCHAR(128),
    email NVARCHAR(256),
    message NVARCHAR(256),
    is_completed BIT NOT NULL DEFAULT 0,
    is_cancelled BIT NOT NULL DEFAULT 0,
    internal_notes NVARCHAR(256),
    updated_by INT NOT NULL,
	created DateTime2 NOT NULL DEFAULT GETUTCDATE(),
	updated DateTime2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT id_store_application PRIMARY KEY CLUSTERED (id_store_application)
)


CREATE TABLE Store.stores_people
(
	id_store_person INT NOT NULL CONSTRAINT DF_store_stores_people_id_store_person DEFAULT (NEXT VALUE FOR Sequences.id_store_person),
    id_store INT NOT NULL,
	id_person INT NOT NULL,
	updated_by INT NOT NULL,
	SysStartTime DateTime2 GENERATED ALWAYS AS ROW START,
	SysEndTime DateTime2 GENERATED ALWAYS AS ROW END,
    PERIOD FOR SYSTEM_TIME (SysStartTime, SysEndTime),
    CONSTRAINT PK_store_stores_people PRIMARY KEY CLUSTERED (id_store_person)
)
WITH
(
    SYSTEM_VERSIONING = ON (HISTORY_TABLE = Store.stores_people_history)
)


CREATE TABLE Store.stores
(
	id_store INT NOT NULL CONSTRAINT DF_store_stores_id_store DEFAULT (NEXT VALUE FOR Sequences.id_store),
    id_address INT NOT NULL,
    logo NVARCHAR(256),
    name NVARCHAR(128) NOT NULL,
    description NVARCHAR(1024),
    email NVARCHAR(256),
	phone_number NVARCHAR(32),
    website NVARCHAR(256),
    facebook NVARCHAR(256),
    twitter NVARCHAR(256),
    abn NVARCHAR(16) NOT NULL,
    bank_name NVARCHAR(128),
    bank_bsb NVARCHAR(16),
    bank_account_name NVARCHAR(128),
    bank_account_number NVARCHAR(32),
    is_deleted BIT NOT NULL DEFAULT 0,
    is_deleted_email NVARCHAR(256),
    internal_notes NVARCHAR(256),
    updated_by INT NOT NULL,
	SysStartTime DateTime2 GENERATED ALWAYS AS ROW START,
	SysEndTime DateTime2 GENERATED ALWAYS AS ROW END,
    PERIOD FOR SYSTEM_TIME (SysStartTime, SysEndTime),
    CONSTRAINT PK_store_stores PRIMARY KEY CLUSTERED (id_store)
)
WITH
(
    SYSTEM_VERSIONING = ON (HISTORY_TABLE = Store.stores_history)
)


 -- Create Constraints

ALTER TABLE App.addresses ADD CONSTRAINT FK_app_addresses_app_postcodes FOREIGN KEY (id_postcode) REFERENCES App.postcodes (id_postcode)
ALTER TABLE App.people ADD CONSTRAINT FK_app_people_app_addresses FOREIGN KEY (id_address) REFERENCES App.addresses (id_address)
ALTER TABLE Product.product_extras ADD CONSTRAINT FK_product_product_extras_store_stores FOREIGN KEY (id_store) REFERENCES Store.stores (id_store)
ALTER TABLE Product.product_headings ADD CONSTRAINT FK_product_product_headings_store_stores FOREIGN KEY (id_store) REFERENCES Store.stores (id_store)
ALTER TABLE Product.product_options ADD CONSTRAINT FK_product_product_optionss_product_products FOREIGN KEY (id_product) REFERENCES Product.products (id_product)
ALTER TABLE Product.products_product_extras ADD CONSTRAINT FK_product_products_product_extras_product_products FOREIGN KEY (id_product) REFERENCES Product.products (id_product)
ALTER TABLE Product.products_product_extras ADD CONSTRAINT FK_product_products_product_extras_product_product_extras FOREIGN KEY (id_product_extra) REFERENCES Product.product_extras (id_product_extra)
ALTER TABLE Product.products ADD CONSTRAINT FK_product_products_store_stores FOREIGN KEY (id_store) REFERENCES Store.stores (id_store)
ALTER TABLE Sales.order_products_extras ADD CONSTRAINT FK_sales_order_products_extras_sales_order_products FOREIGN KEY (id_order_product) REFERENCES Sales.order_products (id_order_product)
ALTER TABLE Sales.order_products ADD CONSTRAINT FK_sales_order_products_sales_orders FOREIGN KEY (id_order) REFERENCES Sales.orders (id_order)
ALTER TABLE Sales.orders ADD CONSTRAINT FK_sales_orders_store_stores FOREIGN KEY (id_store) REFERENCES Store.stores (id_store)
ALTER TABLE Sales.orders ADD CONSTRAINT FK_sales_orders_app_people FOREIGN KEY (id_person) REFERENCES App.people (id_person)
ALTER TABLE Sales.orders ADD CONSTRAINT FK_sales_orders_app_order_types FOREIGN KEY (id_order_type) REFERENCES App.order_types (id_order_type)
ALTER TABLE Sales.transactions ADD CONSTRAINT FK_sales_transactions_sales_orders FOREIGN KEY (id_order) REFERENCES Sales.orders (id_order)
ALTER TABLE Sales.transactions ADD CONSTRAINT FK_sales_transactions_app_people FOREIGN KEY (id_person) REFERENCES App.people (id_person)
ALTER TABLE Sales.transactions ADD CONSTRAINT FK_sales_transactions_store_stores FOREIGN KEY (id_store) REFERENCES Store.stores (id_store)
ALTER TABLE Sales.transactions ADD CONSTRAINT FK_sales_transactions_app_payment_methods FOREIGN KEY (id_payment_method) REFERENCES App.payment_methods (id_payment_method)
ALTER TABLE Store.business_hours ADD CONSTRAINT FK_store_business_hours_store_stores FOREIGN KEY (id_store) REFERENCES Store.stores (id_store)
ALTER TABLE Store.reviews ADD CONSTRAINT FK_store_reviews_storestore_stores FOREIGN KEY (id_store) REFERENCES Store.stores (id_store)
ALTER TABLE Store.reviews ADD CONSTRAINT FK_store_reviews_app_people FOREIGN KEY (id_person) REFERENCES App.people (id_person)
ALTER TABLE Store.stores_people ADD CONSTRAINT FK_store_stores_people_store_stores FOREIGN KEY (id_store) REFERENCES Store.stores (id_store)
ALTER TABLE Store.stores_people ADD CONSTRAINT FK_store_stores_people_app_people FOREIGN KEY (id_person) REFERENCES App.people (id_person)
ALTER TABLE Store.stores ADD CONSTRAINT FK_store_stores_app_addresses FOREIGN KEY (id_address) REFERENCES App.addresses (id_address)
GO


 -- Create Functions


-- Returns the current sequence id value
CREATE OR ALTER FUNCTION get_sequence_value(@name AS NVARCHAR(128))
RETURNS INT AS
BEGIN
    RETURN (SELECT CAST(current_value AS INT) FROM sys.sequences WHERE name = @name)
END
GO




 -- Create Stored Procedures

-- Create a store user
CREATE OR ALTER PROCEDURE people_create_store_user
    @id_store INT,
	@first_name NVARCHAR(64),
    @last_name NVARCHAR(64),
    @email NVARCHAR(256),
	@password NVARCHAR(64),
    @verification_token NVARCHAR(64),
    @id_user_doing_update INT,
    @newPersonId INT OUTPUT AS

    SET NOCOUNT ON
    SET XACT_ABORT ON

    BEGIN TRANSACTION

        DECLARE @is_web_user BIT
        DECLARE @is_store_user BIT
        DECLARE @is_system_user BIT


        SELECT @is_store_user = is_store_user, @is_system_user = is_system_user FROM App.people
            WHERE id_person = @id_user_doing_update AND is_deleted = 0


        -- not a store or system user
        IF (@is_store_user = 0) THROW 50401, 'Not authorized', 1


        -- does the store exist
        IF (SELECT TOP 1 id_store FROM Store.stores WHERE id_store = @id_store AND is_deleted = 0) IS NULL
            THROW 50400, 'Store not found', 1


        -- if a store_user, check if user doing update is member of the store
        IF (@is_system_user = 0)
        BEGIN
            IF (SELECT TOP 1 id_person FROM Store.stores_people WHERE id_store = @id_store AND id_person = @id_user_doing_update) IS NULL
                THROW 50401, 'Not authorized', 1
        END


        -- check account isn't already taken
        IF (SELECT TOP 1 email FROM App.people WHERE email = @email AND is_deleted = 0) IS NOT NULL
            THROW 50409, 'Account already taken', 1


        -- create user
        INSERT INTO App.people
            (is_web_user, is_store_user, is_system_user, first_name, last_name, email, password, verification_token, updated_by)
            VALUES
            (1, 1, 0, @first_name, @last_name, @email, @password, @verification_token, @id_user_doing_update)


        -- output value
        SET @newPersonId = dbo.get_sequence_value('id_person')


        -- create link to store
        INSERT INTO Store.stores_people (id_store, id_person, updated_by) VALUES (@id_store, @newPersonId, @id_user_doing_update)

    COMMIT
GO


-- Create a system user
CREATE OR ALTER PROCEDURE people_create_system_user
    @email NVARCHAR(256),
	@password NVARCHAR(64),
    @verification_token NVARCHAR(64),
    @id_user_doing_update INT,
    @newPersonId INT OUTPUT AS

    SET NOCOUNT ON
    SET XACT_ABORT ON

    BEGIN TRANSACTION

        -- check if user doing update is a system user
        IF (SELECT TOP 1 id_person FROM App.people
            WHERE id_person = @id_user_doing_update AND is_system_user = 1 AND is_deleted = 0) IS NULL
            THROW 50401, 'Not authorized', 1

        -- check account isn't already taken
        IF (SELECT TOP 1 email FROM App.people WHERE email = @email AND is_deleted = 0) IS NOT NULL
            THROW 50409, 'Account already taken', 1

        -- create a user
        INSERT INTO App.people
            (is_web_user, is_store_user, is_system_user, first_name, last_name,
             verification_token, email, password, updated_by)
            VALUES
            (1, 1, 1, 'na', 'na',
             @verification_token, @email, @password, @id_user_doing_update)

        -- output value
        SET @newPersonId = dbo.get_sequence_value('id_person')

    COMMIT
GO


-- Create a web user
CREATE OR ALTER PROCEDURE people_create_web_user
	@first_name NVARCHAR(64),
    @last_name NVARCHAR(64),
    @email NVARCHAR(256),
	@password NVARCHAR(64),
    @verification_token NVARCHAR(64),
    @newPersonId INT OUTPUT AS

    SET NOCOUNT ON
    SET XACT_ABORT ON

    BEGIN TRANSACTION

        IF (SELECT TOP 1 email FROM App.people WHERE email = @email AND is_deleted = 0) IS NOT NULL
            THROW 50409, 'Account already taken', 1

        -- create a user
        INSERT INTO App.people
            (is_web_user, is_store_user, is_system_user, first_name, last_name, email, password, verification_token, updated_by)
            VALUES
            (1, 0, 0, @first_name, @last_name, @email, @password, @verification_token, 3)

        -- output value
        SET @newPersonId = dbo.get_sequence_value('id_person')

    COMMIT
GO


-- Get a person by email
CREATE OR ALTER PROCEDURE people_get_by_email
	@email NVARCHAR(256),
    @alsoGetStoreId BIT = 0 AS

    IF @alsoGetStoreId = 1
        SELECT App.people.*, Store.stores_people.id_store FROM App.people
        JOIN Store.stores_people ON App.people.id_person = Store.stores_people.id_person
        WHERE App.people.email = @email AND App.people.is_deleted = 0
    ELSE
        SELECT * FROM App.people
        WHERE email = @email AND is_deleted = 0
GO


-- Get a person by id
CREATE OR ALTER PROCEDURE people_get_by_id
	@id INT AS

    SELECT * FROM App.people
    WHERE id_person = @id AND is_deleted = 0
GO


-- Get a person by jwt
CREATE OR ALTER PROCEDURE people_get_by_jwt
	@jwt NVARCHAR(512),
	@id_person INT AS

    IF @jwt IS NULL OR LEN(@jwt) < 30 THROW 50400, 'Bad token', 1

	SET NOCOUNT ON

    DECLARE @jwt_person AS NVARCHAR(512)

	SELECT @jwt_person = jwt
    FROM App.people
	WHERE id_person = @id_person AND is_deleted = 0

    IF @jwt <> @jwt_person THROW 50401, 'Invalid token', 1

    SELECT * FROM App.people
    WHERE id_person = @id_person
GO


-- Invalidate a jwt
CREATE OR ALTER PROCEDURE people_invalidate_jwt
	@jwt NVARCHAR(512) AS

    UPDATE App.people SET jwt = '' WHERE jwt = @jwt

    IF @@ROWCOUNT = 0 THROW 50400, 'Account not found', 1
GO


-- Update is verified
CREATE OR ALTER PROCEDURE people_update_is_verified
	@email NVARCHAR(256),
	@verification_token NVARCHAR(64) AS

    DECLARE @id_person AS INT
    DECLARE @token AS NVARCHAR(64)
    DECLARE @is_verified AS BIT = 0

    SET NOCOUNT ON
    SET XACT_ABORT ON

    BEGIN TRANSACTION

        -- find person id
        SELECT @id_person = id_person, @token = verification_token, @is_verified = is_verified
        FROM App.people
        WHERE email = @email AND is_deleted = 0

        IF @id_person IS NULL THROW 50400, 'Account not found', 1

        IF @is_verified = 1 THROW 50400, 'Account already verified', 1

        IF @verification_token <> @token THROW 50401, 'Invalid token', 1

        SET NOCOUNT OFF

        -- set person as verified
        UPDATE App.people SET is_verified = 1 WHERE id_person = @id_person

    COMMIT

GO


-- Update a persons jwt
CREATE OR ALTER PROCEDURE people_update_jwt
	@id_person INT,
    @jwt NVARCHAR(512) AS

    SET NOCOUNT ON

    IF (SELECT TOP 1 id_person FROM App.people
       WHERE id_person = @id_person AND is_deleted = 0) IS NULL
       THROW 50400, 'Account not found', 1

	UPDATE App.people SET jwt = @jwt
	WHERE id_person = @id_person

    SELECT id_person, is_web_user, is_store_user, is_system_user FROM App.people
    WHERE id_person = @id_person
GO


-- Update password
CREATE OR ALTER PROCEDURE people_update_password
	@email NVARCHAR(256),
	@reset_password_token NVARCHAR(64),
    @password NVARCHAR (64) AS

    IF @reset_password_token IS NULL OR LEN(@reset_password_token) < 64 THROW 50400, 'Bad token', 1

    DECLARE @person_reset_password_token AS NVARCHAR(64)
    DECLARE @id_person AS INT

    SELECT @id_person = id_person, @person_reset_password_token = reset_password_token
        FROM App.people WHERE email = @email AND is_deleted = 0

    IF @id_person IS NULL THROW 50400, 'Account not found', 1

    IF @person_reset_password_token <> @reset_password_token THROW 50401, 'Invalid token', 1

    UPDATE App.people SET password = @password WHERE id_person = @id_person
GO


-- Update reset password token
CREATE OR ALTER PROCEDURE people_update_reset_password_token
	@email NVARCHAR(512),
    @reset_password_token NVARCHAR(64) AS

    DECLARE @id_person AS INT
    DECLARE @is_verified AS BIT

    SELECT @id_person = id_person, @is_verified = is_verified
    FROM App.people
    WHERE email = @email AND is_deleted = 0

    IF @@ROWCOUNT = 0 THROW 50400, 'Account not found', 1

    IF @is_verified = 0 THROW 50400, 'Please verify your account', 1

    UPDATE App.people
    SET reset_password_token = @reset_password_token
    WHERE id_person = @id_person
GO


-- Get reviews for a store
CREATE OR ALTER PROCEDURE reviews_get
    @id_store INT AS

	SET NOCOUNT ON

    SELECT title, review, rating, created, updated
    FROM Store.reviews
    WHERE id_store = @id_store
GO


-- Create a store
-- creates an address, user and store
CREATE OR ALTER PROCEDURE store_applications_create
    @name NVARCHAR(128),
    @email NVARCHAR(256),
    @message NVARCHAR(256),
    @id_user_doing_update INT,
    @newStoreApplicationId INT OUTPUT AS

	SET NOCOUNT ON
    SET XACT_ABORT ON

    BEGIN TRANSACTION

        -- only system users can create store applications
        IF (SELECT TOP 1 id_person FROM App.people WHERE id_person = @id_user_doing_update AND is_system_user = 1 AND is_deleted = 0) IS NULL
            THROW 50401, 'Not authorized', 1


        -- create store application
        INSERT INTO Store.store_applications
            (name, email, message, updated_by)
            VALUES
            (@name, @email, @message, @id_user_doing_update)


        SET @newStoreApplicationId = dbo.get_sequence_value('id_store_application')
    COMMIT

GO


-- Create a store
-- creates an address, user and store
CREATE OR ALTER PROCEDURE stores_create
    @postcode NVARCHAR(6),
    @suburb NVARCHAR(64),

    @address_line_1 NVARCHAR(128),
	@address_line_2 NVARCHAR(128),

    @first_name NVARCHAR(64),
    @last_name NVARCHAR(64),
    @phone_number_user NVARCHAR(32),
    @email_user NVARCHAR(256),
	@password NVARCHAR(64),
    @verification_token NVARCHAR(64),

    @name NVARCHAR(128),
    @abn NVARCHAR(16),
    @internal_notes_store NVARCHAR(256),

    @id_user_doing_update INT,
    @newStoreId INT OUTPUT,
    @newPersonId INT OUTPUT AS

	SET NOCOUNT ON
    SET XACT_ABORT ON

    DECLARE @id_postcode INT
    DECLARE @newAddressId INT


    BEGIN TRANSACTION

        -- only system users can create stores
        IF (SELECT TOP 1 id_person FROM App.people WHERE id_person = @id_user_doing_update AND is_system_user = 1 AND is_deleted = 0) IS NULL
            THROW 50401, 'Not authorized', 1


        -- stores need an initial user account, check if email already exists
        IF (SELECT TOP 1 email FROM App.people WHERE email = @email_user AND is_deleted = 0) IS NOT NULL
            THROW 50409, 'Account already taken', 1


        -- Get postcode id
        SELECT @id_postcode = id_postcode FROM App.postcodes
        WHERE postcode = @postcode AND suburb = @suburb

        IF @id_postcode IS NULL THROW 50400, 'Invalid postcode or suburb', 1


        -- create store address
        INSERT INTO App.addresses
            (id_postcode, line1, line2, updated_by)
            VALUES
            (@id_postcode, @address_line_1, @address_line_2, @id_user_doing_update)

        SET @newAddressId = dbo.get_sequence_value('id_address')


        -- create a store user
        INSERT INTO App.people
            (is_web_user, is_store_user, is_system_user, id_address, first_name, last_name,
             email, phone_number, password, verification_token, updated_by)
            VALUES
            (1, 1, 0, null, @first_name, @last_name,
             @email_user, @phone_number_user, @password, @verification_token, @id_user_doing_update)

        SET @newPersonId = dbo.get_sequence_value('id_person')


        -- Create store
        INSERT INTO Store.stores
            (id_address, name, email, abn, internal_notes, updated_by)
            VALUES
            (@newAddressId, @name, @email_user, @abn, @internal_notes_store, @id_user_doing_update)

        SET @newStoreId = dbo.get_sequence_value('id_store')


        -- Link new user to new store
        INSERT INTO Store.stores_people (id_store, id_person, updated_by) VALUES (@newStoreID, @newPersonId, @id_user_doing_update)


        -- create default store business hours
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 1, 1, '10:00', '22:00', @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 1, 2, '10:00', '22:00', @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 1, 3, '10:00', '22:00', @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 1, 4, '10:00', '22:00', @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 1, 5, '10:00', '22:00', @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 1, 6, '10:00', '22:00', @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 1, 7, '10:00', '22:00', @id_user_doing_update)

        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 0, 1, '10:00', '22:00', @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 0, 2, '10:00', '22:00', @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 0, 3, '10:00', '22:00', @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 0, 4, '10:00', '22:00', @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 0, 5, '10:00', '22:00', @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 0, 6, '10:00', '22:00', @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 0, 7, '10:00', '22:00', @id_user_doing_update)

    COMMIT

GO


-- Soft deletes a store
CREATE OR ALTER PROCEDURE stores_delete
    @id_store INT,
    @id_user_doing_update INT AS

    SET NOCOUNT ON
    SET XACT_ABORT ON

    DECLARE @email NVARCHAR(255)

    BEGIN TRANSACTION

        -- only system users can delete stores
        IF (SELECT TOP 1 id_person FROM App.people WHERE id_person = @id_user_doing_update AND is_system_user = 1 AND is_deleted = 0) IS NULL
            THROW 50401, 'Not authorized', 1

        -- Get store email
        SELECT @email = email FROM Store.stores WHERE id_store = @id_store and is_deleted = 0

        IF @email IS NULL THROW 50400, 'Store not found', 1

        -- Set store deleted
        UPDATE Store.stores SET is_deleted = 1, is_deleted_email = @email, email = @id_store, updated_by = @id_user_doing_update
            WHERE id_store = @id_store

        -- TODO : delete users too
        -- Set user deleted
        -- UPDATE App.people SET is_deleted = 1, is_deleted_email = @email, email = @id_store, updated_by = @id_user_doing_update
            -- WHERE id_store = @id_store

    COMMIT
GO


-- Get a store
CREATE OR ALTER PROCEDURE stores_get
    @id_store INT AS

    SELECT id_store, name, description, phone_number, email, logo,

        -- addresses
        (SELECT a.id_address, a.line1, a.line2, a.latitude AS address_latitude, a.longitude AS address_longitude,
        pc.id_postcode, pc.postcode, pc.suburb, pc.state, pc.latitude AS postcode_latitude, pc.longitude AS postcode_longitude
        FROM App.addresses a
        JOIN App.postcodes pc ON pc.id_postcode = a.id_postcode
        WHERE a.id_address = s.id_address FOR JSON PATH) AS 'address',

        -- hours
        (SELECT bh.id_business_hour, bh.day, bh.dine_in_hours, bh.opens, bh.closes
        FROM Store.business_hours bh
        WHERE bh.id_store = @id_store FOR JSON PATH) AS 'hours',

        -- reviews
        (SELECT COUNT(*)
        FROM Store.reviews r
        WHERE r.id_store = @id_store) AS 'review_count',

        -- products and product options
        (SELECT pr.id_product, pr.name, pr.description, pr.store_notes, pr.delivery_available,
         pr.gluten_free, pr.vegetarian, pr.in_stock, pr.position_id_previous, pr.position_id_next,
             (SELECT po.id_product_option, po.id_product, po.name, po.store_notes, po.price, po.limit_per_customer,
              po.in_stock, po.position_id_previous, po.position_id_next
              FROM Product.product_options po
              WHERE po.id_product = pr.id_product FOR JSON PATH) AS 'options'
         FROM Product.products pr
         WHERE pr.id_store = @id_store AND pr.active = 1 FOR JSON PATH) AS 'products',

        -- product extras
        (SELECT pe.id_product_extra, pe.name, pe.price, pe.store_notes, pe.limit_per_product,
         pe.in_stock, pe.position_id_previous, pe.position_id_next
         FROM Product.product_extras pe
         WHERE pe.id_store = @id_store AND pe.active = 1 FOR JSON PATH) AS 'product_extras'

    FROM Store.stores AS s
    WHERE s.id_store = @id_store AND is_deleted = 0
    FOR JSON PATH

GO


-- Undeletes a deleted store
CREATE OR ALTER PROCEDURE stores_undelete
    @id_store INT,
    @id_user_doing_update INT AS

    SET NOCOUNT ON
    SET XACT_ABORT ON

    DECLARE @email NVARCHAR(256)

    BEGIN TRANSACTION

        -- Get store email
        SELECT @email = email FROM Store.stores WHERE id_store = @id_store and is_deleted = 0

        IF @email IS NULL THROW 50400, 'Store not found', 1

        -- Set store deleted
        UPDATE Store.stores SET is_deleted = 1, is_deleted_email = @email, email = @id_store, updated_by = @id_user_doing_update
            WHERE id_store = @id_store

        -- TODO : undelete users too
        -- Set user deleted
        -- UPDATE App.people SET is_deleted = 1, is_deleted_email = @email, email = @id_store, updated_by = @id_user_doing_update
            -- WHERE id_store = @id_store

    COMMIT
GO