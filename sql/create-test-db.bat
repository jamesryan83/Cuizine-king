Sqlcmd -S localhost -i ./generated/_recreate-test-db.sql
Sqlcmd -S localhost -d menuthingTest -i ./generated/_schemas-sequences.sql
Sqlcmd -S localhost -d menuthingTest -i ./generated/_recreate.sql
Sqlcmd -S localhost -d menuthingTest -i ./generated/seed/_seed-postcodes.sql