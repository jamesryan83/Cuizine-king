CREATE TABLE Product.product_headings
(
	id_product_heading INT NOT NULL CONSTRAINT DF_product_product_headings_id_product_heading DEFAULT (NEXT VALUE FOR Sequences.id_product_heading),
    id_store INT NOT NULL,
	title NVARCHAR(32) NOT NULL,
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
GO

ALTER TABLE Product.product_headings ADD CONSTRAINT FK_product_product_headings_store_stores FOREIGN KEY (id_store) REFERENCES Store.stores (id_store)