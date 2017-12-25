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
GO

ALTER TABLE Product.products_product_extras ADD CONSTRAINT FK_product_products_product_extras_product_products FOREIGN KEY (id_product) REFERENCES Product.products (id_product)
ALTER TABLE Product.products_product_extras ADD CONSTRAINT FK_product_products_product_extras_product_product_extras FOREIGN KEY (id_product_extra) REFERENCES Product.product_extras (id_product_extra)