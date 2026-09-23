define([
    "manager/DataManager",
	"manager/HTTPManager",
	"const/widget",
	"const/event",
	"dialog/Standard",
	"manager/URLManager",
	"util/Model"
], function(
    DataManager,
	HTTPManager,
	WIDGET,
	EVENT,
	Dialog,
	URLManager,
	Model
){

    function Base(){};

    Base.prototype.init = function(){
		
		this.route = URLManager.route.route;
        
        if( DataManager.isFunction( this.beforeInit ) ) this.beforeInit();

        this.render();

		this.bind();

		this.addChildren( this.children );

		this.composeWidgets( this.compose );

        if( this.disabled && DataManager.isFunction( this.disable ) ) this.disable();

		if( this.busy ) this.setBusy( this.busy );
        
        if( DataManager.isFunction( this.afterInit ) ) this.afterInit();

        this.event( EVENT.WIDGET.CREATED, { id: this.id } );
    };

    Base.prototype.render = function(){

		this.addStyle( this.widgetCss );
		this.addStyle( this.css );
		
		var parentNode,
			parentWidget = this.getParent();

		if( this.container ){
			parentNode = this.container
		}
		else if( parentWidget ) parentNode = parentWidget.node;
		else parentNode = document.body;

		var containerNode;

		if( this.selector ){
			var selectorNode = parentNode.querySelector( this.selector );
			if( selectorNode ) containerNode = parentNode.querySelector( this.selector );
		}

		if( !containerNode ) containerNode = parentNode;

		if( !this.position ) this.position = "beforeend";

		containerNode.insertAdjacentHTML( this.position, this.template );

		switch( this.position ){

			case "afterbegin":

				this.node = containerNode.firstChild;
				break;

			case "afterend":

				this.node = containerNode.nextSibling;
				break;

			case "beforebegin":

				this.node = containerNode.previousSibling;
				break;

			case "beforeend":

				this.node = containerNode.lastChild;
				break;
		}

		if( this.dynamicFont ) this.startDynamicFont();

		if( this.hidden ) this.node.classList.add( "displayNone" );

		if( this.waitForCss() ){

			this.opacityCache = this.node.style.opacity;
			this.node.style.opacity = 0;
		}
		else if( this.animation && this.animation.init ) this.animate( this.animation.init );

		this.node.id = this.id;

		if( this.html ) this.node.innerHTML = this.html;
		if( this.title ) this.node.title = this.title;
		
		this.node.classList.add( WIDGET.CLASSNAME );
		this.node.classList.add( this.widgetClassName );
		if( this.className ) this.node.classList.add.apply( this.node.classList, this.className.split( " " ) );

		if( this.icon ) this.node.classList.add.apply( this.node.classList, this.icon.split( " " ) );
    };

	Base.prototype.bind = function(){

		if( this.events ){
			if( Array.isArray( this.events ) ){

				for( var a = 0; a < this.events.length; a++ ){
					
					this.subscribe( this.events[ a ] );
				}
			}
			else this.subscribe( this.events );
		}
	};

	Base.prototype.unbind = function(){

		if( this.AbortController ) this.AbortController.abort();

		this.AbortController = null;
	};

	Base.prototype.subscribe = function( event ){

		if( !this.AbortController ) this.AbortController = new AbortController();

		var node;
		if( event.self ) node = this.node;
		else if( event.node ) node = event.node;
		else node = document;
		if( event.selector ) node = node.querySelector( event.selector );
		if( !node ) return;

		event.listener = event.listener.bind( this );

		DataManager.set( event, "options/signal", this.AbortController.signal );

		if( Array.isArray( event.type ) ){

			for( var a = 0; a < event.type.length; a++ ){

				node.addEventListener( event.type[ a ], event.listener, event.options, event.useCapture );
			}
		}
		else node.addEventListener( event.type, event.listener, event.options, event.useCapture );
	};

	Base.prototype.unsubscribe = function( event ){

		var node;
		if( event.self ) node = this.node;
		else if( event.node ) node = event.node;
		else node = document;
		if( event.selector ) node = node.querySelector( event.selector );
		if( !node ) return;

		if( Array.isArray( event.type ) ){

			for( var a = 0; a < event.type.length; a++ ){

				node.removeEventListener( event.type[ a ], event.listener, event.options, event.useCapture );
			}
		}
		else node.removeEventListener( event.type, event.listener, event.options, event.useCapture );
	};

	Base.prototype.event = function( type, data, node, bubbles ){

		if( !node ) node = document;

		var event = new CustomEvent( type, {
			detail: data,
			bubbles: bubbles
		});

		node.dispatchEvent( event );
	};

	Base.prototype.addChildren = function( children ){

		if( Array.isArray( children ) ){
			
			for( var a = 0; a < children.length; a ++ ){
				
				children[ a ].parent = this.id;

				this.widgetManager.create( children[ a ] );
			}
		}
	};

	Base.prototype.composeWidgets = function( composition ){

        if( !DataManager.isObject( composition ) ) return false;

		if( !composition.hasOwnProperty( "ids" ) ) return false;

		if( !Array.isArray( composition.ids ) ) return false;

		if( !composition.ids.length ) return false;

		if( !composition.base ) composition.base = { type: WIDGET.TYPE.BLOCK };

		var children = [];

		for( var a = 0; a < composition.ids.length; a ++ ){
			
			var id = composition.ids[ a ];
			var config = DataManager.copy( composition.base, true, true );

			config.id = id;

			if( composition.configs && composition.configs.hasOwnProperty( id ) ) Object.assign( config, composition.configs[ id ] );

			if( composition.props ){

				for( var prop in composition.props ){

					if( !composition.props.hasOwnProperty( prop ) ) continue;

					if( composition.props[ prop ].hasOwnProperty( id ) ) config[ prop ] = composition.props[ prop ][ id ];
				}
			}

			children.push( config );
		}
		if( !children.length ) return;

		if( !this.children ) this.children = [];

		this.children = this.children.concat( children );

		this.addChildren( children );
	};

	Base.prototype.addStyle = function( css ){

		if( DataManager.isString( css ) ) this.addCSS( css );

		else if( Array.isArray( css ) ){

			for( var a = 0; a < css.length; a++ ){

				this.addCSS( css[ a ] );
			}
		}
	};

	Base.prototype.addCSS = function( href ){

		if( !DataManager.isString( href ) ) return;

		for( var a = 0; a < document.styleSheets.length; a++ ){

			if( !document.styleSheets[ a ].href ) continue;

			if( document.styleSheets[ a ].href.indexOf( href ) !== -1 ) return;
		}

		var link = document.createElement( "LINK" );
		link.rel = "stylesheet";
		link.type = "text/css";
		link.href = href;
		link.addEventListener( "load", this.cssLoaded.bind( this, href ) );
		link.addEventListener( "error", this.cssLoaded.bind( this, href ) );

		if( !this.waitCss ) this.waitCss = {};
		this.waitCss[ href ] = false;

		document.querySelector( "head" ).appendChild( link );
	};

	Base.prototype.cssLoaded = function( link ){

		this.waitCss[ link ] = true;
			
		if( !this.waitForCss() ) this.node.style.opacity = this.opacityCache;

		if( this.animation && this.animation.init ) this.animate( this.animation.init );
	};

	Base.prototype.waitForCss = function(){

		if( !this.waitCss ) return false;
		
		for( var a in this.waitCss ){

			if( !this.waitCss.hasOwnProperty( a ) ) continue;

			if( !this.waitCss[ a ] ) return true;
		}

		if( this.afterCSS ) this.afterCSS();
		this.event( EVENT.WIDGET.CSS.DONE, { id: this.id });

		return false;
	};

	Base.prototype.getChildren = function( deep, result ){

		var children = this.widgetManager.get( { parent: this.id } );

		if( !deep ) return children;

		if( !result ) result = [];
		
		result.push.apply( result, children );

		for( var a = 0; a < children.length; a++ ){

			children[ a ].getChildren( true, result );
		}

		return result;
	};

	Base.prototype.getChildrenBy = function( match, deep ){

		var result = [];
		var children = this.getChildren( deep );

		for( var a = 0; a < children.length; a++ ){
			var same = true;
			for( var b in match ){
				if( !match.hasOwnProperty( b ) ) continue;
				if( children[ a ][ b ] !== match[ b ] ) same = false;
			}
			if( same ) result.push( children[ a ] );
		}
		return result;
	};

	Base.prototype.getChildBy = function( match, deep ){

		var children = this.getChildren( deep );

		for( var a = 0; a < children.length; a++ ){
			var same = true;
			for( var b in match ){
				if( !match.hasOwnProperty( b ) ) continue;
				if( children[ a ][ b ] !== match[ b ] ) same = false;
			}
			if( same ) return children[ a ];
		}
	};

	Base.prototype.getParentBy = function( match ){

		var parent = this.getParent();

		while( parent ){
			var same = true;
			for( var prop in match ){
				if( !match.hasOwnProperty( prop ) ) continue;
				if( parent[ prop ] !== match[ prop ] ) same = false;
			}
			if( same ) return parent;
			parent = parent.getParent();
		}
	};

	Base.prototype.getParentsBy = function( match ){

		var parent = this.getParent();
		var parents = [];

		while( parent ){
			var same = true;
			for( var prop in match ){
				if( !match.hasOwnProperty( prop ) ) continue;
				if( parent[ prop ] !== match[ prop ] ) same = false;
			}
			if( same ) parents.push( parent );
			parent = parent.getParent();
		}
		return parents;
	};

	Base.prototype.closeChildren = function(){

		var children = this.getChildren();
		
		for( var a = 0; a < children.length; a++ ){

			children[ a ].close( true );
		}
	};

	Base.prototype.getParent = function(){

		return this.widgetManager.getById( this.parent );
	};

	Base.prototype.getChildIndex = function(){

		var parent = this.getParent();
		if( !parent ) return -1;

		var children = parent.getChildren();
		return children.indexOf( this );
	};

	Base.prototype.close = function( parent ){

		if( DataManager.isFunction( this.beforeClose ) ) this.beforeClose();

		this.closeChildren();
		
		this.unbind();

		this.modelUnsubscribe();

		if ( !parent && this.animation && this.animation.close ) {

			return this.animate( this.animation.close ).then( function(){

				this.node.remove();
				this.widgetManager.remove( this.id );
				if( DataManager.isFunction( this.afterClose ) ) this.afterClose();
				this.event( EVENT.WIDGET.CLOSE, { id: this.id } );
				this.closed = true;

			}.bind( this ));
		}
		else {
			this.node.remove();
			this.widgetManager.remove( this.id );
			if( DataManager.isFunction( this.afterClose ) ) this.afterClose();
			this.event( EVENT.WIDGET.CLOSE, { id: this.id } );
			this.closed = true;

			return new Promise( function(res){ res(); });
		}
	};

	Base.prototype.disable = function(){
		
		this.disabled = true;

		this.node.disabled = true;

		this.node.classList.add( "disabled" );

		var children = this.getChildren();

		for( var a = 0; a < children.length; a++ ){

			children[ a ].disable();
		}
	};

	Base.prototype.enable = function(){
		
		this.disabled = false;

		this.node.disabled = false;

		this.node.classList.remove( "disabled" );

		var children = this.getChildren();

		for( var a = 0; a < children.length; a++ ){

			children[ a ].enable();
		}
	};

	Base.prototype.setBusy = function( busy ){

		this.busy = !!busy;
		
		if( !this.node ) return;

		var elements = this.node.querySelectorAll( ":scope >.busy" );
		for( var a = 0; a < elements.length; a++ ){
			elements[ a ].remove();
		}

		if( busy ){
			var busyNode = document.createElement(	"DIV" );
			busyNode.classList.add( "busy" );
			busyNode.innerHTML = "<div></div><div></div><div></div>";
			this.node.appendChild( busyNode );
		}
	};

	Base.prototype.animate = function( animation ){

		var resolve, result = new Promise( function(res, rej){

			resolve = res;
		});
		
		this.node.addEventListener( "animationend", function( e ){

			if ( e.animationName === animation && e.target === this.node ){

				resolve();
				this.node.classList.remove( animation );
			}

		}.bind( this ));

		this.node.classList.add( animation );

		return result;
	};

	Base.prototype.show = function(){

		if( this.hidden !== true ) return;
		this.hidden = false;

		this.node.classList.remove( "displayNone" );

		if ( this.animation && this.animation.show ) {

			return this.animate( this.animation.show );
		}
		else return new Promise( function(res){ res(); });
	};

	Base.prototype.hide = function(){

		if( this.hidden === true ) return;
		this.hidden = true;

		if ( this.animation && this.animation.hide ) {

			return this.animate( this.animation.hide ).then( function(){
				if( this.closed ) return;
				this.node.classList.add( "displayNone" );

			}.bind( this ));
		}
		else{
			this.node.classList.add( "displayNone" );

			return new Promise( function(res){ res(); });
		}
	};

	Base.prototype.request = function( data ){

		var self = this;

		if( DataManager.isFunction( data.start ) ) data.start.call( self, data );
		HTTPManager.request( data )
		.then(function( request ){
			if( self.closed ) return;
			if( DataManager.isFunction( data.success ) ) data.success.call( self, request.result, request.xhttp );
		})
		.catch(function( request ){
			if( self.closed ) return;
			if( request && DataManager.isFunction( data.error ) ) data.error.call( self, request.result, request.xhttp );
		})
		.finally(function(){
			if( self.closed ) return;
			if( DataManager.isFunction( data.end ) ) data.end.call( self, data );
		});
	};

	Base.prototype.isClosed = function(){
		return !this.widgetManager.exists( this.id );
	};

	Base.prototype.modelSubscribe = function( model, callback ){
		if( !( model instanceof Model ) ) return;
		if( !DataManager.isFunction( callback ) ) return;
		if( !Array.isArray( this.modelSubscriptions ) ) this.modelSubscriptions = [];
		var subscription = {
			model: model,
			callback: callback
		};
		this.modelSubscriptions.push( subscription );
		model.subscribe( callback );
		return subscription;
	};

	Base.prototype.modelUnsubscribe = function( model, callback ){
		if( !Array.isArray( this.modelSubscriptions ) ) return;
		
		this.modelSubscriptions = this.modelSubscriptions.filter(function( subscription ){
			var match = false;
			if( model && callback ){
				if( subscription.model === model && subscription.callback === callback ) match = true;
			}
			else if( model ){
				if( subscription.model === model ) match = true;
			}
			else if( callback ){
				if( subscription.callback === callback ) match = true;
			}
			else match = true;

			if( match ){
				subscription.model.unsubscribe( subscription.callback );
				return false;
			}
			else return true;
		});
	};
    
    return Base;
});