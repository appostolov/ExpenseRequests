define([
    "const/widget",
    "manager/URLManager"
], function(
    WIDGET,
    URLManager
){
    return {
        key: "notFound",
        type: WIDGET.TYPE.BLOCK,
        className: "column centered overflowAuto lighterBackgroundColor",
        children: [
            {
                type: WIDGET.TYPE.BLOCK,
                className: "flexNone",
                html: "Destination Not Found..."
            },
            {
                type: WIDGET.TYPE.BUTTON,
                buttonType: WIDGET.BUTTON.TYPE.SOLID,
                className: "marginTopMedium",
                html: "Pick User",
                events: [
                    {
                        type: "click",
                        self: true,
                        listener: function(){
                            URLManager.navigate( { route: "users" } );
                        }
                    }
                ]
            }
        ]
    };
});