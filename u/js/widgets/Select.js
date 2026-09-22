define(
    [
        'widgets/Base'
    ],
    function( Base ){
    
        function Select(){
            
            this.template = "<select class='input mainBorderColor'></select>";
            this.widgetClassName = "widgetSelect";
    
            return this;
        };
    
        Select.prototype = new Base();
        Select.prototype.constructor = Select;

        Select.prototype.render = function(){

            Base.prototype.render.call( this );

            if( this.options ) this.addOptions( this.options );

            if( this.value ) this.setValue( this.value );
        };

        Select.prototype.addOptions = function( options ){

            for( var a = 0; a < options.length; a++ ){

                this.addOption( options[ a ] );
            }
        };

        Select.prototype.addOption = function( data ){

            var select = this.getSelect();
            var option = document.createElement( "OPTION" );

            option.value = data.value;

            if( data.text ) option.innerHTML = data.text;
            else option.innerHTML = data.value;

            if( data.disabled ) option.disabled = true;

            select.appendChild( option );

            if( data.selected ) select.value = option.value;
        };

        Select.prototype.getSelect = function(){

            if( this.node.tagName === "SELECT" ) return this.node;

            else return this.node.querySelector( "select" );
        };

        Select.prototype.setValue = function( value ){
            
            this.getSelect().value = value;
        };

        Select.prototype.getValue = function(){
            
            return this.getSelect().value;
        };
    
        return Select;
    });