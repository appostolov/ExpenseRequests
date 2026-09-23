define([
    "const/widget",
    "const/state",
    "const/icon",
    "util/Model",
    "feature/form/Header",
    "feature/form/Form",
    "manager/URLManager"
], function(
    WIDGET,
    STATE,
    ICON,
    Model,
    Header,
    Form,
    URLManager
){
    return {
        key: "create",
        type: WIDGET.TYPE.BLOCK,
        className: "column",
        beforeInit: function(){
            this.model = new Model({
                values: {}
            });
        },
        children: [
            Object.assign(
                {},
                Header,
                {
                    beforeInit: function(){
                        var create = this.getParentBy({ key: "create" });
                        this.model = create.model;
                    }
                }
            ),
            Object.assign(
                {},
                Form,
                {
                    afterInit: function(){
                        var create = this.getParentBy({ key: "create" });
                        this.modelSubscribe( create.model, this.onParentModelChange.bind( this ) );
                    },
                    onParentModelChange: function( data ){
                        this.model.setData( data.values || {} );
                    }
                }
            )
        ],
        events: [
            {
                type: "hashchange",
                node: window,
                listener: function( e ){
                    if( URLManager.route.route !== this.route ) return;
                    this.getExpenseRequest();
                }
            }
        ]
    };
});