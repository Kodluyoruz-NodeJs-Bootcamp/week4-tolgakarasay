# Authentication with JWT and session

Check out the live demo: https://tolga-auth-app.herokuapp.com/

Developed by Tolga Karasay within the context of the Gusto & RemoteTeam Node.js Bootcamp. It's a simple authentication api with "register", "login", "list all users" and "logout" functionalities. Both JWT and Session are used to authenticate a user.

#

## Used Technologies

- NodeJS
- Typescript
- Prettier
- Nodemon
- Static Files (express.static)
- Template Engine (ejs)
- Express
- MongoDB
- Mongoose
- MVC architecture
- Atlas MongoDB cloud
- Heroku Deployment

#

## Installation

Clone the project to your local repository.

```
git clone https://github.com/Kodluyoruz-NodeJs-Bootcamp/week3-tolgakarasay
```

Install the dependencies of the project.

```
npm install
```

Create a .env file in the project's directory using the supported .env.example file as a guide. Environment variables inside your .env file should look like this:

```
API_PORT= <enter your port number here>
MONGO_URI= <enter your mongo db uri here>
TOKEN_KEY= <enter an arbitrary string here>
SESSION_SECRET= <enter an arbitrary string here>
```

Run the code with nodemon

```
npm start
```

or with ts-node.

```
npx ts-node app.ts
```

https://user-images.githubusercontent.com/49616302/150555634-7c8d5a15-15b0-4ebd-9924-2bb0a59b5487.mp4
