# NC News Seeding

Step 1: Create two .env files

- .env.test
- .env.development

Step 2: Within env.test, enter the following code:

PGDATABASE=nc_news_test   // The names of the databases can be found in the setup.dbs.sql file //

Step 3: Within env.development, enter the following code:

PGDATABASE=nc_news
