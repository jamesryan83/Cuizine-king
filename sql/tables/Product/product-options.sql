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
GO

ALTER TABLE Product.product_options ADD CONSTRAINT FK_product_product_optionss_product_products FOREIGN KEY (id_product) REFERENCES Product.products (id_product)