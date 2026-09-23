define([
    "const/widget",
    "const/state",
    "const/icon",
    "util/Model",
    "manager/URLManager",
    "dialog/Standard",
    "dialog/Error"
], function(
    WIDGET,
    STATE,
    ICON,
    Model,
    URLManager,
    Dialog,
    Error
){
    return {
        key: "header",
        type: WIDGET.TYPE.BLOCK,
        className: "flexNone flexWrap justifyContentEnd borderSolid borderBottomTiny lightTextBorderColor",
        children: [
            {
                type: WIDGET.TYPE.BUTTON,
                buttonType: WIDGET.BUTTON.TYPE.BORDER,
                html: "Save",
                className: "wrapable marginSmall",
                events: [
                    {
                        type: "click",
                        self: true,
                        listener: function(){
                            var header = this.getParentBy({ key: "header" });
                            var data = header.model.getData();
                            this.request({
                                method: "POST",
                                url: URLManager.route.params.id ? "/expense/update" : "/expense/insert",
                                data: data,
                                success: function( data ){
                                    header.model.setData( data.request );
                                    this.addChildren([
                                        Object.assign(
                                            {
                                                dialogType: WIDGET.DIALOG.SUCCESS,
                                                data: {
                                                    message: "Request saved"
                                                }
                                            },
                                            Dialog
                                        )
                                    ]);
                                },
                                error: function( data ){
                                    this.addChildren([
                                        Object.assign(
                                            {
                                                error: data
                                            },
                                            Error
                                        )
                                    ]);
                                }
                            });
                        }
                    }
                ]
            },
            {
                type: WIDGET.TYPE.BUTTON,
                buttonType: false,
                html: "Submit",
                className: "wrapable submittedBackgroundColor borderNone marginSmall",
                events: [
                    {
                        type: "click",
                        self: true,
                        listener: function(){
                            var header = this.getParentBy({ key: "header" });
                            var data = header.model.getData();
                            this.request({
                                method: "POST",
                                url: "/expense/submit",
                                data: {
                                    id: data.id,
                                    values: data.values
                                },
                                success: function( data ){
                                    header.model.setData( data.request );
                                    this.addChildren([
                                        Object.assign(
                                            {
                                                dialogType: WIDGET.DIALOG.SUCCESS,
                                                data: {
                                                    message: "Request submitted"
                                                }
                                            },
                                            Dialog
                                        )
                                    ]);
                                },
                                error: function( data ){
                                    this.addChildren([
                                        Object.assign(
                                            {
                                                error: data
                                            },
                                            Error
                                        )
                                    ]);
                                }
                            });
                        }
                    }
                ]
            },
            {
                type: WIDGET.TYPE.BUTTON,
                icon: ICON.CLOSE,
                className: "wrapable marginSmall",
                events: [
                    {
                        type: "click",
                        self: true,
                        listener: function(){
                            var route = URLManager.route;
                            if( route.params.id ){
                                URLManager.navigate({
                                    route: "request/?id",
                                    params: {
                                        id: route.params.id
                                    }
                                });
                            }
                            else{
                                URLManager.navigate({
                                    route: "request"
                                });
                            }
                        }
                    }
                ]
            }
        ]
    };
});