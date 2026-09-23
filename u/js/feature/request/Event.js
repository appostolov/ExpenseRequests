define([
    "const/widget",
    "util/Model",
    "const/state",
    "feature/user/User",
    "feature/request/Status",
    "manager/DataManager"
], function(
    WIDGET,
    Model,
    STATE,
    User,
    Status,
    DataManager
){
    return {
        key: "event",
        type: WIDGET.TYPE.BLOCK,
        className: "flexNone flexWrap paddingSmall cursorPointer",
        children: [
            Object.assign(
                {},
                User,
                {
                    beforeInit: function(){
                        this.model = new Model( this.getUser() );
                    },
                    getUser: function(){
                        var event = this.getParentBy({ key: "event" });
                        var data = event.model.getData();
                        var actor = STATE.users[ data.actorId ];

                        return actor;
                    },
                    className: "flexNone wrapable"
                }
            ),
            {
                type: WIDGET.TYPE.BLOCK,
                className: "flexNone wrapable alignItemsCenter justifyContentStart paddingMedium italic textColor",
                onModelChange: function( data ){
                    this.node.innerHTML = data.type;
                },
                afterInit: function(){
                    var event = this.getParentBy({ key: "event" });
                    this.modelSubscribe( event.model, this.onModelChange.bind( this ) );
                }
            },
            Object.assign(
                {},
                User,
                {
                    beforeInit: function(){
                        this.model = new Model( this.getUser() );
                    },
                    getUser: function(){
                        var event = this.getParentBy({ key: "event" });
                        var data = event.model.getData();
                        var approver = STATE.users[ data.approverId ];

                        return approver;
                    },
                    className: "wrapable justifyContentEnd"
                }
            ),
            {
                type: WIDGET.TYPE.BLOCK,
                className: "flexNone wrapable alignItemsCenter justifyContentEnd paddingMedium fontSizeSmall",
                onModelChange: function( data ){
                    if( !DataManager.isString( data.at ) ) return;
                    this.node.innerHTML = data.at.split( "T" )[ 0 ];
                },
                afterInit: function(){
                    var event = this.getParentBy({ key: "event" });
                    this.modelSubscribe( event.model, this.onModelChange.bind( this ) );
                }
            }
        ]
    };
});