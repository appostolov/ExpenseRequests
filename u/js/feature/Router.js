define([
    "const/widget",
    "const/event",
    "const/config",
    "const/state",
    "manager/UserManager",
    "manager/DataManager",
    "manager/URLManager",
    "feature/NotFound",
    "feature/user/Picker",
    "feature/request/List",
    "feature/detail/Detail",
    "feature/form/Edit",
    "feature/form/Create"
], function(
    WIDGET,
    EVENT,
    CONFIG,
    STATE,
    UserManager,
    DataManager,
    URLManager,
    NotFound,
    Picker,
    Requests,
    Detail,
    Edit,
    Create
){

    return {
        type: WIDGET.TYPE.BLOCK,
        className: "positionRelative maxWidth960 backBackgroundColor",
        pages: [
            NotFound,
            Picker,
            Requests,
            Detail,
            Edit,
            Create
        ],
        afterInit: function(){

            this.handleURLHash();
        },
        handleURLHash: function(){

            var routeObj = URLManager.route;
            var route = DataManager.isObjectEmpty( URLManager.route ) ? null : URLManager.route.route;

            if( route === this.lastRoute ) return;
            if( route !== "users" && !STATE.user ) return URLManager.navigate( { route: "users" } );
            this.lastRoute = route;

            switch( route ){
                case "":
                case "users":
                    this.showContent( "users" );
                    break;
                case "request":
                    this.showContent( "requests" );
                    break;
                case "request/?id":
                    this.showContent( "detail" );
                    break;
                case "request/?id/edit":
                    this.showContent( "edit" );
                    break;
                case "request/new":
                    this.showContent( "create" );
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
            },
            {
                type: EVENT.USER.PICKED,
                listener: function( e ){
                    URLManager.navigate( { route: "request" } );
                }
            }
        ]
    };
});