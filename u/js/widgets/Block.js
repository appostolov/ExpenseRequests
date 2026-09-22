define(
    [
        'widgets/Base'
    ],
    function( Base ){
    
        function Block(){
            
            this.template = "<div></div>";
            this.widgetClassName = "widgetBlock";
    
            return this;
        };
    
        Block.prototype = new Base();
        Block.prototype.constructor = Block;
    
        return Block;
    });