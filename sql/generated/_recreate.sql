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
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'App' AND TABLE_NAME = 'people')
BEGIN
ALTER TABLE App.people DROP CONSTRAINT FK_app_people_store_stores
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
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'Store' AND TABLE_NAME = 'stores')
BEGIN
ALTER TABLE Store.stores SET (SYSTEM_VERSIONING = OFF)
END
DROP TABLE IF EXISTS Store.stores
GO


 -- Drop Procedures

DROP PROCEDURE IF EXISTS people_create
DROP PROCEDURE IF EXISTS people_get
DROP PROCEDURE IF EXISTS people_validate_email
DROP PROCEDURE IF EXISTS reviews_get
DROP PROCEDURE IF EXISTS stores_create
DROP PROCEDURE IF EXISTS stores_delete
DROP PROCEDURE IF EXISTS stores_get
GO


 -- Reset Sequences

ALTER SEQUENCE Sequences.id_person RESTART WITH 1
ALTER SEQUENCE Sequences.id_address RESTART WITH 1
ALTER SEQUENCE Sequences.id_postcode RESTART WITH 1
ALTER SEQUENCE Sequences.id_order_type RESTART WITH 1
ALTER SEQUENCE Sequences.id_payment_method RESTART WITH 1
ALTER SEQUENCE Sequences.id_store RESTART WITH 1
ALTER SEQUENCE Sequences.id_business_hour RESTART WITH 1
ALTER SEQUENCE Sequences.id_review RESTART WITH 1
ALTER SEQUENCE Sequences.id_product RESTART WITH 1
ALTER SEQUENCE Sequences.id_product_heading RESTART WITH 1
ALTER SEQUENCE Sequences.id_product_option RESTART WITH 1
ALTER SEQUENCE Sequences.id_product_extra RESTART WITH 1
ALTER SEQUENCE Sequences.id_product_product_extra RESTART WITH 1
ALTER SEQUENCE Sequences.id_transaction RESTART WITH 1
ALTER SEQUENCE Sequences.id_order RESTART WITH 1
ALTER SEQUENCE Sequences.id_order_product RESTART WITH 1
ALTER SEQUENCE Sequences.id_order_product_extra RESTART WITH 1


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
    id_order_type TINYINT NOT NULL CONSTRAINT DF_app_order_types_id_order_type DEFAULT (NEXT VALUE FOR Sequences.id_order_type),
    name NVARCHAR(16) NOT NULL,
    updated_by INT NOT NULL DEFAULT 1,
    created DateTime2 NOT NULL DEFAULT GETUTCDATE(),
	updated DateTime2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT PK_app_order_types PRIMARY KEY CLUSTERED (id_order_type)
)


CREATE TABLE App.payment_methods
(
    id_payment_method TINYINT NOT NULL CONSTRAINT DF_app_payment_methods_id_payment_method DEFAULT (NEXT VALUE FOR Sequences.id_payment_method),
    name NVARCHAR(16) NOT NULL,
    updated_by INT NOT NULL DEFAULT 1,
    created DateTime2 NOT NULL DEFAULT GETUTCDATE(),
	updated DateTime2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT PK_app_payment_methods PRIMARY KEY CLUSTERED (id_payment_method)
)


-- Website users (customers), store owners/employees, and us
CREATE TABLE App.people
(
	id_person INT NOT NULL CONSTRAINT DF_app_people_id_person DEFAULT (NEXT VALUE FOR Sequences.id_person),
	id_address INT,
    first_name NVARCHAR(64) NOT NULL,
    last_name NVARCHAR(64) NOT NULL,
    email NVARCHAR(256) NOT NULL UNIQUE,
    phone_number NVARCHAR(32),
	password NVARCHAR(64) NOT NULL,
	reset_password_token NVARCHAR(64),
    jwt NVARCHAR(512),
    is_verified BIT NOT NULL DEFAULT 0,
    verification_token NVARCHAR(64),
    is_system_user BIT NOT NULL DEFAULT 0,
    is_web_user BIT NOT NULL DEFAULT 1,
    is_store_user BIT NOT NULL DEFAULT 0,
    id_store INT,
    is_deleted BIT NOT NULL DEFAULT 0,
    internal_notes NVARCHAR(256) SPARSE NULL,
	updated_by INT NOT NULL,
    created DateTime2 NOT NULL DEFAULT GETUTCDATE(),
	updated DateTime2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT PK_app_people PRIMARY KEY CLUSTERED (id_person)
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
    position_id_previous INT,
    position_id_next INT,
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


CREATE TABLE Store.stores
(
	id_store INT NOT NULL CONSTRAINT DF_store_stores_id_store DEFAULT (NEXT VALUE FOR Sequences.id_store),
    id_address INT NOT NULL,
    logo NVARCHAR(256) NOT NULL DEFAULT 'http://via.placeholder.com/350x350',
    name NVARCHAR(128) NOT NULL DEFAULT 'My Store',
    description NVARCHAR(1024),
    email NVARCHAR(256) NOT NULL,
	phone_number NVARCHAR(32),
    website NVARCHAR(256),
    facebook NVARCHAR(256),
    twitter NVARCHAR(256),
    abn NVARCHAR(16) NOT NULL,
    bank_name NVARCHAR(128) NOT NULL,
    bank_bsb NVARCHAR(16) NOT NULL,
    bank_account_name NVARCHAR(128) NOT NULL,
    bank_account_number NVARCHAR(32) NOT NULL,
    is_deleted BIT NOT NULL DEFAULT 0,
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
ALTER TABLE App.people ADD CONSTRAINT FK_app_people_store_stores FOREIGN KEY (id_store) REFERENCES Store.stores (id_store)
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
ALTER TABLE Store.stores ADD CONSTRAINT FK_store_stores_app_addresses FOREIGN KEY (id_address) REFERENCES App.addresses (id_address)
GO


 -- Create Stored Procedures

-- Create a person (not for store users)
CREATE PROCEDURE people_create
    @postcode NVARCHAR(6),
    @suburb NVARCHAR(64),

    @address_line_1 NVARCHAR(128),
	@address_line_2 NVARCHAR(128),
	@address_latitude DECIMAL(9,4),
    @address_longitude DECIMAL(9,4),

	@first_name NVARCHAR(64),
    @last_name NVARCHAR(64),
    @email NVARCHAR(256),
    @phone_number NVARCHAR(32),
	@password NVARCHAR(64),
    @jwt NVARCHAR(512),
    @is_verified BIT = 0,
    @verification_token NVARCHAR(64),
    @is_system_user BIT = 0,
    @is_web_user BIT = 1,
    @internal_notes NVARCHAR(256),

    @id_user_doing_update INT AS

    DECLARE @id_postcode INT
    DECLARE @newAddressId INT
    DECLARE @newPersonId INT

    SET NOCOUNT ON
    SET XACT_ABORT ON

    BEGIN TRANSACTION

        IF @is_system_user = 1 AND @is_web_user = 1
            THROW 50400, 'Invalid is_system_user or is_web_user.  Both values cannot be 1', 1

        IF @is_system_user = 0 AND @is_web_user = 0
            THROW 50400, 'Invalid is_system_user or is_web_user.  Values missing', 1

        -- stores need their own account, check if email already exists
        IF (SELECT TOP 1 email FROM App.people WHERE email = @email) IS NOT NULL
	       THROW 50409, 'Account already taken', 1

        IF (SELECT TOP 1 email FROM Store.stores WHERE email = @email) IS NOT NULL
	       THROW 50409, 'Account already taken', 1


        -- Get postcode id
        IF @postcode IS NOT NULL AND @suburb IS NOT NULL
        BEGIN
            SELECT @id_postcode = id_postcode FROM App.postcodes
            WHERE postcode = @postcode AND suburb = @suburb

            IF @id_postcode IS NULL THROW 50400, 'Invalid postcode or suburb', 1
        END

        -- create person address if supplied
        IF @id_postcode IS NOT NULL AND @address_line_1 IS NOT NULL
        BEGIN
            INSERT INTO App.addresses
                (id_postcode, line1, line2, latitude, longitude, updated_by)
                VALUES
                (@id_postcode, @address_line_1, @address_line_2, @address_latitude, @address_longitude, @id_user_doing_update)

            SET @newAddressId = (SELECT CONVERT(INT, current_value) FROM sys.sequences WHERE name = 'id_address')
        END

        -- create a store user
        INSERT INTO App.people
            (id_address, first_name, last_name, email, phone_number, password,
            jwt, is_verified, is_web_user, is_store_user, internal_notes, updated_by)
            VALUES
            (@newAddressId, @first_name, @last_name, @email, @phone_number, @password,
             @jwt, 1, 0, 1, @internal_notes, @id_user_doing_update)

    COMMIT
GO


-- Get a person by id or email
CREATE PROCEDURE people_get
	@id INT = -1,
	@email NVARCHAR(255) = '' AS

	IF @id = -1 AND @email = '' THROW 50400, 'Must provide id or email', 1

	SET NOCOUNT ON

	SELECT * FROM App.people
	WHERE id_person = @id OR email = @email
GO


-- Validate a persons email
CREATE PROCEDURE people_validate_email
	@email NVARCHAR(256),
	@verification_token NVARCHAR(64) AS

    DECLARE @id_person AS INT
    DECLARE @token AS NVARCHAR(64)

    SET NOCOUNT ON
    SET XACT_ABORT ON

    BEGIN TRANSACTION

        -- find person id
        SELECT @id_person = id_person, @token = verification_token FROM App.people
        WHERE email = @email OR email = @email

        IF @id_person IS NULL THROW 50400, 'Account not found', 1
        IF @verification_token <> @token THROW 50401, 'Invalid verification token', 1

        -- set person as validated
        UPDATE App.people SET is_verified = 1 WHERE id_person = @id_person

    COMMIT

GO


-- Get reviews for a store
CREATE PROCEDURE reviews_get
    @id_store INT AS

	SET NOCOUNT ON

    SELECT title, review, rating, created, updated
    FROM Store.reviews
    WHERE id_store = @id_store
GO


-- Create a store
-- creates an address, user and store
CREATE PROCEDURE stores_create
    @postcode NVARCHAR(6),
    @suburb NVARCHAR(64),

    @address_line_1 NVARCHAR(128),
	@address_line_2 NVARCHAR(128),
	@address_latitude DECIMAL(9,4),
    @address_longitude DECIMAL(9,4),

    @first_name NVARCHAR(64),
    @last_name NVARCHAR(64),
    @email NVARCHAR(256),
    @phone_number_user NVARCHAR(32),
	@password NVARCHAR(64),
    @jwt NVARCHAR(512),
    @internal_notes_user NVARCHAR(256),

    @logo NVARCHAR(255),
    @name NVARCHAR(128),
    @description NVARCHAR(1024),
	@phone_number_store NVARCHAR(32),
    @website NVARCHAR(256),
    @facebook NVARCHAR(256),
    @twitter NVARCHAR(256),
    @abn NVARCHAR(16),
    @internal_notes_store NVARCHAR(256),
    @bank_name NVARCHAR(128),
    @bank_bsb NVARCHAR(16),
    @bank_account_name NVARCHAR(128),
    @bank_account_number NVARCHAR(32),

    @hours_mon_dinein_open NVARCHAR(8),
    @hours_tue_dinein_open NVARCHAR(8),
    @hours_wed_dinein_open NVARCHAR(8),
    @hours_thu_dinein_open NVARCHAR(8),
    @hours_fri_dinein_open NVARCHAR(8),
    @hours_sat_dinein_open NVARCHAR(8),
    @hours_sun_dinein_open NVARCHAR(8),
    @hours_mon_dinein_close NVARCHAR(8),
    @hours_tue_dinein_close NVARCHAR(8),
    @hours_wed_dinein_close NVARCHAR(8),
    @hours_thu_dinein_close NVARCHAR(8),
    @hours_fri_dinein_close NVARCHAR(8),
    @hours_sat_dinein_close NVARCHAR(8),
    @hours_sun_dinein_close NVARCHAR(8),
    @hours_mon_delivery_open NVARCHAR(8),
    @hours_tue_delivery_open NVARCHAR(8),
    @hours_wed_delivery_open NVARCHAR(8),
    @hours_thu_delivery_open NVARCHAR(8),
    @hours_fri_delivery_open NVARCHAR(8),
    @hours_sat_delivery_open NVARCHAR(8),
    @hours_sun_delivery_open NVARCHAR(8),
    @hours_mon_delivery_close NVARCHAR(8),
    @hours_tue_delivery_close NVARCHAR(8),
    @hours_wed_delivery_close NVARCHAR(8),
    @hours_thu_delivery_close NVARCHAR(8),
    @hours_fri_delivery_close NVARCHAR(8),
    @hours_sat_delivery_close NVARCHAR(8),
    @hours_sun_delivery_close NVARCHAR(8),

    @id_user_doing_update INT AS

	SET NOCOUNT ON
    SET XACT_ABORT ON

    DECLARE @id_postcode INT
    DECLARE @newAddressId INT
    DECLARE @newPersonId INT
    DECLARE @newStoreId INT


    BEGIN TRANSACTION

        -- stores need their own account, check if email already exists
        IF (SELECT TOP 1 email FROM App.people WHERE email = @email) IS NOT NULL
	       THROW 50409, 'Invalid Email. Account already exists', 1

        IF (SELECT TOP 1 email FROM Store.stores WHERE email = @email) IS NOT NULL
	       THROW 50409, 'Invalid Email. Store Account already exists', 1


        -- Get postcode id
        SELECT @id_postcode = id_postcode FROM App.postcodes
        WHERE postcode = @postcode AND suburb = @suburb

        IF @id_postcode IS NULL THROW 50400, 'Invalid postcode or suburb', 1


        -- create store address
        INSERT INTO App.addresses
            (id_postcode, line1, line2, latitude, longitude, updated_by)
            VALUES
            (@id_postcode, @address_line_1, @address_line_2, @address_latitude, @address_longitude, @id_user_doing_update)

        SET @newAddressId = (SELECT CONVERT(INT, current_value) FROM sys.sequences WHERE name = 'id_address')


        -- create a store user
        INSERT INTO App.people
            (id_address, first_name, last_name, email, phone_number, password,
            jwt, is_verified, is_web_user, is_store_user, internal_notes, updated_by)
            VALUES
            (null, @first_name, @last_name, @email, @phone_number_user, @password,
             @jwt, 1, 0, 1, @internal_notes_user, @id_user_doing_update)

        SET @newPersonId = (SELECT CONVERT(INT, current_value) FROM sys.sequences WHERE name = 'id_person')


        -- create store
        INSERT INTO Store.stores
            (id_address, logo, name, description, email, phone_number, website,
             facebook, twitter, abn, bank_name, bank_bsb,
             bank_account_name, bank_account_number, internal_notes, updated_by)
            VALUES
            (@newAddressId, @logo, @name, @description, @email, @phone_number_store, @website,
             @facebook, @twitter, @abn, @bank_name, @bank_bsb,
             @bank_account_name, @bank_account_number, @internal_notes_store, @id_user_doing_update)

        SET @newStoreId = (SELECT CONVERT(INT, current_value) FROM sys.sequences WHERE name = 'id_store')


        -- Add the store id to the user that was created
        UPDATE App.people SET id_store = @newStoreId WHERE id_person = @newPersonId


        -- create store business hours
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 1, 1, @hours_mon_dinein_open, @hours_mon_dinein_close, @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 1, 2, @hours_tue_dinein_open, @hours_tue_dinein_close, @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 1, 3, @hours_wed_dinein_open, @hours_wed_dinein_close, @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 1, 4, @hours_thu_dinein_open, @hours_thu_dinein_close, @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 1, 5, @hours_fri_dinein_open, @hours_fri_dinein_close, @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 1, 6, @hours_sat_dinein_open, @hours_sat_dinein_close, @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 1, 7, @hours_sun_dinein_open, @hours_sun_dinein_close, @id_user_doing_update)

        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 0, 1, @hours_mon_delivery_open, @hours_mon_delivery_close, @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 0, 2, @hours_tue_delivery_open, @hours_tue_delivery_close, @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 0, 3, @hours_wed_delivery_open, @hours_wed_delivery_close, @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 0, 4, @hours_thu_delivery_open, @hours_thu_delivery_close, @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 0, 5, @hours_fri_delivery_open, @hours_fri_delivery_close, @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 0, 6, @hours_sat_delivery_open, @hours_sat_delivery_close, @id_user_doing_update)
        INSERT INTO Store.business_hours (id_store, dine_in_hours, day, opens, closes, updated_by)
            VALUES (@newStoreId, 0, 7, @hours_sun_delivery_open, @hours_sun_delivery_close, @id_user_doing_update)

    COMMIT

GO


-- Soft deletes a store
CREATE PROCEDURE stores_delete
    @id_store INT,
    @id_user_doing_update INT AS

    UPDATE Store.stores SET is_deleted = 1, updated_by = @id_user_doing_update
        WHERE id_store = @id_store
GO


-- Get a store
CREATE PROCEDURE stores_get
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
    WHERE s.id_store = @id_store
    FOR JSON PATH

GO