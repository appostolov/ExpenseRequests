module.exports = {

    isString: function( target ){

        return !!( typeof target === "string" );
    },
    
    isNumber: function( target ){

        return !!( typeof target === "number" );
    },

    isBoolean: function( target ){

        return !!( typeof target === "boolean" );
    },
    
    isFunction: function( target ){

        return !!( typeof target === "function" );
    },

    isObject: function( target ){

        if(
            typeof target === "object"
            && !Array.isArray( target )
            && target !== null
        ){
            return true;
        }
        return false;
    },

    isObjectOrArray: function( target ){

        return !!( typeof target === "object" && target !== null );
    },

    isIterable: function( target ){

        return typeof target[ Symbol.iterator ] === 'function';
    },

    get: function( source, path ){
    
        if( !this.isObjectOrArray( source ) ) return undefined;

        if( path && !this.isString( path ) ) return undefined;

        if( !path ) return source;

        var steps = path.split( "/" );
        var temp = source;

        for( var a = 0; a < steps.length; a++ ){

            var key = steps[ a ];

            if( a === steps.length - 1 ) return temp[ key ];
            else{
                temp = temp[ key ];

                if( !this.isObjectOrArray( temp ) ) return undefined;
            }
        }
    },

    set: function( target, path, value ){
        
        if( path && !this.isString( path ) ) return undefined;

        if( !path ){

            target = value;

            return target;
        }

        if( !this.isObjectOrArray( target ) ) target = {};

        var steps = path.split( "/" );
        var temp = target;

        for( var a = 0; a < steps.length; a++ ){

            var key = steps[ a ];

            if( a < steps.length - 1 ){

                if( !this.isObjectOrArray( temp[ key ] ) ) temp[ key ] = {};

                temp = temp[ key ];
            }
            else{
                temp[ key ] = value;
            }
        }
        return target;
    },

    copy: function( source, deep, funcs ){

        if( !this.isObjectOrArray( source ) ) return source;

        if( !deep ){

            if( this.isObject( source ) ) return Object.assign( {}, source );

            else return source.slice();
        }
        else if( !funcs ){

            return JSON.parse( JSON.stringify( source ) );
        }
        else{
            var copy = JSON.parse( JSON.stringify( source ) );

            this.copyFunctions( copy, source );
        }
    },

    copyFunctions: function( target, source ){

        var keys = Object.keys( source );

        for( var a = 0; a < keys.length; a++ ){

            var key = keys[ a ];

            if( this.isFunction( source[ key ] ) ) target[ key ] = source[ key ];

            else if( this.isObjectOrArray( source[ key ] ) ) this.copyFunctions( target[ key ], source[ key ] );
        }
    }
};