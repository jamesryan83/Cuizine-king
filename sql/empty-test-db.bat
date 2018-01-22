Sqlcmd -S localhost -d menuthingTest -i ./generated/_recreate-keep-postcodes.sql
Sqlcmd -S localhost -d menuthingTest -i ./generated/seed/_seed-payment-methods.sql
Sqlcmd -S localhost -d menuthingTest -i ./generated/seed/_seed-order-types.sql
Sqlcmd -S localhost -d menuthingTest -i ./generated/seed/_seed-person-types.sql