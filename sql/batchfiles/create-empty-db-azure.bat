Sqlcmd -S tcp:sqljames.database.windows.net -d menuthing -U james -P Budza123 -i ../generated/_schemas-sequences.sql
Sqlcmd -S tcp:sqljames.database.windows.net -d menuthing -U james -P Budza123 -i ../generated/_recreate.sql
Sqlcmd -S tcp:sqljames.database.windows.net -d menuthing -U james -P Budza123 -i ../generated/seed/_seed-postcodes.sql
Sqlcmd -S tcp:sqljames.database.windows.net -d menuthing -U james -P Budza123 -i ../generated/seed/_seed-payment-methods.sql
Sqlcmd -S tcp:sqljames.database.windows.net -d menuthing -U james -P Budza123 -i ../generated/seed/_seed-order-types.sql
Sqlcmd -S tcp:sqljames.database.windows.net -d menuthing -U james -P Budza123 -i ../generated/seed/_seed-person-types.sql
Sqlcmd -S tcp:sqljames.database.windows.net -d menuthing -U james -P Budza123 -i ../generated/seed/_seed-test-all.sql