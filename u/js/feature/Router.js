define([
    "const/widget",
    "const/event",
    "const/config",
    "manager/UserManager",
    "manager/DataManager",
    "manager/URLManager",
    "feature/NotFound",
    "feature/user/Picker"
], function(
    WIDGET,
    EVENT,
    CONFIG,
    UserManager,
    DataManager,
    URLManager,
    NotFound,
    Picker
){

    return {
        type: WIDGET.TYPE.BLOCK,
        className: "positionRelative maxWidth960 backBackgroundColor",
        pages: [
            NotFound,
            Picker
        ],
        afterInit: function(){

            this.handleURLHash();
        },
        handleURLHash: function(){

            var routeObj = URLManager.route;
            var route = DataManager.isObjectEmpty( URLManager.route ) ? null : URLManager.route.route;

            if( route === this.lastRoute ) return;
            this.lastRoute = route;

            switch( route ){
                case "":
                case "users":
                    this.showContent( "users" );
                    break;
                default:
                    this.showContent( "notFound" );
                    break;
            }
        },
        showContent: function( key ){

            var children = this.getChildren();
            var child, found;
            for( var a = 0; a < children.length; a++ ){
                child = children[ a ];
                if( child.key === key ){
                    found = child;
                    child.show();
                }
                else child.hide();
            }
            if( !found ){
                this.createContent( key );
            }
        },
        createContent: function( key ){
            for( var a = 0; a < this.pages.length; a++ ){
                if( this.pages[ a ].key === key ){
                    this.addChildren([
                        this.pages[ a ]
                    ]);
                    return;
                }
            }
        },
        events: [
            {
                type: "hashchange",
                node: window,
                listener: function( e ){
                    this.handleURLHash();
                }
            }
        ]
    };
});