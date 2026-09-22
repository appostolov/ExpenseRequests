define(
    [
        'widgets/Base',
        'const/widget'
    ],
    function(
        Base,
        WIDGET
    ){
    
        function Button(){
            
            this.template = "<button></button>";
            this.widgetCss = "/u/css/widgets/button.css";
            this.widgetClassName = "widgetButton";
    
            return this;
        };
    
        Button.prototype = new Base();
        Button.prototype.constructor = Button;

        Button.prototype.render = function(){

            Base.prototype.render.call( this );

            this.applyButtonType();
        };

        Button.prototype.applyButtonType = function( type ){

            if( !type && this.hasOwnProperty( "buttonType" ) && !this.buttonType ) return;

            if( type && this.buttonType ) this.node.classList.remove.apply( this.node.classList, WIDGET.BUTTON.TYPE.CSS[ this.buttonType ] );

            var buttonType = type ? type : this.buttonType;
            if( !buttonType ) buttonType = WIDGET.BUTTON.TYPE.DEFAULT;

            var cssClasses;

            switch( buttonType ){

                case WIDGET.BUTTON.TYPE.TEXT:
                    cssClasses = WIDGET.BUTTON.TYPE.CSS.TEXT;
                    break;
                case WIDGET.BUTTON.TYPE.BORDER:
                    cssClasses = WIDGET.BUTTON.TYPE.CSS.BORDER;
                    break;
                case WIDGET.BUTTON.TYPE.SOLID:
                    cssClasses = WIDGET.BUTTON.TYPE.CSS.SOLID;
                    break;
                case WIDGET.BUTTON.TYPE.GLASS:
                    cssClasses = WIDGET.BUTTON.TYPE.CSS.GLASS;
                    break;
            }
            this.node.classList.add.apply( this.node.classList, cssClasses );

            this.buttonType = buttonType;
        };
    
        return Button;
    });