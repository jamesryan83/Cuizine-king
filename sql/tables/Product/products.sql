CREATE TABLE Product.products
(
	id_product INT NOT NULL CONSTRAINT DF_product_products_id_product DEFAULT (NEXT VALUE FOR Sequences.id_product),
    id_store INT NOT NULL,
	name NVARCHAR(128) NOT NULL,
	description NVARCHAR(256),
    store_notes NVARCHAR(256),
    delivery_available BIT NOT NULL DEFAULT 1,
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
GO

ALTER TABLE Product.products ADD CONSTRAINT FK_product_products_store_stores FOREIGN KEY (id_store) REFERENCES Store.stores (id_store)