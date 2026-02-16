# Photo Caption Contest

[Project Link](https://www.codecademy.com/journeys/back-end-engineer/paths/becj-22-security-infrastructure-scalibility/tracks/becj-22-portfolio-project-photo-caption-contest/modules/becp-22-photo-caption-contest-e59b30e6-216a-4b4e-8618-38b2556b8522/kanban_projects/ext-proj-caption-contest)

I adapted the project to use `Typescript` and `Typeorm`.

## Overview

In this project I created the backend for a platform where users can participate in a photo caption contest. My server hosts several images and I built endpoints to authenticate and authorize users. Users need to be authenticated (signed in) in order to create captions. I developed a database design and schema to integrate a database layer for storing all users and captions. I used PostgreSQL and Typeorm ORM to communicate between my database and server. As I created my endpoints, I tested them using Postman to ensure they worked correctly. Once the server was running, I implemented a localized cache to optimize the performance of frequently requested data. Finally, I wrote the documentation using Swagger and deployed my project to Render.

### Tools & Frameworks I Used

- **Express Framework**: For creating a robust API
- **Swagger**: For API documentation
- **PostgreSQL**: As the database system
- **Typeorm ORM**: For database communication
- **Render**: For project deployment

## Project Objectives

- Used Git version control
- Created documentation using the Swagger API
- Implemented a database
- Integrated existing API endpoints with the database layer
- Implemented database transactions
- Deployed the application using Render

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

I started by visualizing my end result - what it would be built with and what it could do. I made sure it satisfied all of the project objectives.

I created a timeline for myself and avoided the temptation to build things that weren't required. Setting firm boundaries and deadlines helped me stay on track and prevent scope creep.

### ✅ Step 2 - Configure Typeorm and create your database

I followed the documentation here: https://typeorm.io/docs/getting-started

### ✅ Step 3 - Create your model(s)

I kept images in consideration when creating my models and added all the necessary attributes. Once I ran the commands, new folders and files were generated in my project, which I examined to see how the code was updated.

### ✅ Step 4 - Add images to your server

I added 4-6 images to my server that would be captioned.

I kept in mind my project's architecture and where I would store these images. In the future, I might consider hosting the images in a cloud service for scalability, like AWS.

### ✅ Step 5 - Run migrations

I learned that if I need to update my models or change any associations, I can always re-run migrations to implement the changes. This is done automatically with Typeorm's `synchronize: true,` configuration. However, for production purposes, it's encouraged to be done manually and with versioning.

### ✅ Step 6 - Create endpoints for images and captions

I created the following endpoints:

- An endpoint to retrieve all images
- An endpoint to retrieve an image by ID (includes the images' captions and other information)
- An endpoint to add captions to a specific image

I thought carefully about my project structure and where to place route controllers depending on their purpose.

### ✅ Step 7 - Test your endpoints

I used Postman to check that my endpoints worked accordingly.

I manually added an image with attached captions to my server to verify that this data could be retrieved when testing the endpoints.

### ✅ Step 8 - Create authentication endpoints

I used the library bcrypt to create registration, login, and logout endpoints.

1. Created a hash from the users' registration password and stored it in the database
2. When a user logs in, I compared the password to the one stored in the database for authentication
3. Made sure I was able to create a user session

I referred to the bcrypt [documentation](https://www.npmjs.com/package/bcrypt) when I needed help.

### ✅ Step 9 - Add authorization middleware to specific endpoints

I designed the system so that only authorized users would be able to add captions to images. I created middleware and added it to the appropriate endpoints so that signed-in users could add captions to specific images.

I used a session to verify if a user is logged in.

I made sure to redirect users and use appropriate status codes when unauthorized users try to access these endpoints.

### ✅ Step 10 - Test your authorization endpoints

I used Postman to check all of my endpoints.

I made use of the Headers and Body tabs that Postman provides to check my authentication endpoints.

### ✅ Step 11 - Configure localized caching

I added the [node-cache](https://www.npmjs.com/package/node-cache) package and created a localized cache for the images whenever they're being retrieved.

I considered a few approaches:

- Creating a middleware that can be added to certain endpoints
- Setting the duration of my cache content to however long I saw fit

This step optimized the performance of retrieving all images, and images with captions.

Alternatively, I could have used [Redis](https://redis.io/) as an in-memory data structure store for caching.

### ✅ Step 12 - Write up documentation using Swagger

I used Swagger to create documentation for my API.

I tried to be as descriptive as possible and gave examples of what the data should look like. I wrote it as a manual for end users, making sure it was specific, concise, and relevant.

### Step 13 - Deploy your application with Render

1. I pushed my local changes to my remote GitHub repository
2. I deployed my application using Render

I referred to the [Render documentation](https://render.com/docs) when I needed a refresher.

### Step 14 - Next steps

I could expand this project beyond the required features. If I want to challenge myself further, I could:

- Create a web app that displays photos, captions, and allows users to register and submit captions
- Create a Docker container to run and deploy the project
- Design and implement a voting mechanism for ranking caption submissions

## Setup

1. Set up `.env` file with your database config:

- USERNAME
- PASSWORD
- DATABASE

2. Install all dependencies

```bash
npm install
```

3. Build the app

```bash
npm run build
```

4. Start the app

```bash
npm start
```
