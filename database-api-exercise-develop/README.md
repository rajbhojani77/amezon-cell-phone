# Database-Api-Exercise

## Installation

1) Clone the repository from git@gitlab.com:improwised/onboarding-2020/raj/database-api-exercise.git

2) open command prompt and goto directory  ./database-api-exercise

3) you have to install PostgreSQL , 
    To install PostgreSQL follow the below link.
    
    -https://medium.com/@dan.chiniara/installing-postgresql-for-windows-7ec8145698e3
    
    -Run PostgreSQL server

4) open database.json file and add your database configuration. 

5) Run `npm install`

6) run `db-migrate up`.It will take upto 3 min to add database.

7) Run `npm start`

## Usage

The following filters are supported for the `/user` route:

|Methods| end-point | possible values | description|
|:-----------|:-----------|:----------------|:-----------|
| `POST` | `/login` | `{username,password}`| user logged in using passport(both types of the user can log in using the same API) |
| `GET` | `/logout` | | it will logged out user |
| `GET` | `/` | `{page_no}` | get 10 reviewers of given page |
| `POST` | `/add` | `{username,password}`| Admin can create new user |
| `GET` | `/profile` | | get the information of current user |
| `PUT` | `/:id/edit` | `{username,password}` | Admin can edit user information |
| `DELETE` | `/:id/delete` | | Admin can delete user |

The following filters are supported for the `/items` route:

|Methods| end-point | possible values | description|
|:-----------|:-----------|:----------------|:-----------|
| `GET` | `/` | `{page_no,brand,orderby,order}` | get 10 items of given page.if brand is given then get items of that brand |
| `GET` | `/:itemId` | | get item of given id |
| `GET` | `/:itemId/reviews/:reviewId` | | get item of given id with review of given id|
| `POST` | `/add` | `{asin,brand,title,url,image,rating,reviewurl,totalreviews,prices}`| Admin can add item |
| `PUT` | `/:id/edit` | `{asin,brand,title,url,image,rating,reviewurl,totalreviews,prices}` | Admin can edit item |
| `DELETE` | `/:id/delete` | | Admin can delete item |

The following filters are supported for the `/reviews` route:

|Methods| end-point | possible values | description|
|:-----------|:-----------|:----------------|:-----------|
| `GET` | `/` | `{page_no,isVerified,text,orderby,order}` | get 10 reviews of given page. if `isVerified` is true then only verified revies are shown. `text` used for get reviews containing that text in review body|
| `GET` | `/:id` | | get review at given id |
| `POST` | `/add` | `{item_id,user_id,rating,date,verified,title,body,helpfulvotes}`| user lo |
| `PUT` | `/:id/edit` | `{item_id,user_id,rating,date,verified,title,body,helpfulvotes}` | Admin can edit review |
| `DELETE` | `/:id/delete` | | Admin can delete review |

