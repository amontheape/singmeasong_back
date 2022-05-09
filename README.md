# Sing Me A Song (back-end)

_An API which supplies Sing Me A Song application_
## front-end repo available at : 

> https://github.com/amontheape/singmeasong_front

## Routes and Methods:
```http
POST /recommendations
```
> creates a new recommendation
```http
POST /recommendations/:id/upvote
```
> increases recommendation score by 1
```http
POST /recommendations/:id/downvote
```
> decreases recommendation score by 1
```http
GET /recommendations
```
> lists 10 last recommendations
```http
GET /recommendations/:id
```
> lists specific recommendation sorted by its ID
```http
GET /recommendations/random
```
> lists random recommendation
```http
GET /recommendations/top/:amount
```
> lists x amount of recommendations ordered by their scores

## Technologies which have made this project possible:

  ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
  ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
  ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
  ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
  ![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
  
## How to run

### Clone this repository

```bash
$ git clone git@github.com:amontheape/singmeasong_back.git
```

### Install dependencies

```bash
$ npm i
```

### Set environment variables @root/.env

```bash
DATABASE_URL=postgres://<user>:<password>@localhost:5432/singmeasong
```

> replace "user" and "password" to match your database info

### Create Database

```bash
$ npx prisma init
$ npx prisma migrate dev
```

### Run the Server

```bash
$ npm run dev
```
---

## How to test

### Set test-environment variables @root/.env.test

```bash
DATABASE_URL=postgres://<user>:<password>@localhost:5432/singmeasong-test
NODE_ENV=test
```
### Create test-database

```bash
$ npm run migrate:test
```

### Run tests with : 

```bash
$ npm run test
```
