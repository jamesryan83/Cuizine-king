CREATE TABLE App.payment_methods
(
    id_payment_method TINYINT NOT NULL CONSTRAINT DF_app_payment_methods_id_payment_method DEFAULT (NEXT VALUE FOR Sequences.id_payment_method),
    name NVARCHAR(16) NOT NULL,
    updated_by INT NOT NULL DEFAULT 1,
    created DateTime2 NOT NULL DEFAULT GETUTCDATE(),
	updated DateTime2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT PK_app_payment_methods PRIMARY KEY CLUSTERED (id_payment_method)
)
GO