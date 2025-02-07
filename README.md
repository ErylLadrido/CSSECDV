# Jobby (Wala akong maisip na ibang name)
## Commands (Terminal)
- `npm run dev` to run web app in development environment
- `npm build` to build web app (once development is done)
- `npm start` to run built web app (requires that `npm build` is ran first)

# Execution Instructions
## Web Application
1. From a terminal, navigate into the project, there will be two directories `client` and `server`
2. Enter `client` and type `npm i` to set up the client.
3. Return to root, then enter `server` and type `go mod tidy` to download all dependencies.

## SQL Database
1. Open an application such as MySQL workbench, and find **Open Model** navigate to the project and select jobby_schema.mwb
2. Forward engineer the model to get the table.
3. *note:* ensure that you have an .env file with the following values:
    - DB_USER
    - DB_PASSWORD
    - DB_HOST
    - DB_PORT
    - DB_NAME
    - JWT_SECRET_KEY

## Execution
1. (inside client): `npm run dev`
2. (inside server): `go run .`
3. When creating an account, use the email: `admin@admin.com` to get a default admin account.