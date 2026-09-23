define([
    "const/widget",
    "const/icon",
    "manager/DataManager",
    "util/Model",
    "const/device"
], function(
    WIDGET,
    ICON,
    DataManager,
    Model,
    DEVICE
){
    return {
        key: "dialog",
        type: WIDGET.TYPE.BLOCK,
        container: document.body,
        className: "absoluteFull justifyContentCenter alignItemsCenter glassBackgroundColor paddingSmall",
        beforeInit: function(){
            this.model = new Model();
            var standard;

            switch( this.dialogType ){
                case WIDGET.DIALOG.SUCCESS:
                    standard = {
                        icon: ICON.CHECK,
                        css: {
                            color: "successColor",
                            backgroundColor: "successBackgroundColor",
                            borderColor: "successBorderColor"
                        },
                        header: "Success",
                        message: "Operation completed successfully"
                    };
                    break;
                case WIDGET.DIALOG.ERROR:
                    standard = {
                        icon: ICON.ERROR,
                        css: {
                            color: "errorColor",
                            backgroundColor: "errorBackgroundColor",
                            borderColor: "errorBorderColor"
                        },
                        header: "Error",
                        message: "Operation failed"
                    };
                    break;
                case WIDGET.DIALOG.WARNING:
                    standard = {
                        icon: ICON.WARNING,
                        css: {
                            color: "warningColor",
                            backgroundColor: "warningBackgroundColor",
                            borderColor: "warningBorderColor"
                        },
                        header: "Warning",
                        message: "Something went wrong"
                    };
                    break;
                default:
                    standard = {
                        icon: ICON.INFO,
                        css: {
                            color: "mainColor",
                            backgroundColor: "mainBackgroundColor",
                            borderColor: "mainBorderColor"
                        },
                        header: "Information",
                        message: "Everything as expected"
                    };
                    break;
            };
            standard.buttonText = "OK";
            standard.buttonType = WIDGET.BUTTON.TYPE.SOLID;
            this.model.setData( Object.assign( standard, this.data ) );
        },
        children: [
            {
                type: WIDGET.TYPE.BLOCK,
                template: DEVICE.PORTRAIT ? "<div style='max-width: 100%; max-height: 100%;'></div>" : "<div style='max-width: 80%; max-height: 90%;'></div>",
                className: "flexNone column borderSolid borderSmall lightTextBorderColor borderRadiusSmall backBackgroundColor",
                children: [
                    {
                        type: WIDGET.TYPE.BLOCK,
                        className: "flexNone paddingLeftMedium borderSolid borderBottomTiny lightTextBorderColor alignItemsCenter",
                        children: [
                            {
                                type: WIDGET.TYPE.BLOCK,
                                className: "flexNone marginRightSmall",
                                handleModel: function( data ){
                                    this.setIcon( data.icon );
                                    this.node.classList.add( data.css.color );
                                },
                                afterInit: function(){
                                    var dialog = this.getParentBy({ key: "dialog" });
                                    this.modelSubscribe( dialog.model, this.handleModel.bind( this ) );
                                }
                            },
                            {
                                key: "header",
                                type: WIDGET.TYPE.BLOCK,
                                handleModel: function( data ){
                                    this.node.innerHTML = data.header;
                                },
                                afterInit: function(){
                                    var dialog = this.getParentBy({ key: "dialog" });
                                    this.modelSubscribe( dialog.model, this.handleModel.bind( this ) );
                                }
                            },
                            {
                                type: WIDGET.TYPE.BUTTON,
                                icon: ICON.CLOSE,
                                events: [
                                    {
                                        type: "click",
                                        self: true,
                                        listener: function(){
                                            var dialog = this.getParentBy({ key: "dialog" });
                                            dialog.close();
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        key: "message",
                        type: WIDGET.TYPE.BLOCK,
                        className: "paddingLarge justifyContentCenter alignItemsCenter",
                        handleModel: function( data ){
                            this.node.innerHTML = data.message;
                        },
                        afterInit: function(){
                            var dialog = this.getParentBy({ key: "dialog" });
                            this.modelSubscribe( dialog.model, this.handleModel.bind( this ) );
                        }
                    },
                    {
                        type: WIDGET.TYPE.BLOCK,
                        className: "flexNone rowReverse paddingMedium borderSolid borderTopTiny lightTextBorderColor",
                        afterInit: function(){
                            var dialog = this.getParentBy({ key: "dialog" });
                            if( dialog.actions ) this.addChildren( dialog.actions );
                        },
                        children: [
                            {
                                type: WIDGET.TYPE.BUTTON,
                                handleModel: function( data ){
                                    this.node.classList.add( data.css.backgroundColor, data.css.borderColor );
                                    this.node.innerHTML = data.buttonText;
                                    this.applyButtonType( data.buttonType );
                                },
                                afterInit: function(){
                                    var dialog = this.getParentBy({ key: "dialog" });
                                    this.modelSubscribe( dialog.model, this.handleModel.bind( this ) );
                                },
                                events: [
                                    {
                                        type: "click",
                                        self: true,
                                        listener: function(){
                                            var dialog = this.getParentBy({ key: "dialog" });
                                            if( DataManager.isFunction( dialog.ok ) ) dialog.ok();
                                            else dialog.close();
                                        }
                                    },
                                    {
                                        type: "keydown",
                                        listener: function( e ){
                                            
                                            if( e.key !== "Enter" && e.key !== "Escape" ) return;

                                            var dialog = this.getParentBy({ key: "dialog" });
                                            if( e.key === "Enter" && DataManager.isFunction( dialog.ok ) ) dialog.ok();
                                            else dialog.close();
                                        }
                                    },
                                    {
                                        type: "hashchange",
                                        node: window,
                                        listener: function( e ){

                                            var dialog = this.getParentBy({ key: "dialog" });
                                            dialog.close();
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    };
});