CREATE TABLE Store.stores_people
(
	id_store_person INT NOT NULL CONSTRAINT DF_store_stores_people_id_store_person DEFAULT (NEXT VALUE FOR Sequences.id_store_person),
    id_store INT NOT NULL,
	id_person INT NOT NULL,
	updated_by INT NOT NULL,
	SysStartTime DateTime2 GENERATED ALWAYS AS ROW START,
	SysEndTime DateTime2 GENERATED ALWAYS AS ROW END,
    PERIOD FOR SYSTEM_TIME (SysStartTime, SysEndTime),
    CONSTRAINT PK_store_stores_people PRIMARY KEY CLUSTERED (id_store_person)
)
WITH
(
    SYSTEM_VERSIONING = ON (HISTORY_TABLE = Store.stores_people_history)
)
GO

ALTER TABLE Store.stores_people ADD CONSTRAINT FK_store_stores_people_store_stores FOREIGN KEY (id_store) REFERENCES Store.stores (id_store)
ALTER TABLE Store.stores_people ADD CONSTRAINT FK_store_stores_people_app_people FOREIGN KEY (id_person) REFERENCES App.people (id_person)
