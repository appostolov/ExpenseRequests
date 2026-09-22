define(
    [
        'widgets/Base'
    ],
    function( Base ){
    
        function Input(){
            
            this.template = "<input type='text' class='input mainBorderColor'>";
            this.widgetClassName = "widgetInput";
    
            return this;
        };
    
        Input.prototype = new Base();
        Input.prototype.constructor = Input;

        Input.prototype.render = function(){

            Base.prototype.render.call( this );

            var input = this.getInput();

            if( this.value ) this.setValue( this.value );

            if( this.inputType ) input.type = this.inputType;
            if( this.autocomplete ) input.autocomplete = this.autocomplete;

            if( this.hasOwnProperty( "checked" ) ) input.checked = this.checked;

            if( this.placeholder ) input.placeholder = this.placeholder;
        };

        Input.prototype.bind = function(){

            Base.prototype.bind.call( this );

            this.node.addEventListener( "click", function( e ){

                var input = this.getInput();

                switch( input.type ){

                    case "checkbox":
                        input.checked = !input.checked;
                        break;

                    default:
                        if( this.autoFocus !== false ) input.focus();
                        break;
                }
            }.bind( this ));
        };

        Input.prototype.setValue = function( value ){
            var input = this.getInput();
            
            input.value = value;
            input.dispatchEvent(new Event('input', {
                bubbles: true,
                composed: true
            }));
        };

        Input.prototype.getValue = function(){
            
            return this.getInput().value;
        };

        Input.prototype.getInput = function(){

            if( this.node.tagName === "INPUT" ) return this.node;

            else return this.node.querySelector( "input" );
        };

        Input.prototype.setChecked = function( checked ){
            this.checked = !!checked;
            var input = this.getInput();
            input.checked = this.checked;
            input.dispatchEvent(new Event('input', {
                bubbles: true,
                composed: true
            }));
        };
    
        return Input;
    });