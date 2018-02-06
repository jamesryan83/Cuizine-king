CREATE TABLE App.person_types
(
    id_person_type TINYINT PRIMARY KEY NOT NULL,
    name NVARCHAR(16) NOT NULL,
    updated_by INT NOT NULL DEFAULT 1,
    created DateTime2 NOT NULL DEFAULT GETUTCDATE(),
	updated DateTime2 NOT NULL DEFAULT GETUTCDATE()
)
GO