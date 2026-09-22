define( function(){
        
        return {
    
            tag: function(){
                
                var tag = document.querySelector( "style#colors" );

                if( !tag ){

                    tag = document.createElement( "STYLE" );
                    tag.id = "colors";

                    document.querySelector( "head" ).appendChild( tag );
                }
                return tag;
            },
    
            deploy: function( colors ){

                this.tag().innerHTML = this.css( colors );
            },
    
            css: function( colors ){

                var result = "";
                var color;
            
                for( var name in colors ){

                    if( !colors.hasOwnProperty( name ) ) continue;

                    color = colors[ name ];

                    result += "." + name + "BackgroundColor{background-color:" + color + " !important;}";
                    result += "." + name + "Color{color:" + color + " !important;}";
                    result += "." + name + "BorderColor{border-color:" + color + " !important;}";
                    result += "." + name + "AccentColor{accent-color:" + color + " !important;}";
                }
                return result;
            },

            extractRgb: function( string ){
                var start = string.slice( string.indexOf( "rgb" ) );
                var rgb = start.slice( 0, start.indexOf( ")" ) + 1 );
                return rgb;
            },

            rgbHex: function( rgb ){
                var open = rgb.indexOf( "(" );
                var close = rgb.indexOf( ")" );
                var inner = rgb.substring( open + 1, close );
                var split = inner.split( "," );
                var r = parseInt( split[ 0 ].replaceAll( " ", "" ) );
                var g = parseInt( split[ 1 ].replaceAll( " ", "" ) );
                var b = parseInt( split[ 2 ].replaceAll( " ", "" ) );

                return "#" + this.intHex( r ) + this.intHex( g ) + this.intHex( b );
            },

            intHex: function( int ){
                var hex = int.toString( 16 );
                return hex.length === 1 ? "0" + hex : hex;
            }
        };
    });