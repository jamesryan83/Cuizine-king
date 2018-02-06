CREATE TABLE Store.stores
(
	id_store INT NOT NULL CONSTRAINT DF_store_stores_id_store DEFAULT (NEXT VALUE FOR Sequences.id_store),
    id_address INT NOT NULL,
    logo NVARCHAR(256),
    name NVARCHAR(128) NOT NULL,
    description NVARCHAR(1024),
    email NVARCHAR(256),
	phone_number NVARCHAR(32),
    website NVARCHAR(256),
    facebook NVARCHAR(256),
    twitter NVARCHAR(256),
    abn NVARCHAR(16) NOT NULL,
    bank_name NVARCHAR(128),
    bank_bsb NVARCHAR(16),
    bank_account_name NVARCHAR(128),
    bank_account_number NVARCHAR(32),
    is_deleted BIT NOT NULL DEFAULT 0,
    is_deleted_email NVARCHAR(256),
    internal_notes NVARCHAR(256),
    updated_by INT NOT NULL,
	SysStartTime DateTime2 GENERATED ALWAYS AS ROW START,
	SysEndTime DateTime2 GENERATED ALWAYS AS ROW END,
    PERIOD FOR SYSTEM_TIME (SysStartTime, SysEndTime),
    CONSTRAINT PK_store_stores PRIMARY KEY CLUSTERED (id_store)
)
WITH
(
    SYSTEM_VERSIONING = ON (HISTORY_TABLE = Store.stores_history)
)
GO

ALTER TABLE Store.stores ADD CONSTRAINT FK_store_stores_app_addresses FOREIGN KEY (id_address) REFERENCES App.addresses (id_address)