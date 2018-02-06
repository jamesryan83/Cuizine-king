

SET NOCOUNT ON
SET XACT_ABORT ON

BEGIN TRANSACTION
	INSERT INTO Store.business_hours(id_store,dine_in_hours,day,opens,closes,updated_by) VALUES (1,1,1,'9am','11pm',3)
	INSERT INTO Store.business_hours(id_store,dine_in_hours,day,opens,closes,updated_by) VALUES (1,1,2,'6am','1am',3)
	INSERT INTO Store.business_hours(id_store,dine_in_hours,day,opens,closes,updated_by) VALUES (1,1,3,'7am','10pm',3)
	INSERT INTO Store.business_hours(id_store,dine_in_hours,day,opens,closes,updated_by) VALUES (1,1,4,'9am','9pm',3)
	INSERT INTO Store.business_hours(id_store,dine_in_hours,day,opens,closes,updated_by) VALUES (1,1,5,'10am','9pm',3)
	INSERT INTO Store.business_hours(id_store,dine_in_hours,day,opens,closes,updated_by) VALUES (1,1,6,'8am','1am',3)
	INSERT INTO Store.business_hours(id_store,dine_in_hours,day,opens,closes,updated_by) VALUES (1,1,7,'9am','10pm',3)
	INSERT INTO Store.business_hours(id_store,dine_in_hours,day,opens,closes,updated_by) VALUES (1,0,1,'7am','10pm',3)
	INSERT INTO Store.business_hours(id_store,dine_in_hours,day,opens,closes,updated_by) VALUES (1,0,2,'6am','9pm',3)
	INSERT INTO Store.business_hours(id_store,dine_in_hours,day,opens,closes,updated_by) VALUES (1,0,3,'8am','1am',3)
	INSERT INTO Store.business_hours(id_store,dine_in_hours,day,opens,closes,updated_by) VALUES (1,0,4,'10am','12am',3)
	INSERT INTO Store.business_hours(id_store,dine_in_hours,day,opens,closes,updated_by) VALUES (1,0,5,'6am','9pm',3)
	INSERT INTO Store.business_hours(id_store,dine_in_hours,day,opens,closes,updated_by) VALUES (1,0,6,'6am','11pm',3)
	INSERT INTO Store.business_hours(id_store,dine_in_hours,day,opens,closes,updated_by) VALUES (1,0,7,'6am','9pm',3)
COMMIT

GO


