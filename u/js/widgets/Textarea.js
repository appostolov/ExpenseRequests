define(
    [
        'widgets/Base'
    ],
    function( Base ){
    
        function Textarea(){
            
            this.template = "<textarea class='input mainBorderColor'></textarea>";
            this.widgetClassName = "widgetTextarea";
    
            return this;
        };
    
        Textarea.prototype = new Base();
        Textarea.prototype.constructor = Textarea;

        Textarea.prototype.render = function(){

            Base.prototype.render.call( this );

            var textarea = this.getTextarea();

            if( this.value ) this.setValue( this.value );

            if( this.inputType ) textarea.type = this.inputType;

            if( this.placeholder ) textarea.placeholder = this.placeholder;
        };

        Textarea.prototype.bind = function(){

            Base.prototype.bind.call( this );

            this.node.addEventListener( "click", function( e ){

                this.getTextarea().focus();

            }.bind( this ));
        };

        Textarea.prototype.setValue = function( value ){
            
            this.getTextarea().value = value;
        };

        Textarea.prototype.getValue = function(){
            
            return this.getTextarea().value;
        };

        Textarea.prototype.getTextarea = function(){

            if( this.node.tagName === "TEXTAREA" ) return this.node;

            else return this.node.querySelector( "textarea" );
        };
    
        return Textarea;
    });