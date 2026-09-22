define([
    "manager/DataManager"
], function(
    DataManager
){
    function Model( data ){
        this.data = data || {};
        this.listeners = [];
    };

    Model.prototype.setData = function( data, extend, force, mute ){
        var oldData = DataManager.copy( this.data, true );
        if( extend ) this.data = Object.assign( this.data, data );
        else this.data = data;

        if( mute ) return;
        if( DataManager.equal( this.data, oldData ) && !force ) return;

        for( var a = 0; a < this.listeners.length; a++ ){
            this.listeners[ a ]( this.data, oldData );
        }
    };

    Model.prototype.getData = function(){
        return DataManager.copy( this.data, true );
    };

    Model.prototype.subscribe = function( callback ){
        if( !DataManager.isFunction( callback ) ) return;
        if( this.listeners.indexOf( callback ) === -1 ) this.listeners.push( callback );
        callback( this.data );
    };

    Model.prototype.unsubscribe = function( callback ){
        var index = this.listeners.indexOf( callback );
        if( index > -1 ) this.listeners.splice( index, 1 );
    }

    return Model;
});