# FoodOrder-AdminPanel
Food ordering project with admin panel , used NodeJS , Express , Handlebars , Session, Cookies , Password hash, Luxon, File upload,Bootstrap, MySQL Stored Procedures <br><br>
![](https://github.com/littlenines/FoodOrder-AdminPanel/blob/3c7878a5069b06ef5ced56ac7763043fc4554432/How%20it%20looks/home.gif)
For a better idea/picture of the project go to [How it looks](https://github.com/littlenines/FoodOrder-AdminPanel/tree/master/How%20it%20looks) folder <br><br>
install dependencies <br>
> npm install
<br>
Import Schema,tables and procedures into your MySQL Workbench from: <br><br>

> MySQL_Files folder
<br>
Go to .env file and input your database info and secret key for session/cookies (random, can be anything) <br>

```
DB_HOST = 
DB_NAME = 
DB_USER = 
DB_PASSWORD = 
SI_SECRET = 
```
Start the project
> npm start
<br>
The main point of this project was learning how to use Stored Procedures and eventualy learn other new things<br>

## NOTE
Normally when it comes to MySQL query we would do something like this: <br>
```javascript
connection.query('select * from menu;', (err, rows) => {
            connection.release();

            if (!err) {
                res.render('home', { rows });
            } else {
               .....
            }

        });
```
<br>
But with Stored Procedures we have to do something like this(notice query and render part)<br>

```javascript
connection.query('call menu()', (err, rows) => {
            connection.release();

            if (!err) {
                res.render('home', { rows: rows[0] });
            } else {
               ...
            }

        });
```
So why do we have to use `{ rows: rows[0] }` ? <br>
Lets start by using the good old Console.Log() with rows only without Stored procedures<br>
We would probably get something like this: <br>
```
RowDataPacket {
      id: ..,
      title: ..,
      price: ..,
      img: ..,
      info: ..,
    }.....
```
But with stored procedures we get something like this: <br>
```
...
RowDataPacket {
      id: ..,
      title: ..,
      price: ..,
      img: ..,
      info: ..
    }
  ],
  OkPacket {
    fieldCount: 0,
    affectedRows: 0,
    insertId: 0,
    serverStatus: 34,
    warningCount: 0,
    message: '',
    protocol41: true,
    changedRows: 0
  }
]
```
And for that reason we have to use the first one with our data (rows[0]) otherwise we would get an error or the project would load without displaying our data.
## ROUTE NOTE
For some reason and i still can't find the solution or why in the `user.js` file every route that goes below <br>
```javascript
router.get('/:id',userController.delete);
```
just won't load and displays an `DOUBLE value error`
