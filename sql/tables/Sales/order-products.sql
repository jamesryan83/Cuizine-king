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
GO

ALTER TABLE Sales.order_products ADD CONSTRAINT FK_sales_order_products_sales_orders FOREIGN KEY (id_order) REFERENCES Sales.orders (id_order)