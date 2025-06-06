# NC News Seeding

Link to hosted version: https://jakes-news-project.onrender.com

This project was to create a backend for a news app that provides endpoints to:
- Retrieve, sort and filter articles
- View users and topics
- Post and delete comments
- Update article votes

1. To clone the repo use:

git clone https://github.com/jakedaniels15/nc_news_project.git

2. Then in the terminal ensure you run:

npm install

3. Create two .env files

- .env.test
- .env.development

Within env.test, enter the following code:

PGDATABASE=nc_news_test   // The names of the databases can be found in the setup.dbs.sql file //

Within env.development, enter the following code:

PGDATABASE=nc_news

4. Run tests with Jest in __tests__ using:

npm test

5. To seed the database use the following:

npm run-setup-dbs
npm run seed-dev

Version of Node.js required to run: 23.10
Version of Postgres required to run: 16.9



