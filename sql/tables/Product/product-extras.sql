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
GO

ALTER TABLE Product.product_extras ADD CONSTRAINT FK_product_product_extras_store_stores FOREIGN KEY (id_store) REFERENCES Store.stores (id_store)