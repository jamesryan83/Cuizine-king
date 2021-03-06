CREATE TABLE Store.business_hours
(
	id_business_hour INT NOT NULL CONSTRAINT DF_store_business_hours_id_business_hour DEFAULT (NEXT VALUE FOR Sequences.id_business_hour),
    id_store INT NOT NULL,
    hours_mon_dinein_open NVARCHAR(5) DEFAULT '10:00',
    hours_tue_dinein_open NVARCHAR(5) DEFAULT '10:00',
    hours_wed_dinein_open NVARCHAR(5) DEFAULT '10:00',
    hours_thu_dinein_open NVARCHAR(5) DEFAULT '10:00',
    hours_fri_dinein_open NVARCHAR(5) DEFAULT '10:00',
    hours_sat_dinein_open NVARCHAR(5) DEFAULT '10:00',
    hours_sun_dinein_open NVARCHAR(5) DEFAULT '10:00',
    hours_mon_dinein_close NVARCHAR(5) DEFAULT '22:00',
    hours_tue_dinein_close NVARCHAR(5) DEFAULT '22:00',
    hours_wed_dinein_close NVARCHAR(5) DEFAULT '22:00',
    hours_thu_dinein_close NVARCHAR(5) DEFAULT '22:00',
    hours_fri_dinein_close NVARCHAR(5) DEFAULT '22:00',
    hours_sat_dinein_close NVARCHAR(5) DEFAULT '22:00',
    hours_sun_dinein_close NVARCHAR(5) DEFAULT '22:00',
    hours_mon_delivery_open NVARCHAR(5) DEFAULT '10:00',
    hours_tue_delivery_open NVARCHAR(5) DEFAULT '10:00',
    hours_wed_delivery_open NVARCHAR(5) DEFAULT '10:00',
    hours_thu_delivery_open NVARCHAR(5) DEFAULT '10:00',
    hours_fri_delivery_open NVARCHAR(5) DEFAULT '10:00',
    hours_sat_delivery_open NVARCHAR(5) DEFAULT '10:00',
    hours_sun_delivery_open NVARCHAR(5) DEFAULT '10:00',
    hours_mon_delivery_close NVARCHAR(5) DEFAULT '22:00',
    hours_tue_delivery_close NVARCHAR(5) DEFAULT '22:00',
    hours_wed_delivery_close NVARCHAR(5) DEFAULT '22:00',
    hours_thu_delivery_close NVARCHAR(5) DEFAULT '22:00',
    hours_fri_delivery_close NVARCHAR(5) DEFAULT '22:00',
    hours_sat_delivery_close NVARCHAR(5) DEFAULT '22:00',
    hours_sun_delivery_close NVARCHAR(5) DEFAULT '22:00',
    updated_by INT NOT NULL,
	created DateTime2 NOT NULL DEFAULT GETUTCDATE(),
	updated DateTime2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT PK_store_business_hours PRIMARY KEY CLUSTERED (id_business_hour)
)
GO

ALTER TABLE Store.business_hours ADD CONSTRAINT FK_store_business_hours_store_stores FOREIGN KEY (id_store) REFERENCES Store.stores (id_store)