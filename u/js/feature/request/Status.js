define([
    "const/widget",
    "util/Model",
    "manager/DataManager"
], function(
    WIDGET,
    Model,
    DataManager
){
    return {
        key: "status",
        type: WIDGET.TYPE.BLOCK,
        className: "flexNone centered paddingSmall borderRadiusSmall",
        afterInit: function(){
            this.modelSubscribe( this.model, this.onModelChange.bind( this ) );
        },
        onModelChange: function( data ){
            if( DataManager.isObjectEmpty( data ) ) return this.hide();

            var color = {
                open: "lightgrey",
                submitted: "lightblue",
                approved: "greenyellow",
                rejected: "red",
            }
            this.node.style.background = color[ data.status ];

            this.node.innerHTML = data.status;
            
            this.show();
        }
    };
});