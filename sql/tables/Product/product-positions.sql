CREATE TABLE Product.product_positions
(
	id_product_position INT NOT NULL CONSTRAINT DF_product_product_positions_id_product_position DEFAULT (NEXT VALUE FOR Sequences.id_product_position),
    id_product_heading INT NOT NULL,
    id_product INT NOT NULL,
    is_product BIT NOT NULL,
	updated_by INT NOT NULL,
    created DateTime2 NOT NULL DEFAULT GETUTCDATE(),
	updated DateTime2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT PK_store_reviews PRIMARY KEY CLUSTERED (id_review)
)
GO

ALTER TABLE Product.product_options ADD CONSTRAINT FK_product_product_optionss_product_products FOREIGN KEY (id_product) REFERENCES Product.products (id_product)