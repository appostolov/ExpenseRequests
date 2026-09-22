define([
    "const/widget",
    "util/Model",
    "const/state",
    "feature/user/User",
    "const/event"
], function(
    WIDGET,
    Model,
    STATE,
    User,
    EVENT
){
    return {
        key: "users",
        type: WIDGET.TYPE.BLOCK,
        className: "column overflowAuto",
        beforeInit: function(){
            this.model = new Model();
            this.request({
                method: "POST",
                url: "/user/select",
                success: function( data ){
                    STATE.users = data.users;
                    this.model.setData( STATE.users );
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

            var users = Object.values( data );

            if( !Array.isArray( users ) || !users.length ) return;

            var children = [];

            for( var a = 0; a < users.length; a++ ){

                children.push(
                    Object.assign(
                        {},
                        User,
                        {
                            user: users[ a ],
                            beforeInit: function(){
                                this.model = new Model( this.user )
                            },
                            className: "flexNone paddingMedium cursorPointer justifyContentCenter",
                            events: [
                                {
                                    type: "click",
                                    self: true,
                                    listener: function(){
                                        STATE.user = this.user;
                                        this.event( EVENT.USER.PICKED, { id: this.user.id } );
                                    }
                                }
                            ]
                        }
                    )
                );
            }
            this.addChildren( children );
        }
    };
});