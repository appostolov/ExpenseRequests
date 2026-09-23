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
        key: "edit",
        type: WIDGET.TYPE.BLOCK,
        className: "column",
        beforeInit: function(){
            this.model = new Model();
            this.getExpenseRequest();
        },
        getExpenseRequest: function(){
            this.request({
                method: "POST",
                url: "/expense/filter",
                data: {
                    id: URLManager.route.params.id
                },
                success: function( data ){
                    this.model.setData( data.requests[ URLManager.route.params.id ] );
                },
                error: function(){
                    // Handle Not Found
                }
            });
        },
        children: [
            Object.assign(
                {},
                Header,
                {
                    beforeInit: function(){
                        var edit = this.getParentBy({ key: "edit" });
                        this.model = edit.model;
                    }
                }
            ),
            Object.assign(
                {},
                Form,
                {
                    afterInit: function(){
                        var edit = this.getParentBy({ key: "edit" });
                        this.modelSubscribe( edit.model, this.onParentModelChange.bind( this ) );
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