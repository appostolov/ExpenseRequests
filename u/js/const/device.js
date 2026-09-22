define( function(){
        
    return {
        get SIZE() {

            var width = window.innerWidth / 96;
            var height = window.innerHeight / 96;

            var diagonal = Math.sqrt( Math.pow( width, 2 ) + Math.pow( height, 2 ) );

            return diagonal / window.devicePixelRatio;
        },
        size: function( width, height ){
            var diagonal = Math.sqrt( Math.pow( width / 96, 2 ) + Math.pow( height / 96, 2 ) );
            return diagonal / window.devicePixelRatio;
        },
        get PORTRAIT(){

            return window.innerHeight > window.innerWidth;
        },
        get TABLET(){

            var size = this.SIZE;

            return ( size > 7 && size < 12 );
        },
        get PHONE(){

            return this.SIZE < 7;
        },
        get DESKTOP(){

            return this.SIZE >= 12;
        },
        get TOUCH(){

            return navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
        }
    };
});