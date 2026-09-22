define(
    [
        "widgets/Base",
        "const/device",
        "manager/DataManager",
        "const/widget",
        "const/event"
    ],
    function(
        Base,
        DEVICE,
        DataManager,
        WIDGET,
        EVENT
        ){
    
        function Popover(){
            
            this.template = "<div></div>";
            this.widgetCss = "/u/css/widgets/popover.css";
            this.widgetClassName = "widgetPopover";
            this.container = document.body;
    
            return this;
        };
    
        Popover.prototype = new Base();
        Popover.prototype.constructor = Popover;

        Popover.prototype.close = function(){
            this.resizeObserver.disconnect();
            Base.prototype.close.call( this );
        };

        Popover.prototype.render = function(){
            Base.prototype.render.call( this );
            this.node.style.opacity = 0;
            if( this.blur !== false ) document.activeElement.blur();
            this.createCloseButton();
            var self = this;
            this.resizeObserver = new ResizeObserver(function( data ){
                self.placePopover();
            });
            this.resizeObserver.observe( this.node );
        };

        Popover.prototype.bind = function(){

            Base.prototype.bind.call( this );

            setTimeout(function(){

                this.subscribe({
                    type: "keydown",
                    listener: function( e ){
    
                        if( e.key === "Escape" ) this.close();
                    }
                });
    
                this.subscribe({
                    type: "click",
                    listener: function( e ){
    
                        if( this.colorPicker ){
                            if( e.target.nodeName !== "INPUT" || e.target.type !== "color" ) this.colorPicker = false;
                            return;
                        }
                        if( !this.node.contains( e.target ) ) return this.close();
    
                        var child,
                            children = this.getChildren();
    
                        for( var i in children ){
    
                            child = children[ i ];
    
                            if( e.target !== child.node && !child.node.contains( e.target ) ) continue;
    
                            if( child.closePopover ) this.close();
    
                            return;
                        }
                    }
                });

                this.subscribe({
                    type: EVENT.POPOVER.CLOSE,
                    listener: function( e ){
                        
                        this.close();
                    }
                });

                this.subscribe({
                    type: "focusin",
                    self: true,
                    listener: function( e ){
    
                        if( e.target.nodeName !== "INPUT" ) return;
                        if( e.target.type !== "color" ) return;
                        this.colorPicker = true;
                    }
                });

            }.bind( this ));
        };

        Popover.prototype.placePopoverCenter = function(){

            var targetRect = this.target.getBoundingClientRect();
            var bodyRect = document.body.getBoundingClientRect();
            var rect = this.node.getBoundingClientRect();

            var position = {};
            position.top = targetRect.height / 2 - rect.height / 2;
            position.left = targetRect.width / 2 - rect.width / 2;

            if( position.top < 0 ) position.top = 0;
            if( position.top > bodyRect.bottom - rect.height ) position.top = bodyRect.bottom - rect.height;
            if( position.left < 0 ) position.left = 0;
            if( position.left > bodyRect.right - rect.width ) position.left = bodyRect.right - rect.width;

            this.node.style.top = position.top + "px";
            this.node.style.left = position.left + "px";
            this.node.style.opacity = 1;
        };

        Popover.prototype.placePopoverPoint = function(){

            var bodyRect = document.body.getBoundingClientRect();
            var rect = this.node.getBoundingClientRect();

            var position = {};
            position.top = this.place.point.y - rect.height / 2;
            position.left = this.place.point.x - rect.width / 2;

            if( position.top < 0 ) position.top = 0;
            if( position.top > bodyRect.bottom - rect.height ) position.top = bodyRect.bottom - rect.height;
            if( position.left < 0 ) position.left = 0;
            if( position.left > bodyRect.right - rect.width ) position.left = bodyRect.right - rect.width;

            this.node.style.top = position.top + "px";
            this.node.style.left = position.left + "px";
            this.node.style.opacity = 1;
        };

        Popover.prototype.placePopover = function(){

            var rect = this.node.getBoundingClientRect();
            var rectSize = DEVICE.size( rect.width, rect.height );

            if(
                (
                    this.place
                    && this.place.fullScreen
                )
                || (
                    !this.waitForCss()
                    && this.responsive
                    && rectSize / DEVICE.SIZE > 0.7
                )
            ){
                this.node.classList.add( "absoluteFull" );
                this.closeButton.show();
            }
            else{
                this.node.classList.remove( "absoluteFull" );
                this.closeButton.hide();
            }

            if( this.place && this.place.point ) return this.placePopoverPoint();
            else if( this.place && this.place.center ) return this.placePopoverCenter();

            var targetRect = this.target.getBoundingClientRect();
            var bodyRect = document.body.getBoundingClientRect();
            var space = {
                top: targetRect.y,
                right: bodyRect.width - targetRect.right,
                bottom: bodyRect.height - targetRect.bottom,
                left: targetRect.x
            };
            var max = null;
            for( var key in space ){
                if( !space.hasOwnProperty( key ) ) continue;
                if( max === null || space[ key ] > space[ max ] ) max = key;
            }

            var position = {};
            if(  max === "top" || max === "bottom" ){
                position.left = targetRect.left + ( targetRect.width / 2 ) - ( rect.width / 2 );
            }
            else position.top = targetRect.top + ( targetRect.height / 2 ) - ( rect.height / 2 );
            if( max === "top" ) position.top = targetRect.top - rect.height;
            else if( max === "right" ) position.left = targetRect.right;
            else if( max === "bottom" ) position.top = targetRect.bottom;
            else if( max === "left" ) position.left = targetRect.left - rect.width;

            if( position.top < 0 ) position.top = 0;
            if( position.top > bodyRect.bottom - rect.height ) position.top = bodyRect.bottom - rect.height;
            if( position.left < 0 ) position.left = 0;
            if( position.left > bodyRect.right - rect.width ) position.left = bodyRect.right - rect.width;

            this.node.style.top = position.top + "px";
            this.node.style.left = position.left + "px";
            this.node.style.opacity = 1;
        };

        Popover.prototype.createCloseButton = function(){

            var that = this;

            this.closeButton = this.widgetManager.create({
                type: WIDGET.TYPE.BUTTON,
                container: this.node,
                template: "<button style='position: absolute; top: 1rem; right: 1rem;'></button>",
                html: "X",
                hidden: true,
                events: [
                    {
                        type: "click",
                        self: true,
                        listener: function(){
                            that.close();
                        }
                    },
                    {
                        type: EVENT.WIDGET.CLOSE,
                        listener: function( e ){
                            if( e.detail.id === that.id ) this.close();
                        }
                    }
                ]
            });
        };
    
        return Popover;
    });