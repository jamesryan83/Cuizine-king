-- Invalidate a jwt
CREATE OR ALTER PROCEDURE people_invalidate_jwt
	@jwt NVARCHAR(512) AS

    -- set jwt
    UPDATE App.people SET jwt = '' WHERE jwt = @jwt

    -- error if no rows were changed
    IF @@ROWCOUNT = 0 THROW 50400, 'Account not found', 1
GO