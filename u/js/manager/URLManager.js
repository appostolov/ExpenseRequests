define([
    "manager/DataManager"
], function(
    DataManager
){
    var URLManager = {
        last: null,
        routes: [
            ""
        ],
        get route(){
            return this.parse( window.location.hash ) || {};
        },
        parse: function( hash ){

            if( hash.indexOf( "#" ) === 0 ) hash = hash.substring( 1 );

            var route = this.match( hash );
            if( !DataManager.isString( route ) ) return null;

            var routeParts = route.split( "/" );
            var hashParts = hash.split( "/" );
            var result = {
                hash: hash,
                route: route,
                params: {},
                data: this.extractData( hash )
            };

            for( var a = 0; a < routeParts.length; a++ ){
                if( routeParts[ a ].indexOf( "?" ) === -1 ) continue;
                var key = routeParts[ a ].substring( 1 );
                var value = decodeURIComponent( hashParts[ a ] );
                result.params[ key ] = value;
            }
            return result;
        },
        hash: function( data ){
            if( this.routes.indexOf( data.route ) === -1 ) return null;
            var routeParts = data.route.split( "/" );
            var hash = "";
            for( var a = 0; a < routeParts.length; a++ ){
                if( a > 0 ){
                    hash += "/";
                }
                if( routeParts[ a ].indexOf( "?" ) === -1 ){
                    hash += routeParts[ a ];
                }
                else{
                    var key = routeParts[ a ].substring( 1 );
                    if( !DataManager.isObject( data.params ) || !data.params.hasOwnProperty( key ) ) return null;
                    var value = encodeURIComponent( data.params[ key ] );
                    hash += value;
                }
            }
            return this.appendData( hash, data.data );
        },
        match: function( hash ){

            if( hash.indexOf( "#" ) === 0 ) hash = hash.substring( 1 );

            var data = this.extractData( hash );
            if( data ) hash = hash.substring( 0, hash.lastIndexOf( "/" ) );

            var index = this.routes.indexOf( hash );
            if( index > -1 && this.routes[ index ].indexOf( "?" ) === -1 ) return this.routes[ index ];

            var hashParts = hash.split( "/" );
            var sameLength = this.routes.filter(function( route ){
                return route.split( "/" ).length === hashParts.length;
            });
            var sameStaticParts = sameLength.filter(function( route ){
                var routeParts = route.split( "/" );
                for( var a = 0; a < routeParts.length; a++ ){
                    if( routeParts[ a ].indexOf( "?" ) === -1 && routeParts[ a ] !== hashParts[ a ] ) return false;
                }
                return true;
            });
            return sameStaticParts[ 0 ];
        },
        navigate: function( data, replace ){
            
            var hash = this.hash( data );
            if( hash === null ) return null;
            if( !DataManager.isString( this.match( hash ) ) ) return null;
            if( hash && hash.charAt( 0 ) !== "#" ) hash = "#" + hash;

            this.last = window.location.hash;
            if( replace ){
                window.history.replaceState({ index: this.history.index }, "", window.location.href.split( "#" )[ 0 ] + hash );
                var event = new HashChangeEvent(
                    "hashchange",
                    {
                        oldURL: this.last,
                        newURL: hash
                    });
                window.dispatchEvent( event )
            }
            else window.location.hash = hash;
        },
        extractData: function( hash ){

            var parts = hash.split( "/" );
            var last = parts[ parts.length - 1 ];
            if( last.indexOf( "#" ) === 0 ) last = last.substring( 1 );
    
            try{
                var data = JSON.parse( decodeURIComponent( last ) );
                return data;
            }
            catch( e ){
                return null;
            }
        },
        appendData: function( hash, data ){
    
            var result = hash;
            var hashData = this.extractData( hash );

            if( hashData ) result = result.substring( 0, result.lastIndexOf( "/" ) );

            if( DataManager.isObject( data ) && Object.keys( data ).length ){
                if( result ) result += "/";
                result += encodeURIComponent( JSON.stringify( data ) );
            }
            return result;
        },

        updateData: function( data, replace ){
            var hash = this.appendData( window.location.hash, data );
            if( hash.charAt( 0 ) !== "#" ) hash = "#" + hash;

            var route = this.parse( hash );
            this.navigate( route, replace );
        },

        handlePopState: function( e ){
            if( e.state ) this.history.index = e.state.index;
            else{
                if( this.history.index < this.history.states.length - 1 ) this.history.states.splice( this.history.index );
                this.history.states.push( window.location.hash );
                this.history.index = this.history.states.length - 1;
                window.history.replaceState({ index: this.history.index }, "" );
            }
        },

        getHashFromHistory: function( distance ){
            var index = this.history.index + distance;
            if( index < 0 || index >= this.history.states.length ) return null;

            return this.history.states[ index ];
        }
    };
    URLManager.history = {
        index: 0,
        states: [ window.location.hash ]
    };
    window.history.replaceState({ index: 0 }, "" );
    window.addEventListener( "popstate", URLManager.handlePopState.bind( URLManager ) );
    return URLManager;
});