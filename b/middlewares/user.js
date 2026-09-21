var data = require( "../data/export" );

module.exports = {

    auth: function( req, res, next ){
        
        var user = req.get( "x-user-id" );
        var entry = data.users[ user ];

        next( ( entry || req.method !== "POST" ) ? undefined : {
            status: 403,
            body: {
                message: "Invalid user"
            }
        });
    }
};