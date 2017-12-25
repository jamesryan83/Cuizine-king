CREATE TABLE App.addresses
(
    id_address INT NOT NULL CONSTRAINT DF_app_addresses_id_address DEFAULT (NEXT VALUE FOR Sequences.id_address),
    id_postcode INT NOT NULL,
	line1 NVARCHAR(128) NOT NULL,
	line2 NVARCHAR(128),
    latitude DECIMAL(9,4),
    longitude DECIMAL(9,4),
    updated_by INT NOT NULL,
    created DateTime2 NOT NULL DEFAULT GETUTCDATE(),
	updated DateTime2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT PK_app_addresses PRIMARY KEY CLUSTERED (id_address)
)
GO

ALTER TABLE App.addresses ADD CONSTRAINT FK_app_addresses_app_postcodes FOREIGN KEY (id_postcode) REFERENCES App.postcodes (id_postcode)