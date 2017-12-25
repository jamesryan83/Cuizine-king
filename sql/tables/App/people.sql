-- Website users (customers), store owners/employees, and us
CREATE TABLE App.people
(
	id_person INT NOT NULL CONSTRAINT DF_app_people_id_person DEFAULT (NEXT VALUE FOR Sequences.id_person),
	id_address INT,
    first_name NVARCHAR(64) NOT NULL,
    last_name NVARCHAR(64) NOT NULL,
    email NVARCHAR(256) NOT NULL UNIQUE,
    phone_number NVARCHAR(32),
	password NVARCHAR(64) NOT NULL,
	reset_password_token NVARCHAR(64),
    jwt NVARCHAR(512),
    is_verified BIT NOT NULL DEFAULT 0,
    verification_token NVARCHAR(64),
    is_system_user BIT NOT NULL DEFAULT 0,
    is_web_user BIT NOT NULL DEFAULT 1,
    is_store_user BIT NOT NULL DEFAULT 0,
    id_store INT,
    is_deleted BIT NOT NULL DEFAULT 0,
    internal_notes NVARCHAR(256) SPARSE NULL,
	updated_by INT NOT NULL,
    created DateTime2 NOT NULL DEFAULT GETUTCDATE(),
	updated DateTime2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT PK_app_people PRIMARY KEY CLUSTERED (id_person)
)
GO

ALTER TABLE App.people ADD CONSTRAINT FK_app_people_app_addresses FOREIGN KEY (id_address) REFERENCES App.addresses (id_address)
ALTER TABLE App.people ADD CONSTRAINT FK_app_people_store_stores FOREIGN KEY (id_store) REFERENCES Store.stores (id_store)