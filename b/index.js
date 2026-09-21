var express = require( "express" );
var expenseRoute = require( "./routes/expense" );
var middleware = require( "./middlewares/common" );
var userMiddleware = require( "./middlewares/user" );

var app = express();
app.use( express.json() );

app.use( express.static( '../u' ) );

app.use( userMiddleware.auth );

app.use( "/expense", expenseRoute );

app.use( middleware.send );
app.use( middleware.error );

app.listen( 3000 );