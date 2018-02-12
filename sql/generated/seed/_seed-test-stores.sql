

SET NOCOUNT ON
SET XACT_ABORT ON

BEGIN TRANSACTION
	INSERT INTO Store.stores(id_address,name,description,email,phone_number,website,facebook,twitter,abn,bank_name,bank_bsb,bank_account_name,bank_account_number,is_deleted,is_deleted_email,internal_notes,updated_by) VALUES (1,'The Abyssinian','There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don''t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn''t anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary','jamesryan4171@gmail.com','33330000','https://www.zomato.com/melbourne/the-abyssinian-flemington?utm_source=api_basic_user&utm_medium=api&utm_campaign=v2.1',NULL,NULL,'12345678912','Test1','123-1','test-1','1231',0,NULL,NULL,3)
COMMIT

GO


