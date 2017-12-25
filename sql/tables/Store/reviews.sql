CREATE TABLE Store.reviews
(
	id_review INT NOT NULL CONSTRAINT DF_store_reviews_id_review DEFAULT (NEXT VALUE FOR Sequences.id_review),
    id_store INT NOT NULL,
    id_person INT NOT NULL,
    title NVARCHAR(128),
    review NVARCHAR(512),
    rating TINYINT NOT NULL,
    updated_by INT NOT NULL,
	created DateTime2 NOT NULL DEFAULT GETUTCDATE(),
	updated DateTime2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT PK_store_reviews PRIMARY KEY CLUSTERED (id_review)
)
GO

ALTER TABLE Store.reviews ADD CONSTRAINT FK_store_reviews_storestore_stores FOREIGN KEY (id_store) REFERENCES Store.stores (id_store)
ALTER TABLE Store.reviews ADD CONSTRAINT FK_store_reviews_app_people FOREIGN KEY (id_person) REFERENCES App.people (id_person)