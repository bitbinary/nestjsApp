# Setting up

1. clone the repository: https://github.com/bitbinary/nestjsApp.git
2. navigate to the cloned repository folder

## Setting up the environment variables

1. Create the `.env` file in the root directory
2. Add the following environment variables

```
TOKEN_SECRET=<JWT TOKEN SECRET>
MONGO_USERNAME=<MONGO USERNAME>
MONGO_PASSWORD=<MONGO PASSWORD>
MONGO_DB=<MONGO DB NAME>
MONGO_URL=<MONGO CLUSTER URL> ex: XXXXX.XXXXX.mongodb.net
SERVER_HOSTNAME=<HOST NAME>
SERVER_PORT=<SERVER PORT>
```

## Installing packages

1. run `npm install` in the root directory
2. Once the packages are successfully installed, 
   1. run `npm run start:dev` to start in **dev**
   2. run `npm run build` to **build**
   3. run `npm run test` to run **unit test**
   4. run `npm run test:e2e` to run **e2e test**  

## Docker

1. Creating Docker image

   > NOTE: Make sure the port exposed in the **Dockerfile** is the one specified in the .env file

   run the command from the root directory 

   ```powershell
   docker build . -t <your username>/node-web-app
   ```

2. run the image in a container 

   ```powershell
   docker run -d -p <PORT>:<PORT> --name <name> <Image id>
   ```

   > Use the command **```docker images```** to get the list of images and their details

   

# Using the Application

The application supports post request to the <SERVERHOST:PORT> that the application is running on.(ex: localhost:3000)

#### Request

Create a post request with the user credentials send as **JSON object**. The application expects the request to be with **content-type: application/json**
Expected Input: 

| KEY      | VALUE  |
| -------- | ------ |
| username | string |
| password | string |

sample value:

```json
{
username: "test",
password: "testPassword"
}
```

#### Response

responds with a JSON object with the following structure

##### Success response

| status  | 200     |
| ------- | ------- |
| success | Boolean |
| token   | string  |

##### Failure response

| status  | 200     |
| ------- | ------- |
| success | Boolean |
| message | string  |



# DATABASE

The database module connects to Mongo DB using the details provided in the `.env` file

collection name: **users**

It expects a collection with the following structure for user documents

| key              | type   | default    |
| ---------------- | ------ | ---------- |
| uid              | string | no default |
| username         | string | no default |
| password         | string | no default |
| createdAt        | Date   | Date.now() |
| lockAttemptCount | number | 0          |
| lockExpiry       | Date   | Date.now() |
| token            | string | null       |

