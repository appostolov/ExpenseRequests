define( function(){

    return {

        isString: function( target ){

            return !!( typeof target === "string" );
        },

        isNumber: function( target ){

            return !!( typeof target === "number" );
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

        isObjectEmpty: function( target ){
            if( !this.isObject( target ) ) return false;
            if( Object.keys( target ).length ) return false;

            return true;
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

        path: function( source, target ){
            if( target === source ) return "";
            if( Array.isArray( source ) ){
                for( var a = 0; a < source.length; a++ ){
                    var step = this.path( source[ a ], target );
                    if( step ) return a + "/" + step;
                    else if( step === "" ) return a + "";
                }
            }
            else if( this.isObject( source ) ){
                for( var a in source ){
                    if( !source.hasOwnProperty( a ) ) continue;
                    var step = this.path( source[ a ], target );
                    if( step ) return a + "/" + step;
                    else if( step === "" ) return a + "";
                }
            }
        },

        delete: function( source, target ){
            if( source === target ) return;
            var path = this.path( source, target );
            if( !path ) return;
            var step = path.split( "/" );
            var last = step.pop();
            var parent = this.get( source, step.join( "/" ) );
            if( parent && parent[ last ] === target ){
                delete parent[ last ];
                return true;
            }
        },

        copy: function( source, deep, funcs ){

            if( !this.isObjectOrArray( source ) ) return source;

            var self = this;
            var windowKey = "[window]";
            var domKey = "[DOM]";
            var domNodes = {};
            var domCount = 0;
            var fileKey = "[File]";
            var fileNodes = {};
            var fileCount = 0;

            if( !deep ){

                if( this.isObject( source ) ) return Object.assign( {}, source );

                else return source.slice();
            }
            else if( !funcs ){

                return JSON.parse(
                    JSON.stringify(
                        source,
                        function( key, value ){
                            if( value === window ){
                                return windowKey;
                            }
                            else if( value instanceof HTMLElement ){
                                var key = domKey + domCount;
                                domNodes[ key ] = value;
                                domCount++;
                                return key;
                            }
                            else if( value instanceof File ){
                                var key = fileKey + fileCount;
                                fileNodes[ key ] = value;
                                fileCount++;
                                return key;
                            }
                            else return value;
                        }
                    ),
                    function( key, value ){
                        if( value === windowKey ){
                            return window;
                        }
                        else if( self.isString( value ) && value.indexOf( domKey ) === 0 ){
                            return domNodes[ value ];
                        }
                        else if( self.isString( value ) && value.indexOf( fileKey ) === 0 ){
                            return fileNodes[ value ];
                        }
                        else return value;
                    }
                );
            }
            else{
                var copy = JSON.parse(
                    JSON.stringify(
                        source,
                        function( key, value ){
                            if( value === window ){
                                return windowKey;
                            }
                            else if( value instanceof HTMLElement ){
                                var key = domKey + domCount;
                                domNodes[ key ] = value;
                                domCount++;
                                return key;
                            }
                            else return value;
                        }
                    ),
                    function( key, value ){
                        if( value === windowKey ){
                            return window;
                        }
                        else if( self.isString( value ) && value.indexOf( domKey ) === 0 ){
                            return domNodes[ value ];
                        }
                        else return value;
                    }
                );

                this.copyFunctions( copy, source );

                return copy;
            }
        },

        copyFunctions: function( target, source ){

            if( source === window || source instanceof HTMLElement ) return;
            
            if( Array.isArray( source ) ){

                for( var a = 0; a < source.length; a++ ){

                    if( this.isFunction( source[ a ] ) ) target[ a ] = source[ a ];

                    else if( this.isObjectOrArray( source[ a ] ) ) this.copyFunctions( target[ a ], source[ a ] );
                }
            }
            else if( this.isObject( source ) ){

                for( var key in source ){

                    if( !source.hasOwnProperty( key ) ) continue;

                    if( this.isFunction( source[ key ] ) ) target[ key ] = source[ key ];

                    else if( this.isObjectOrArray( source[ key ] ) ) this.copyFunctions( target[ key ], source[ key ] );
                }
            }
        },
        
        equal: function( source, target ){
            if( typeof source !== typeof target ) return false;
            else if( source === target ) return true;
            else if( Array.isArray( source ) && Array.isArray( target ) ){
                if( source.length !== target.length ) return false;
                for( var a = 0; a < source.length; a++ ){
                    if( !this.equal( source[ a ], target[ a ] ) ) return false;
                }
                return true;
            }
            else if( this.isObject( source ) && this.isObject( target ) ){
                var sourceKeys = Object.keys( source );
                var targetKeys = Object.keys( target );

                if( sourceKeys.length !== targetKeys.length ) return false;

                for( var a = 0; a < sourceKeys.length; a++ ){
                    if( targetKeys.indexOf( sourceKeys[ a ] ) === -1 ) return false;
                    if( !this.equal( source[ sourceKeys[ a ] ], target[ sourceKeys[ a ] ] ) ) return false;
                }
                return true;
            }
        },

        parseJSON: function( json, def ){
            var result;
            try{
                result = JSON.parse( json );
            }
            catch( err ){
                return def;
            }
            return result;
        },

        loop: function( target, check, stop, key ){
            if( !this.isFunction( check ) ) return;
            if( this.isFunction( stop ) && stop( target, key ) ) return;
            if( Array.isArray( target ) ){
                for( var a = 0; a < target.length; a++ ){
                    if( this.isFunction( stop ) && stop( target[ a ], a ) ) return;
                    this.loop( target[ a ], check, stop, a );
                }
            }
            else if( this.isObject( target ) ){
                for( var a in target ){
                    if( !target.hasOwnProperty( a ) ) continue;
                    if( this.isFunction( stop ) && stop( target[ a ], a ) ) return;
                    this.loop( target[ a ], check, stop, a );
                }
            }
            else check( target, key );
        },

        startUpperCase: function( word ){
            return word.charAt( 0 ).toUpperCase() + word.slice( 1 );
        }
    };
});