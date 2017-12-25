CREATE TABLE App.postcodes
(
    id_postcode INT NOT NULL CONSTRAINT DF_app_postcodes_id_postcode DEFAULT (NEXT VALUE FOR Sequences.id_postcode),
    postcode NVARCHAR(6) NOT NULL,
    suburb NVARCHAR(64) NOT NULL,
    state NVARCHAR(16) NOT NULL,
    latitude DECIMAL(9,4) NOT NULL,
    longitude DECIMAL(9,4) NOT NULL,
    updated_by INT NOT NULL DEFAULT 1,
    created DateTime2 NOT NULL DEFAULT GETUTCDATE(),
	updated DateTime2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT PK_app_postcodes PRIMARY KEY CLUSTERED (id_postcode),
    CONSTRAINT UQ_app_postcodes UNIQUE (postcode, suburb)
)
GO
