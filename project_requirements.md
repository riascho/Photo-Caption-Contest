# Photo Caption Contest

[Project Link](https://www.codecademy.com/journeys/back-end-engineer/paths/becj-22-security-infrastructure-scalibility/tracks/becj-22-portfolio-project-photo-caption-contest/modules/becp-22-photo-caption-contest-e59b30e6-216a-4b4e-8618-38b2556b8522/kanban_projects/ext-proj-caption-contest)

## Overview

In this project you will create the backend for a platform for users to participate in a photo caption contest. Your server will host a few images and you will create endpoints to authenticate and authorize users. In order for a user to create a caption, they will need to be authenticated (signed in). You will need a database design and schema in order to integrate a database layer to store all your users and captions. You will use PostgreSQL and Typeorm ORM to communicate between your database and your server. As you create your endpoints you will be testing them on Postman to ensure that they work correctly. Once the server is running, you will use a localized cache to optimize the performance of frequently requested data. Finally, you will write the documentation using Swagger and deploy your project to Render.

### Required Tools & Frameworks

- **Express Framework**: For creating a robust API. If you need help setting up the framework, take a look at the step by step instructions [here](https://expressjs.com/en/starter/installing.html).
- **Swagger**: For API documentation
- **PostgreSQL**: As the database system
- **Typeorm ORM**: For database communication
- **Render**: For project deployment

## Project Objectives

- Use Git version control
- Create documentation using the Swagger API
- Implement a database
- Integrate existing API endpoints with the database layer
- Database implementation for transactions
- Deploy the application using Render

## Prerequisites

- Command line and file navigation
- Git and GitHub
- Typescript
- Node.js/Express
- Postman
- PostgreSQL
- Database relationships and configuration
- Typeorm ORM
- Render

## Project Steps

### ✅ Step 1 - Plan your project

Visualize your end result. What is it built with? What can it do? Make sure that it satisfies all of the project objectives.

Make a timeline for yourself and avoid the temptation to build things that aren't required. Setting firm boundaries and deadlines will keep you on track and prevent scope creep.

The following tasks will help you identify natural break points.

### ✅ Step 2 - Configure Typeorm and create your database

> Following the documentation here: https://typeorm.io/docs/getting-started

### ✅ Step 3 - Create your model(s)

Remember to keep images in consideration when creating your models and to add all the necessary attributes. Once the commands are run, new folders and files will be generated in your project. Take a look inside them and examine how the code was updated.

### ✅ Step 4 - Add images to your server

Add 4-6 images that will be captioned in your server.

Keep in mind your project's architecture and where you will store these images. In the future, you might consider hosting the images in a cloud service for scalability, like AWS for example.

### ✅ Step 5 - Run migrations

If you need to update your models or change any associations you can always re-run migrations to implement the changes. This is done automatically with Typeorm's `synchronize: true,` configuration. However, for production purposes, it is encouraged to be done manually and with versioning.

### ✅ Step 6 - Create endpoints for images and captions

Create the following endpoints:

- An endpoint to retrieve all images.
- An endpoint to retrieve an image by ID (this should include the images' captions and other information).
- An endpoint to add captions to a specific image.

Think about your project structure and where you should place route controllers depending on their purpose.

### ✅ Step 7 - Test your endpoints

Use Postman to check that your endpoints work accordingly.

You might need to manually add an image with attached captions to your server in order to check whether this data can be retrieved when testing the endpoints.

### ✅ Step 8 - Create authentication endpoints

Use the library bcrypt and create registration, login, and logout endpoints.

1. Create a hash from the users registration password and store it in the database.
2. When a user logs in, compare the password to the one stored in the database for authentication.
3. Make sure you're able to create a user session.

If you need help using bcrypt, make sure to look at their [documentation](https://www.npmjs.com/package/bcrypt).

### ✅ Step 9 - Add authorization middleware to specific endpoints

Only authorized users will be able to add captions to images. Create middleware and add it to the appropriate endpoints in order for signed-in users to add captions to specific images.

You can use a session in order to verify if a user is logged in.

Make sure to redirect users and use appropriate status codes when unauthorized users try to access these endpoints.

### ✅ Step 10 - Test your authorization endpoints

Use Postman to check all of your endpoints.

Remember to make use of the Headers and Body tabs that Postman provides in order to check your authentication endpoints.

### ✅ Step 11 - Configure localized caching

Add the [node-cache](https://www.npmjs.com/package/node-cache) package and create a localized cache for the images whenever they're being retrieved.

There are a few ways to do this:

- Create a middleware that can be added to certain endpoints
- Set the duration of your cache content to however long you see fit

This step should optimize the performance of retrieving all images, and images with captions.

Alternatively, you can use [Redis](https://redis.io/) as an in-memory data structure store for caching.

### ✅ Step 12 - Write up documentation using Swagger

Using Swagger, create documentation for your API.

Try to be as descriptive as possible and give examples of what your data should look like. Good documentation should read as a manual for end users so be sure to write it in a specific, concise, and relevant way.

### Step 13 - Deploy your application with Render

1. Push your local changes to your remote GitHub repository
2. Deploy your application using Render

If you need a refresher on how to do this, take a look at the [Render documentation](https://render.com/docs).

### Step 14 - Next steps

You're welcome to expand this project beyond the required features. If you feel like challenging yourself further you could:

- Create a web app that displays photos, captions, and allows users to register and submit captions
- Create a Docker container to run and deploy your project
- Design and implement a voting mechanism for ranking caption submissions
