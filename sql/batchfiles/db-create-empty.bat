Sqlcmd -S localhost -i ../generated/_create-db.sql
Sqlcmd -S localhost -d menuthing -i ../generated/_schemas-sequences.sql
Sqlcmd -S localhost -d menuthing -i ../generated/_recreate.sql
Sqlcmd -S localhost -d menuthing -i ../generated/seed/_seed-postcodes.sql
Sqlcmd -S localhost -d menuthing -i ../generated/seed/_seed-payment-methods.sql
Sqlcmd -S localhost -d menuthing -i ../generated/seed/_seed-order-types.sql
Sqlcmd -S localhost -d menuthing -i ../generated/seed/_seed-test-all.sql