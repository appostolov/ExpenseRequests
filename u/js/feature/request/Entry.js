define([
    "const/widget",
    "util/Model",
    "const/state",
    "feature/user/User",
    "feature/request/Status"
], function(
    WIDGET,
    Model,
    STATE,
    User,
    Status
){
    return {
        key: "entry",
        type: WIDGET.TYPE.BLOCK,
        className: "flexNone flexWrap paddingSmall cursorPointer",
        children: [
            Object.assign(
                {},
                User,
                {
                    beforeInit: function(){
                        var entry = this.getParentBy({ key: "entry" });
                        this.model = new Model( this.getUser() );
                    },
                    getUser: function(){
                        var entry = this.getParentBy({ key: "entry" });
                        var request = entry.model.getData();
                        var requester = STATE.users[ request.requesterId ];

                        return requester;
                    },
                    className: "flexNone wrapable"
                }
            ),
            {
                type: WIDGET.TYPE.BLOCK,
                className: "flexNone wrapable alignItemsCenter justifyContentStart paddingMedium italic textColor",
                onModelChange: function( data ){
                    this.node.innerHTML = data.values.expenseType;
                },
                afterInit: function(){
                    var entry = this.getParentBy({ key: "entry" });
                    this.modelSubscribe( entry.model, this.onModelChange.bind( this ) );
                }
            },
            {
                type: WIDGET.TYPE.BLOCK,
                className: "flexNone wrapable alignItemsCenter justifyContentStart paddingMedium bold",
                onModelChange: function( data ){
                    this.node.innerHTML = ( data.values.amountCents / 100 ) + "$";
                },
                afterInit: function(){
                    var entry = this.getParentBy({ key: "entry" });
                    this.modelSubscribe( entry.model, this.onModelChange.bind( this ) );
                }
            },
            Object.assign(
                {},
                User,
                {
                    beforeInit: function(){
                        var entry = this.getParentBy({ key: "entry" });
                        this.model = new Model( this.getUser() );
                    },
                    getUser: function(){
                        var entry = this.getParentBy({ key: "entry" });
                        var request = entry.model.getData();
                        var requester = STATE.users[ request.approverId ];

                        return requester;
                    },
                    className: "wrapable justifyContentEnd"
                }
            ),
            {
                type: WIDGET.TYPE.BLOCK,
                className: "wrapable justifyContentEnd paddingSmall bold",
                children: [
                    Object.assign(
                        {},
                        Status,
                        {
                            beforeInit: function(){
                                var entry = this.getParentBy({ key: "entry" });
                                this.model = new Model( entry.model.getData() );
                            }
                        }
                    )
                ]
            }
        ]
    };
});