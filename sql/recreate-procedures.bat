Sqlcmd -S localhost -d menuthing -i ./generated/_recreate-procedures.sql
Sqlcmd -S localhost -d menuthingTest -i ./generated/_recreate-procedures.sql