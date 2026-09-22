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
        key: "comment",
        type: WIDGET.TYPE.BLOCK,
        className: "flexNone",
        afterInit: function(){
            this.modelSubscribe( this.model, this.onModelChange.bind( this ) );
        },
        onModelChange: function( data ){
            if( DataManager.isObjectEmpty( data ) ) this.hide();
            else this.show();
        },
        children: [
            {
                type: WIDGET.TYPE.BLOCK,
                className: "flexNone medium circle bold centered",
                onModelChange: function( data ){
                    if( DataManager.isObjectEmpty( data ) ) return;

                    this.node.innerHTML = data.name.charAt( 0 );
                    this.node.style.color = this.generateColor( data.name, true );
                    this.node.style.background = this.generateColor( data.name, false );
                },
                afterInit: function(){
                    var comment = this.getParentBy({ key: "comment" });
                    this.modelSubscribe( comment.model, this.onModelChange.bind( this ) );
                },
                generateColor: function( str, strong ){
                    // GENERATED THIS METHOD WITH AI
                    var hash = 0;
                    for (var i = 0; i < str.length; i++) {
                        hash = str.charCodeAt(i) + ((hash << 5) - hash);
                    }
                    
                    // Detect dark mode if the string includes words like 'dark', 'night', or 'black'
                    var lowerStr = str.toLowerCase();
                    var isDarkTheme = lowerStr.indexOf("dark") !== -1 || 
                                    lowerStr.indexOf("night") !== -1 || 
                                    lowerStr.indexOf("black") !== -1;

                    // 1. Generate base HSL to easily control color tone and contrast
                    var h = Math.abs(hash) % 360;
                    var s = 70; 
                    var l = 50; 

                    if (strong) {
                        // --- TEXT MODE ---
                        s = 85; 
                        l = isDarkTheme ? 75 : 35; // Light text if dark keyword found, otherwise dark text
                    } else {
                        // --- BACKGROUND MODE ---
                        s = 45; 
                        l = isDarkTheme ? 25 : 90; // Dark background if dark keyword found, otherwise soft pastel
                    }

                    // 2. Convert HSL to RGB manually (ES5 compatible)
                    l /= 100;
                    var a = (s * Math.min(l, 1 - l)) / 100;
                    var f = function(n) {
                        var k = (n + h / 30) % 12;
                        var color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
                        return Math.round(255 * color);
                    };

                    return "rgb(" + f(0) + ", " + f(8) + ", " + f(4) + ")";
                }
            },
            {
                type: WIDGET.TYPE.BLOCK,
                className: "flexNone alignItemsCenter marginLeftSmall",
                onModelChange: function( data ){
                    if( DataManager.isObjectEmpty( data ) ) return;

                    this.node.innerHTML = data.name;
                },
                afterInit: function(){
                    var comment = this.getParentBy({ key: "comment" });
                    this.modelSubscribe( comment.model, this.onModelChange.bind( this ) );
                }
            }
        ]
    };
});