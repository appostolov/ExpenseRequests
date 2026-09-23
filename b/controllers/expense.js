var data = require( "../data/export" );
var schema = require( "../middlewares/schema" );
var dataUtils = require( "../utils/data" );

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
                    errors: parsed.error.format()._errors
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
            var parsed = zod.safeParse( request.body.values );
            if( !parsed.success ) return rej({
                code: 400,
                body: {
                    errors: parsed.error.format()._errors
                }
            });

            // Generate new entry
            var newRequest = this.newExpenseRequest( parsed.data );
            // Save
            data.requests[ id ] = newRequest;
            // Response
            res( newRequest );
        }.bind( this ));
    },

    update: function( request ){

        return new Promise( function( res, rej ){

            // Check input's validity
            var zod = schema.save();
            var parsed = zod.safeParse( request.body.values );
            if( !parsed.success ) return rej({
                code: 400,
                body: {
                    errors: parsed.error.format()._errors
                }
            });

            var item = data.requests[ request.body.id ];
            if( !item ) return rej({
                code: 404,
                body: {
                    errors: [ "Item not found" ]
                }
            });

            var user = request.get( "x-user-id" );
            if( item.requesterId !== user ) return rej({
                code: 403,
                body: {
                    errors: [ "Unauthorized access" ]
                }
            });
            
            if( item.status === "approved" ) return rej({
                code: 400,
                body: {
                    errors: [ "Request is approved" ]
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
    },

    submit: function( request ){

        return new Promise( function( res, rej ){

            // Check input's validity
            var zod = schema.submit();
            var parsed = zod.safeParse( request.body.values );
            if( !parsed.success ) return rej({
                code: 400,
                body: {
                    errors: parsed.error.format()._errors
                }
            });

            var item;
            if( request.body.id ) item = data.requests[ request.body.id ];
            else item = this.newExpenseRequest( parsed.data );
            
            if( !item ) return rej({
                code: 404,
                body: {
                    errors: [ "Item not found" ]
                }
            });

            var user = request.get( "x-user-id" );
            if( item.requesterId !== user ) return rej({
                code: 403,
                body: {
                    errors: [ "Unauthorized access" ]
                }
            });
            
            if( item.status === "approved" ) return rej({
                code: 400,
                body: {
                    errors: [ "Can't submit approved request" ]
                }
            });

            if( item.status === "submitted" ) return rej({
                code: 400,
                body: {
                    errors: [ "Can't submit twice" ]
                }
            });

            if( item.status === "rejected" && dataUtils.equal( request.body.values, item.values ) ) return rej({
                code: 400,
                body: {
                    errors: [ "Can't submit rejected request without changes" ]
                }
            });

            var approver = this.findApproved( item );
            if( !approver ) return rej({
                code: 400,
                body: {
                    errors: [ "Back off finance guy" ]
                }
            });

            // Update the request
            item.values = request.body.values;
            item.status = "submitted";
            item.approverId = approver.id;
            item.events.push({
                type: "submitted",
                at: new Date().toISOString(),
                actorId: user,
                approverId: approver.id
            });
            // Response
            res( item );
        }.bind( this ));
    },

    approve: function( request ){

        return new Promise( function( res, rej ){

            var item = data.requests[ request.body.id ];
            
            if( !item ) return rej({
                code: 404,
                body: {
                    errors: [ "Item not found" ]
                }
            });

            var user = request.get( "x-user-id" );
            if( item.approverId !== user ) return rej({
                code: 403,
                body: {
                    errors: [ "Unauthorized access" ]
                }
            });
            
            if( item.status !== "submitted" ) return rej({
                code: 400,
                body: {
                    errors: [ "Request is not submitted for apporove" ]
                }
            });

            var action = request.body.approve ? "approved" : "rejected"

            // Update the request
            item.status = action;
            item.events.push({
                type: action,
                at: new Date().toISOString(),
                actorId: user
            });
            // Response
            res( item );
        });
    },

    newExpenseRequest: function( values ){
        var id = "REQ-" + Object.keys( data.requests ).length; // Buggy
        var user = request.get( "x-user-id" );
        return {
            id: id,
            requesterId: user,
            values: values,
            status: "open",
            events: [{
                type: "created",
                at: new Date().toISOString(),
                actorId: user
            }]
        };
    },

    findApproved: function( request ){
        var finance = data.users[ "u_trent" ];
        var requester = data.users[ request.requesterId ];
        var approver = data.users[ requester.managerId ];
        if( request.values.amountCents >= 100000 || !approver ) approver = finance;
        
        if( approver !== requester && approver !== finance ) return approver;
    }
};