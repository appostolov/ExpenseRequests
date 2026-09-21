var express = require( "express" );
var expenseRoute = require( "./routes/expense" );
var middleware = require( "./middlewares/common" );

var app = express();

app.use( express.static( '../u' ) );
app.use( "/expense", expenseRoute );

app.use( middleware.send );
app.use( middleware.error );

app.listen( 3000 );