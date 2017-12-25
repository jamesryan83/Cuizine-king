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
GO

ALTER TABLE Sales.transactions ADD CONSTRAINT FK_sales_transactions_sales_orders FOREIGN KEY (id_order) REFERENCES Sales.orders (id_order)
ALTER TABLE Sales.transactions ADD CONSTRAINT FK_sales_transactions_app_people FOREIGN KEY (id_person) REFERENCES App.people (id_person)
ALTER TABLE Sales.transactions ADD CONSTRAINT FK_sales_transactions_store_stores FOREIGN KEY (id_store) REFERENCES Store.stores (id_store)
ALTER TABLE Sales.transactions ADD CONSTRAINT FK_sales_transactions_app_payment_methods FOREIGN KEY (id_payment_method) REFERENCES App.payment_methods (id_payment_method)