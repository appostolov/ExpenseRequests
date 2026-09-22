var data = require( "../data/export" );

module.exports = {

    select: function( request ){

        return new Promise( function( res, rej ){

            res( data.users );
        });
    }
};