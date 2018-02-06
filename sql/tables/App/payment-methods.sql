CREATE TABLE App.payment_methods
(
    id_payment_method TINYINT PRIMARY KEY NOT NULL,
    name NVARCHAR(16) NOT NULL,
    updated_by INT NOT NULL DEFAULT 1,
    created DateTime2 NOT NULL DEFAULT GETUTCDATE(),
	updated DateTime2 NOT NULL DEFAULT GETUTCDATE()
)
GO