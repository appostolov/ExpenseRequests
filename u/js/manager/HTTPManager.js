define([
    "const/state"
], function(
    STATE
){

    return {

        request: function( data ){

            return new Promise(function( res, rej ){

                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if( this.readyState === 4 ){
                        var result;
                        var type = this.getResponseHeader("Content-Type");
                        if( !type || type.indexOf( "application/json" ) === 0 ){
                            try{
                                result = JSON.parse( xhttp.responseText );
                            }
                            catch( err ){
                                result = xhttp.responseText;
                            }
                        }
                        else result = xhttp.responseText;
                    }

                    if( this.readyState === 4 ){
                        if( this.status >= 200 && this.status < 300 ) return res({
                            result: result,
                            xhttp: xhttp
                        });
                        else return rej({
                            result: result,
                            xhttp: xhttp
                        });
                    }
                };
                xhttp.open( data.method, data.url, true);
                xhttp.setRequestHeader( "Content-Type", "application/json" );
                if( STATE.user ) xhttp.setRequestHeader( "X-User-Id", STATE.user.id );
                if( data.headers ){
                    for( var name in data.headers ){
                        if( !data.headers.hasOwnProperty( name ) ) continue;
                        xhttp.setRequestHeader( name, data.headers[ name ] );
                    }
                }
                if( data.method === "GET" ) xhttp.send( data.data ? this.parameters( data.data ) : null );
                else if( data.method === "POST" ){
                    if( data.raw ) xhttp.send( data.data );
                    else xhttp.send( JSON.stringify( data.data ) );
                }
                else return rej();

            }.bind( this ));
        },

        parameters: function( data ){

            var result = "";
            for( var name in data ){
                if( !data.hasOwnProperty( name ) ) continue;
                if( result ) result += "&";
                result += encodeURIComponent( name );
                result += "=";
                result += encodeURIComponent( data[ name ] );
            }
            return result;
        }
    };
});