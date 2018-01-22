-- Invalidate a jwt
CREATE PROCEDURE people_invalidate_jwt
	@jwt NVARCHAR(512) AS

    UPDATE App.people SET jwt = '' WHERE jwt = @jwt

    IF @@ROWCOUNT = 0 THROW 50400, 'Account not found', 1
GO