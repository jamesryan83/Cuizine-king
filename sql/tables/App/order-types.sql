CREATE TABLE App.order_types
(
    id_order_type TINYINT NOT NULL CONSTRAINT DF_app_order_types_id_order_type DEFAULT (NEXT VALUE FOR Sequences.id_order_type),
    name NVARCHAR(16) NOT NULL,
    updated_by INT NOT NULL DEFAULT 1,
    created DateTime2 NOT NULL DEFAULT GETUTCDATE(),
	updated DateTime2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT PK_app_order_types PRIMARY KEY CLUSTERED (id_order_type)
)
GO