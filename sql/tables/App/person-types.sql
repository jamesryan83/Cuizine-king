CREATE TABLE App.person_types
(
    id_person_type TINYINT NOT NULL CONSTRAINT DF_app_person_types_id_person_type DEFAULT (NEXT VALUE FOR Sequences.id_person_type),
    name NVARCHAR(16) NOT NULL,
    updated_by INT NOT NULL DEFAULT 1,
    created DateTime2 NOT NULL DEFAULT GETUTCDATE(),
	updated DateTime2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT PK_app_person_types PRIMARY KEY CLUSTERED (id_person_type)
)
GO