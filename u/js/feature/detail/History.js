define([
    "const/widget",
    "util/Model",
    "const/state",
    "feature/request/Event"
], function(
    WIDGET,
    Model,
    STATE,
    Event
){
    return {
        key: "history",
        type: WIDGET.TYPE.BLOCK,
        className: "column overflowAuto",
        afterInit: function(){
            this.modelSubscribe( this.model, this.onModelChange.bind( this ) );
        },
        onModelChange: function( data ){
            this.closeChildren();

            if( !Array.isArray( data.events ) || !data.events.length ) return;

            var children = [];

            for( var a = 0; a < data.events.length; a++ ){

                if( a ){
                    children.push({
                        type: WIDGET.TYPE.BLOCK,
                        className: "flexNone tiny lighterBackgroundColor"
                    });
                }

                children.push(
                    Object.assign(
                        {},
                        Event,
                        {
                            request: data.events[ a ],
                            beforeInit: function(){
                                this.model = new Model( this.request )
                            }
                        }
                    )
                );
            }
            this.addChildren( children );
        }
    };
});