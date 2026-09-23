define([
    "const/widget",
    "const/state",
    "const/icon",
    "util/Model",
    "manager/URLManager",
    "dialog/Standard"
], function(
    WIDGET,
    STATE,
    ICON,
    Model,
    URLManager,
    Dialog
){
    return {
        key: "header",
        type: WIDGET.TYPE.BLOCK,
        className: "flexNone flexWrap justifyContentEnd borderSolid borderBottomTiny lightTextBorderColor",
        children: [
            {
                type: WIDGET.TYPE.BUTTON,
                buttonType: WIDGET.BUTTON.TYPE.BORDER,
                icon: ICON.EDIT,
                html: " Edit",
                className: "wrapable marginSmall",
                afterInit: function(){
                    var header = this.getParentBy({ key: "header" })
                    this.modelSubscribe( header.model, this.onModelChange.bind( this ) );
                },
                onModelChange: function( data ){
                    if( data.requesterId !== STATE.user.id ) this.hide();
                    else if( data.status === "submitted" ) this.hide();
                    else if( data.status === "approved" ) this.hide();
                    else this.show();
                },
                events: [
                    {
                        type: "click",
                        self: true,
                        listener: function(){
                            URLManager.navigate({
                                route: "request/?id/edit",
                                params: {
                                    id: URLManager.route.params.id
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
                afterInit: function(){
                    var header = this.getParentBy({ key: "header" })
                    this.modelSubscribe( header.model, this.onModelChange.bind( this ) );
                },
                onModelChange: function( data ){
                    if( data.requesterId !== STATE.user.id ) this.hide();
                    else if( data.status === "submitted" ) this.hide();
                    else if( data.status === "approved" ) this.hide();
                    else this.show();
                },
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
                                                dialogType: WIDGET.DIALOG.ERROR,
                                                data: {
                                                    message: "Request submit failed"
                                                }
                                            },
                                            Dialog
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
                html: "Reject",
                className: "wrapable rejectedBackgroundColor borderNone marginSmall",
                afterInit: function(){
                    var header = this.getParentBy({ key: "header" })
                    this.modelSubscribe( header.model, this.onModelChange.bind( this ) );
                },
                onModelChange: function( data ){
                    if( data.approverId !== STATE.user.id ) this.hide();
                    else if( data.status !== "submitted" ) this.hide();
                    else this.show();
                },
                events: [
                    {
                        type: "click",
                        self: true,
                        listener: function(){
                            var header = this.getParentBy({ key: "header" });
                            var data = header.model.getData();
                            this.request({
                                method: "POST",
                                url: "/expense/approve",
                                data: {
                                    id: data.id
                                },
                                success: function( data ){
                                    header.model.setData( data.request );
                                    this.addChildren([
                                        Object.assign(
                                            {
                                                dialogType: WIDGET.DIALOG.SUCCESS,
                                                data: {
                                                    message: "Request rejected"
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
                                                dialogType: WIDGET.DIALOG.ERROR,
                                                data: {
                                                    message: "Request reject failed"
                                                }
                                            },
                                            Dialog
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
                html: "Approve",
                className: "wrapable approvedBackgroundColor borderNone marginSmall",
                afterInit: function(){
                    var header = this.getParentBy({ key: "header" })
                    this.modelSubscribe( header.model, this.onModelChange.bind( this ) );
                },
                onModelChange: function( data ){
                    if( data.approverId !== STATE.user.id ) this.hide();
                    else if( data.status !== "submitted" ) this.hide();
                    else this.show();
                },
                events: [
                    {
                        type: "click",
                        self: true,
                        listener: function(){
                            var header = this.getParentBy({ key: "header" });
                            var data = header.model.getData();
                            this.request({
                                method: "POST",
                                url: "/expense/approve",
                                data: {
                                    id: data.id,
                                    approve: true
                                },
                                success: function( data ){
                                    header.model.setData( data.request );
                                    this.addChildren([
                                        Object.assign(
                                            {
                                                dialogType: WIDGET.DIALOG.SUCCESS,
                                                data: {
                                                    message: "Request approved"
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
                                                dialogType: WIDGET.DIALOG.ERROR,
                                                data: {
                                                    message: "Request approve failed"
                                                }
                                            },
                                            Dialog
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
                            URLManager.navigate({
                                route: "request"
                            });
                        }
                    }
                ]
            }
        ]
    };
});