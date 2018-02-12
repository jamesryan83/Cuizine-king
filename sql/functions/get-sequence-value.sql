
-- Returns the current sequence id value
CREATE OR ALTER FUNCTION get_sequence_value(@name AS NVARCHAR(128))
RETURNS INT AS
BEGIN
    RETURN (SELECT CAST(current_value AS INT) FROM sys.sequences WHERE name = @name)
END
GO
