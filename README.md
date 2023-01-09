# Blog App

## Description

A blog sharing platform.
Users can share blogs and interact with other peoples blog recommendations.

A single page application showcasing end-to-end Javascript-based web development

https://blogapptatu.fly.dev/

## Tech stack
#### Frontend: React. Styling with Material UI
#### Backend: NodeJS + Express
#### Database: MongoDB (NoSQL)

## Instructions:

Click [here](https://blogapptatu.fly.dev/), create an account and start interacting!

#### To play around locally on your device:

Create a [MongoDB](https://mongodb.com) database.

Clone the project

```
git clone https://github.com/maunutatu/Blog_App
```

Create a .env file in the backend directory. Add environmental data (MONGODB_URI, TEST_MONGODB_URI)

Go to the backend directory

### Start with Docker:
```
docker build -t blogapp .
docker run -p 5000:8080 --env-file ./.env --name blogapp
```

### Start with cmd / powershell:
```
npm install
npm start
```