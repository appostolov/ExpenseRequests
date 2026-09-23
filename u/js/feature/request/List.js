define([
    "const/widget",
    "const/icon",
    "util/Model",
    "const/state",
    "feature/request/Entry",
    "manager/URLManager"
], function(
    WIDGET,
    ICON,
    Model,
    STATE,
    Entry,
    URLManager
){
    return {
        key: "requests",
        type: WIDGET.TYPE.BLOCK,
        className: "column",
        children: [
            {
                key: "header",
                type: WIDGET.TYPE.BLOCK,
                className: "flexNone flexWrap justifyContentCenter borderSolid borderBottomTiny lightTextBorderColor",
                children: [
                    {
                        type: WIDGET.TYPE.BUTTON,
                        buttonType: WIDGET.BUTTON.TYPE.SOLID,
                        icon: ICON.PLUS,
                        className: "marginSmall",
                        events: [
                            {
                                type: "click",
                                self: true,
                                listener: function(){
                                    URLManager.navigate({
                                        route: "request/new"
                                    });
                                }
                            }
                        ]
                    },
                ]
            },
            {
                key: "requests",
                type: WIDGET.TYPE.BLOCK,
                className: "column overflowAuto",
                beforeInit: function(){
                    this.model = new Model();
                    this.getRequests();
                },
                getRequests: function(){
                    this.request({
                        method: "POST",
                        url: "/expense/select",
                        success: function( data ){
                            this.model.setData( data.requests );
                        },
                        error: function(){
                            // Something went wrong
                        }
                    });
                },
                afterInit: function(){
                    this.modelSubscribe( this.model, this.onModelChange.bind( this ) );
                },
                onModelChange: function( data ){
                    this.closeChildren();

                    var requests = Object.values( data );

                    if( !Array.isArray( requests ) || !requests.length ) return;

                    var children = [];

                    for( var a = 0; a < requests.length; a++ ){

                        if( a ){
                            children.push({
                                type: WIDGET.TYPE.BLOCK,
                                className: "flexNone tiny lighterBackgroundColor"
                            });
                        }

                        children.push(
                            Object.assign(
                                {},
                                Entry,
                                {
                                    request: requests[ a ],
                                    beforeInit: function(){
                                        this.model = new Model( this.request )
                                    },
                                    events: [
                                        {
                                            type: "click",
                                            self: true,
                                            listener: function(){
                                                URLManager.navigate({
                                                    route: "request/?id",
                                                    params: {
                                                        id: this.request.id
                                                    }
                                                });
                                            }
                                        }
                                    ]
                                }
                            )
                        );
                    }
                    this.addChildren( children );
                },
                events: [
                    {
                        type: "hashchange",
                        node: window,
                        listener: function( e ){
                            if( URLManager.route.route !== this.route ) return;
                            this.getRequests();
                        }
                    }
                ]
            }
        ]
    };
});