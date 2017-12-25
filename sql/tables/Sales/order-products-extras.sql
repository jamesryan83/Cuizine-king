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
GO

ALTER TABLE Sales.order_products_extras ADD CONSTRAINT FK_sales_order_products_extras_sales_order_products FOREIGN KEY (id_order_product) REFERENCES Sales.order_products (id_order_product)