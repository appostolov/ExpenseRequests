define([
    "const/widget",
    "dialog/Standard",
    "manager/DataManager"
], function(
    WIDGET,
    Dialog,
    DataManager
){
    return Object.assign(
        {
            dialogType: WIDGET.DIALOG.ERROR,
            data: {
                message: ""
            },
            afterInit: function(){

                var message = this.getChildBy({ key: "message" }, true );
                message.addChildren([{
                    key: "error",
                    type: WIDGET.TYPE.BLOCK,
                    className: "column"
                }]);
                var error = message.getChildBy( { key: "error" }, true );
                
                
                if( this.error.message ){
                    error.addChildren([{
                        type: WIDGET.TYPE.BLOCK,
                        html: this.error.message
                    }]);
                }

                if( DataManager.isObject( this.error.errors ) ){
                    
                    for( var field in this.error.errors ){
                        if( !this.error.errors.hasOwnProperty( field ) ) continue;

                        error.addChildren([{
                            type: WIDGET.TYPE.BLOCK,
                            html: field,
                            className: "bold marginTopMedium"
                        }]);

                        var errors = this.error.errors[ field ];
                        for( var str of errors ){
                            error.addChildren([{
                                type: WIDGET.TYPE.BLOCK,
                                html: str,
                                className: "italic"
                            }]);
                        }

                    }
                }
            }
        },
        Dialog
    );
});