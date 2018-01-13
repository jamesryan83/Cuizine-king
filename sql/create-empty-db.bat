Sqlcmd -S localhost -i ./generated/_recreate-db.sql
Sqlcmd -S localhost -d menuthing -i ./generated/_schemas-sequences.sql
Sqlcmd -S localhost -d menuthing -i ./generated/_recreate.sql
Sqlcmd -S localhost -d menuthing -i ./generated/seed/_seed-postcodes.sql