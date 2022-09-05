# projeto18-valex

A Typescript designed project to manage benefit cards among companies and employees

# Description

Valex simulates an API that manages a benefit card, generally made available by companies to their employees.

## Features

- Get the card balance and transactions
- Create cards and virtual cards
- Activate / Block / Unlock a card
- Recharge a card
- Make card payments with online payment option

## API Reference

### Get card balance

```http
GET /cards/:cardId/balance
```

#### Request:

| Params   | Type      | Description           |
| :------- | :-------- | :-------------------- |
| `cardId` | `integer` | **Required**. card id |

#### Response:

```json
{
  "balance": 35000,
  "transactions": [
    {
      "id": 1,
      "cardId": 1,
      "businessId": 1,
      "businessName": "DrivenEats",
      "timestamp": "22/01/2022",
      "amount": 5000
    }
  ],
  "recharges": [
    {
      "id": 1,
      "cardId": 1,
      "timestamp": "21/01/2022",
      "amount": 40000
    }
  ]
}
```

#

### Create a card

```http
POST /cards/create
```

#### Request:

| Body         | Type      | Description                        |
| :----------- | :-------- | :--------------------------------- |
| `employeeId` | `integer` | **Required**. user id              |
| `type`       | `string`  | **Required**. type of card benefit |

`Valid type: [groceries, restaurant, transport, education, health]`

| Headers     | Type     | Description           |
| :---------- | :------- | :-------------------- |
| `x-api-key` | `string` | **Required**. api key |

#### Response:

```json
{
  "employeeId": 1,
  "number": "1111 1111 1111 1111",
  "cardholderName": "NAME N NAME",
  "securityCode": "111",
  "expirationDate": "01/27",
  "isVirtual": false,
  "isBlocked": false,
  "type": "card type"
}
```

#

### Activate a card

```http
PATCH /cards/:cardId/activate
```

#### Request:

| Params   | Type      | Description           |
| :------- | :-------- | :-------------------- |
| `cardId` | `integer` | **Required**. card id |

| Body           | Type      | Description                 |
| :------------- | :-------- | :-------------------------- |
| `employeeId`   | `integer` | **Required**. user id       |
| `password`     | `string`  | **Required**. card password |
| `securityCode` | `string`  | **Required**. card cvv      |

`Password length: 4`

`Password pattern: only numbers`

`SecurityCode max length: 3`

#

### Block a card

```http
PATCH /cards/:cardId/block
```

#### Request:

| Params   | Type      | Description           |
| :------- | :-------- | :-------------------- |
| `cardId` | `integer` | **Required**. card id |

| Body       | Type     | Description                 |
| :--------- | :------- | :-------------------------- |
| `password` | `string` | **Required**. card password |

#

### Unblock a card

```http
PATCH /cards/:cardId/unblock
```

#### Request:

| Params   | Type      | Description           |
| :------- | :-------- | :-------------------- |
| `cardId` | `integer` | **Required**. card id |

| Body       | Type     | Description                 |
| :--------- | :------- | :-------------------------- |
| `password` | `string` | **Required**. card password |

#

### Recharge a card

```http
POST /cards/:cardId/recharge
```

#### Request:

| Params   | Type      | Description           |
| :------- | :-------- | :-------------------- |
| `cardId` | `integer` | **Required**. card id |

| Headers     | Type     | Description           |
| :---------- | :------- | :-------------------- |
| `x-api-key` | `string` | **Required**. api key |

| Body     | Type      | Description                   |
| :------- | :-------- | :---------------------------- |
| `amount` | `integer` | **Required**. recharge amount |

#

### Card payments

```http
POST /cards/:cardId/payment/pos
```

#### Request:

| Params   | Type      | Description           |
| :------- | :-------- | :-------------------- |
| `cardId` | `integer` | **Required**. card id |

| Body         | Type      | Description                  |
| :----------- | :-------- | :--------------------------- |
| `businessId` | `integer` | **Required**. user id        |
| `password`   | `string`  | **Required**. card password  |
| `amount`     | `integer` | **Required**. payment amount |

#

#### Online payments

```http
POST /cards/payment/online
```

#### Request:

| Body             | Type      | Description                        |
| :--------------- | :-------- | :--------------------------------- |
| `cardholderName` | `string`  | **Required**. name in card         |
| `number`         | `string`  | **Required**. card number          |
| `expirationDate` | `string`  | **Required**. card expiration date |
| `securityCode`   | `string`  | **Required**. card CVV             |
| `businessId`     | `integer` | **Required**. business id          |
| `amount`         | `integer` | **Required**. payment amount       |

`Expiration Date Format: "MM/YY"`

##### Example:

```json
{
  "cardData": {
    "number": "1111 1111 1111 1111",
    "cardholderName": "NAME N NAME",
    "expirationDate": "09/22",
    "securityCode": "111"
  },
  "businessId": "1",
  "amount": 1000
}
```

#

### Create a virtual card

```http
POST /virtual-cards/:cardId/create
```

#### Request:

| Params   | Type      | Description           |
| :------- | :-------- | :-------------------- |
| `cardId` | `integer` | **Required**. card id |

| Body       | Type     | Description                 |
| :--------- | :------- | :-------------------------- |
| `password` | `string` | **Required**. card password |

| Headers     | Type     | Description           |
| :---------- | :------- | :-------------------- |
| `x-api-key` | `string` | **Required**. api key |

#### Response:

```json
{
  "employeeId": 1,
  "number": "1111 1111 1111 1111",
  "cardholderName": "NAME N NAME",
  "securityCode": "111",
  "expirationDate": "09/21",
  "password": "encrypted-password",
  "isVirtual": true,
  "originalCardId": 1,
  "isBlocked": false,
  "type": "restaurant"
}
```

#

### Delete a virtual card

```http
POST /virtual-cards/:cardId/delete
```

#### Request:

| Params   | Type      | Description           |
| :------- | :-------- | :-------------------- |
| `cardId` | `integer` | **Required**. card id |

| Body       | Type     | Description                 |
| :--------- | :------- | :-------------------------- |
| `password` | `string` | **Required**. card password |

| Headers     | Type     | Description           |
| :---------- | :------- | :-------------------- |
| `x-api-key` | `string` | **Required**. api key |

#

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DATABASE_URL = postgres://<username>:<password>@<hostname>:5432/<databaseName>`

`PORT = number #recommended:5000`

`CRYPTR_SECRET_KEY = any string`

## Run Locally

Clone the project

```bash
  git clone https://github.com/thalyabbeltrame/valex-back.git
```

Go to the project directory

```bash
  cd valex-back/
```

Install dependencies

```bash
  npm install
```

Create database

```bash
  cd valex-back/database/
```
```bash
  bash ./create-database
```

Start the server

```bash
  cd valex-back/
```
```bash
  npm start
```
