CREATE TABLE Store.store_applications
(
	id_store_application INT NOT NULL CONSTRAINT DF_store_applications_id_store_application DEFAULT (NEXT VALUE FOR Sequences.id_store_application),
    name NVARCHAR(128),
    email NVARCHAR(256),
    message NVARCHAR(256),
    is_completed BIT NOT NULL DEFAULT 0,
    is_cancelled BIT NOT NULL DEFAULT 0,
    internal_notes NVARCHAR(256),
    updated_by INT NOT NULL,
	created DateTime2 NOT NULL DEFAULT GETUTCDATE(),
	updated DateTime2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT id_store_application PRIMARY KEY CLUSTERED (id_store_application)
)
GO
