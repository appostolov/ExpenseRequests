module.exports = {

    send: function( req, res ){
        var success = {
            status: 200,
            body: {}
        };
        if( res.success ) success = Object.assign( success, res.success );
        res.setHeader( "Content-Type", "application/json" );
        res.status( success.status ).send( JSON.stringify( success.body ) );
    },

    error: function( err, req, res, next ){
        var error = Object.assign(
            {
                status: 500,
                body: {
                    code: 0,
                    message: "Something is wrong"
                }
            },
            err
        );
        res.setHeader( "Content-Type", "application/json" );
        res.status( error.status ).send( JSON.stringify( error.body ) );
    }
};