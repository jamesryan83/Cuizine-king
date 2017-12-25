CREATE TABLE Store.business_hours
(
	id_business_hour INT NOT NULL CONSTRAINT DF_store_business_hours_id_business_hour DEFAULT (NEXT VALUE FOR Sequences.id_business_hour),
    id_store INT NOT NULL,
    dine_in_hours BIT NOT NULL,
    day TINYINT NOT NULL, -- mon=1, sun=7
    opens NVARCHAR(8) NOT NULL,
    closes NVARCHAR(8) NOT NULL,
    updated_by INT NOT NULL,
	created DateTime2 NOT NULL DEFAULT GETUTCDATE(),
	updated DateTime2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT PK_store_business_hours PRIMARY KEY CLUSTERED (id_business_hour)
)
GO

ALTER TABLE Store.business_hours ADD CONSTRAINT FK_store_business_hours_store_stores FOREIGN KEY (id_store) REFERENCES Store.stores (id_store)