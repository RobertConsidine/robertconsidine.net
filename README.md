RobJinman.com
=============

My personal website.


Main components
---------------

The running components of the app. The number is the port on which the service
runs when executed locally.

* 5432: Database server - PostgreSQL
* 4466: Prisma server - Data access layer to simplify DB access
* 4000: Back-end app - The GraphQL API
* 4201: Admin front-end app
* 4200: Front-end app


Commands
--------

### Running the app

Start the database server and prisma server. From project_root/back, run

        docker-compose -f prisma/docker-compose.yml up

Start the back-end app. From project_root/back, run

        node ./src/index.js

Build and run the admin app. From project_root/admin, run

        ng serve --watch

Build and run the front-end app. From project_root/front, run

        ng serve --watch


### Development

After changing GraphQL schema, apply DB migrations and regenerate prisma
client, then restart the back-end app. From project_root/back

        PRISMA_MANAGEMENT_API_SECRET=XXXXXX prisma deploy
        node src/index.js

Regenerate types.ts (configured in codegen.yml)

        gql-gen

Create a new Angular component

        ng generate component my-component

Create a new Angular service

        ng generate service my-service



Populating with dummy data
--------------------------

Create the admin user.

        mutation {
          signup(
            name: "rob"
            email: "rob@mail.com"
            password: "admin"
          ) {
            token
          }
        }

Or if one already exists

        mutation {
          login(email: "rob@mail.com", password: "admin") {
            token
          }
        }

Add the following HTTP header with the returned token.

        HTTP HEADERS
        {"Authorization": "Bearer TOKEN"}

Post some articles.

        mutation {
	        article1: postArticle(
            title: "My First Article"
            summary: "A summary of my first article."
            content: "The contents of my first article"
            tags: ["first", "interesting", "fun"]
          ) {
            id
          },
	        article2: postArticle(
            title: "My Second Article"
            summary: "A summary of my second article."
            content: "The contents of my second article"
            tags: ["second", "very interesting", "cool"]
          ) {
            id
          },
	        article3: postArticle(
            title: "My Third Article"
            summary: "A summary of my third article."
            content: "The contents of my third article"
            tags: ["third", "amusing", "cool", "fun"]
          ) {
            id
          }
        }
