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

    -- TODO : users, user stores

COMMIT

GO