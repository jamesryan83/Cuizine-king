USE menuthing

SET NOCOUNT ON
SET XACT_ABORT ON
BEGIN TRANSACTION

	DECLARE @password NVARCHAR(100)
	DECLARE @image NVARCHAR(MAX)
	DECLARE @verificationToken NVARCHAR(45)
	DECLARE @jwtJames NVARCHAR(500)


	SET @password = '$2a$10$eHk6wrHHegXgkymdHbBKQerueh8i.RVoTxi3SR7g8MPrCKODxRTVu' -- = 'password'
	SET @image = 'http://imagizer.imageshack.us/v2/297x407q90/538/gPC6eX.jpg'
	SET @verificationToken = 'PQRLFYpo9ruXekMvcUz0cvU6cOfx2sBQR6047Ly1RAcnUu6pJC'
	SET @jwtJames = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbWVzNDE2NUBob3RtYWlsLmNvbSIsImlhdCI6MTUxMDkyNTEyMSwiZXhwIjoxNTQyNDgyNzIxfQ.UHn-tXMOnzU4h4-5o9Da5FCjRXe-A_Ra5glSZTXWO1k'


    -- payment methods
    INSERT INTO App.payment_methods (name) VALUES ("Credit Card")
    INSERT INTO App.payment_methods (name) VALUES ("Cash")
    INSERT INTO App.payment_methods (name) VALUES ("PayPal")


    -- order types
    INSERT INTO App.order_types (name) VALUES ("Delivery")
    INSERT INTO App.order_types (name) VALUES ("Dine In")
    INSERT INTO App.order_types (name) VALUES ("Take Away")


    -- create address types
    --INSERT INTO address_types (name) VALUES ('user')
    --INSERT INTO address_types (name) VALUES ('store')
    --INSERT INTO address_types (name) VALUES ('store')


	-- create pending users
	--EXEC users_pending_add 'test1', 'mctest', 'test@mctest.com', @password, 0, @verificationToken


	-- create actual users
	--INSERT INTO Auth.users (first_name, last_name, email, password, type, image) VALUES ('atest', 'mcatest', 'test@mcatest.com', @password, 0, @image)


	-- add special logins
	--INSERT INTO Auth.users (first_name, last_name, email, password, type, image)
		--VALUES ('James', 'Adminaut', 'james4165@hotmail.com', @password, 0, @image)


	---- Create companies
	--INSERT INTO Store.companies (name) VALUES ('store1')
	--INSERT INTO Auth.users_companies (id_user, id_store, is_owner) VALUES (1, 1, 1)


	---- add special companies
	--INSERT INTO Store.companies (name) VALUES ('store1')
	--INSERT INTO Auth.users_companies (id_user, id_store, is_owner) VALUES (1, 1, 1)

COMMIT

GO