var express = require( "express" );
var expense = require( "./routes/expense" );
var common = require( "./middlewares/common" );
var user = require( "./routes/user" );
var userMiddleware = require( "./middlewares/user" );

var app = express();
app.use( express.json() );

app.use( express.static( '../u' ) );

app.use( userMiddleware.auth );

app.use( "/user", user );
app.use( "/expense", expense );

app.use( common.send );
app.use( common.error );

app.listen( 3000 );