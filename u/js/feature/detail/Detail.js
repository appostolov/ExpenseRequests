define([
    "const/widget",
    "const/state",
    "const/icon",
    "util/Model",
    "feature/detail/Header",
    "feature/detail/History",
    "manager/URLManager"
], function(
    WIDGET,
    STATE,
    ICON,
    Model,
    Header,
    History,
    URLManager
){
    return {
        key: "detail",
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
                        var detail = this.getParentBy({ key: "detail" });
                        this.model = detail.model;
                    }
                }
            ),
            Object.assign(
                {},
                History,
                {
                    beforeInit: function(){
                        var detail = this.getParentBy({ key: "detail" });
                        this.model = detail.model;
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