Sqlcmd -S localhost -i ./generated/_recreate-db.sql
Sqlcmd -S localhost -d menuthing -i ./generated/_schemas-sequences.sql
Sqlcmd -S localhost -d menuthing -i ./generated/_recreate.sql
Sqlcmd -S localhost -d menuthing -i ./generated/seed/_seed-postcodes.sql
Sqlcmd -S localhost -d menuthing -i ./generated/seed/_seed-addresses.sql
Sqlcmd -S localhost -d menuthing -i ./generated/seed/_seed-payment-methods.sql
Sqlcmd -S localhost -d menuthing -i ./generated/seed/_seed-order-types.sql
Sqlcmd -S localhost -d menuthing -i ./generated/seed/_seed-person-types.sql
Sqlcmd -S localhost -d menuthing -i ./generated/seed/_seed-stores.sql
Sqlcmd -S localhost -d menuthing -i ./generated/seed/_seed-people.sql
Sqlcmd -S localhost -d menuthing -i ./generated/seed/_seed-reviews.sql
Sqlcmd -S localhost -d menuthing -i ./generated/seed/_seed-business-hours.sql
Sqlcmd -S localhost -d menuthing -i ./generated/seed/_seed-products.sql
Sqlcmd -S localhost -d menuthing -i ./generated/seed/_seed-product-extras.sql
Sqlcmd -S localhost -d menuthing -i ./generated/seed/_seed-product-options.sql