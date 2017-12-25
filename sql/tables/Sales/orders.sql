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
GO

ALTER TABLE Sales.orders ADD CONSTRAINT FK_sales_orders_store_stores FOREIGN KEY (id_store) REFERENCES Store.stores (id_store)
ALTER TABLE Sales.orders ADD CONSTRAINT FK_sales_orders_app_people FOREIGN KEY (id_person) REFERENCES App.people (id_person)
ALTER TABLE Sales.orders ADD CONSTRAINT FK_sales_orders_app_order_types FOREIGN KEY (id_order_type) REFERENCES App.order_types (id_order_type)