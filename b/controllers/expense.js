var data = require( "../data/export" );
var schema = require( "../middlewares/schema" );

module.exports = {

    select: function( request ){

        return new Promise( function( res, rej ){

            res( data.requests );
        });
    },

    filter: function( request ){

        return new Promise( function( res, rej ){

            // Check input's validity
            var zod = schema.filter();
            var parsed = zod.safeParse( request.body );
            if( !parsed.success ) return rej({
                code: 400,
                body: {
                    message: "Invalid filters"
                }
            });

            // Filter expense requests
            var input = parsed.data;
            var keys = Object.keys( input );
            var requests = Object.values( data.requests );
            var filter = requests.filter(function( entry ){
                return keys.every(
                    key => entry.hasOwnProperty(key) && entry[key] === input[key]
                );
            });

            // Format the response back to map
            var result = Object.fromEntries(
                filter.map(item => [item.id, item])
            );
            res( result );
        });
    },

    insert: function( request ){

        return new Promise( function( res, rej ){

            // Check input's validity
            var zod = schema.save();
            var parsed = zod.safeParse( request.body );
            if( !parsed.success ) return rej({
                code: 400,
                body: parsed.error
            });

            // Generate new entry
            var id = "REQ-" + Object.keys( data.requests ).length; // Buggy
            var user = request.get( "x-user-id" );
            var newRequest = {
                id: id,
                requesterId: user,
                values: parsed.data,
                status: "open",
                events: [{
                    type: "created",
                    at: new Date().toISOString(),
                    actorId: user
                }]
            };
            // Save
            data.requests[ id ] = newRequest;
            // Response
            res( newRequest );
        });
    },

    update: function( request ){

        return new Promise( function( res, rej ){

            // Check input's validity
            var zod = schema.save();
            var parsed = zod.safeParse( request.body.values );
            if( !parsed.success ) return rej({
                code: 400,
                body: parsed.error
            });

            var item = data.requests[ request.body.id ];
            if( !item ) return rej({
                code: 404,
                body: {
                    message: "Item not found"
                }
            });

            var user = request.get( "x-user-id" );
            if( item.requesterId !== user ) return rej({
                code: 403,
                body: {
                    message: "Unauthorized access"
                }
            });
            
            if( item.status === "approved" ) return rej({
                code: 400,
                body: {
                    message: "Request is approved"
                }
            });

            // Update the request
            item.values = request.body.values;
            item.status = "open";
            item.events.push({
                type: "updated",
                at: new Date().toISOString(),
                actorId: user
            });
            // Response
            res( item );
        });
    }
};