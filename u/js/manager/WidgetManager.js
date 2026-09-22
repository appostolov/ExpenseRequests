define([
    "manager/DataManager",
    "const/widget",
    "widgets/Block",
    "widgets/Button",
    "widgets/Input",
    "widgets/Select",
    "widgets/Popover",
    "widgets/Textarea"
], function(
    DataManager,
    WIDGET,
    Block,
    Button,
    Input,
    Select,
    Popover,
    Textarea
){

    var map = {};
    map[ WIDGET.TYPE.BLOCK ] = Block;
    map[ WIDGET.TYPE.BUTTON ] = Button;
    map[ WIDGET.TYPE.INPUT ] = Input;
    map[ WIDGET.TYPE.SELECT ] = Select;
    map[ WIDGET.TYPE.POPOVER ] = Popover;
    map[ WIDGET.TYPE.TEXTAREA ] = Textarea;

    var count = 0;

    var widgets = {};

    return {

        create: function( config ){

            if( !map[ config.type ] ) return null;

            config = DataManager.copy( config, true, true );

            count ++;

            config.id = this.generateId( config.id );

            widgets[ config.id ] = new map[ config.type ]();

            widgets[ config.id ].widgetManager = this;

            Object.assign( widgets[ config.id ], config );
            widgets[ config.id ].init();

            return widgets[ config.id ];
        },

        remove: function( id ){

            if( !Array.isArray( id ) ) id = [ id ];

            for( var a = 0; a < id.length; a++ ){

                delete widgets[ id[ a ] ];
            }
        },

        exists: function( id ){

            if( widgets.hasOwnProperty( id ) ) return true;

            return false;
        },

        getById: function( id ){

            if( widgets.hasOwnProperty( id ) ) return widgets[ id ];
        },

        get: function( matcher, any ){

            var result = [];

            if( !DataManager.isObject( matcher ) ) return result;

            var ids = Object.keys( widgets );
            var keys = Object.keys( matcher );

            for( var a = 0; a < ids.length; a++ ){

                var id = ids[ a ];
                var match = true;

                for( var b = 0; b < keys.length; b++ ){

                    var key = keys[ b ];

                    if( matcher[ key ] !== widgets[ id ][ key ] ){

                        match = false;

                        if( !any ) break;
                    }
                    else if( any ){

                        match = true;
                        
                        break;
                    }
                }

                if( match ) result.push( widgets[ id ] );
            }
            
            return result;
        },

        generateId: function( id ){

            var num = 0,
                result = id ? id : WIDGET.ID + count;

            while( widgets.hasOwnProperty( result ) ){

                num ++;

                if( id ){
                    result = id + "_" + num;
                }
                else result = WIDGET.ID + count + "_" + num;;
            }
            return result;
        }
    };
});