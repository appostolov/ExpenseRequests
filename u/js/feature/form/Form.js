define([
    "const/widget",
    "util/Model"
], function(
    WIDGET,
    Model
){
    return {
        key: "form",
        type: WIDGET.TYPE.BLOCK,
        className: "column overflowAuto paddingLarge",
        beforeInit: function(){
            this.model = new Model();
        },
        children: [
            {
                type: WIDGET.TYPE.BLOCK,
                className: "flexNone column",
                children: [
                    {
                        type: WIDGET.TYPE.BLOCK,
                        html: "Expense type *",
                        className: "italic textColor"
                    },
                    {
                        type: WIDGET.TYPE.SELECT,
                        afterInit: function(){
                            var form = this.getParentBy({ key: "form" });
                            this.modelSubscribe( form.model, this.onModelChange.bind( this ) );
                        },
                        onModelChange: function( data ){
                            var value = this.getValue();
                            if( value !== data.expenseType ) this.setValue( data.expenseType );
                        },
                        events: [
                            {
                                type: "change",
                                self: true,
                                listener: function(){
                                    var form = this.getParentBy({ key: "form" });
                                    var model = form.model.getData();
                                    var value = this.getValue();
                                    if( model.expenseType !== value ){
                                        form.model.setData({
                                            expenseType: value
                                        }, true );
                                    }
                                }
                            }
                        ],
                        options: [
                            {
                                value: "Travel"
                            },
                            {
                                value: "Software"
                            },
                            {
                                value: "Equipment"
                            },
                            {
                                value: "Meal"
                            },
                            {
                                value: "Other"
                            }
                        ]
                    }
                ]
            },
            {
                type: WIDGET.TYPE.BLOCK,
                className: "flexNone column marginTopLarge",
                children: [
                    {
                        type: WIDGET.TYPE.BLOCK,
                        html: "Amount *",
                        className: "italic textColor"
                    },
                    {
                        type: WIDGET.TYPE.INPUT,
                        template: '<input type="number" min="0" step="1" class="input mainBorderColor">',
                        afterInit: function(){
                            var form = this.getParentBy({ key: "form" });
                            this.modelSubscribe( form.model, this.onModelChange.bind( this ) );
                        },
                        onModelChange: function( data ){
                            var value = this.getValue();
                            if( value !== data.amountCents ) this.setValue( data.amountCents );
                        },
                        events: [
                            {
                                type: "input",
                                self: true,
                                listener: function(){
                                    var form = this.getParentBy({ key: "form" });
                                    var model = form.model.getData();
                                    var value = this.getValue();
                                    var int = parseInt( value );

                                    if( isNaN( int ) ){
                                        return this.setValue( 0 );
                                    }
                                    else if( value !== int + "" ){
                                        return this.setValue( int );
                                    }
                                    else if( model.amountCents !== int ){
                                        form.model.setData({
                                            amountCents: int
                                        }, true );
                                    }
                                }
                            }
                        ]
                    }
                ]
            },
            {
                type: WIDGET.TYPE.BLOCK,
                className: "flexNone column marginTopLarge",
                children: [
                    {
                        type: WIDGET.TYPE.BLOCK,
                        html: "Description *",
                        className: "italic textColor"
                    },
                    {
                        type: WIDGET.TYPE.INPUT,
                        afterInit: function(){
                            var form = this.getParentBy({ key: "form" });
                            this.modelSubscribe( form.model, this.onModelChange.bind( this ) );
                        },
                        onModelChange: function( data ){
                            var value = this.getValue();
                            var str = data.description || "";
                            if( value !== str ) this.setValue( str );
                        },
                        events: [
                            {
                                type: "input",
                                self: true,
                                listener: function(){
                                    var form = this.getParentBy({ key: "form" });
                                    var model = form.model.getData();
                                    var value = this.getValue();
                                    if( model.description !== value ){
                                        form.model.setData({
                                            description: value
                                        }, true );
                                    }
                                }
                            }
                        ]
                    }
                ]
            },
            {
                type: WIDGET.TYPE.BLOCK,
                className: "flexNone marginTopLarge",
                children: [
                    {
                        type: WIDGET.TYPE.INPUT,
                        inputType: "checkbox",
                        className: "flexNone",
                        afterInit: function(){
                            var form = this.getParentBy({ key: "form" });
                            this.modelSubscribe( form.model, this.onModelChange.bind( this ) );
                        },
                        onModelChange: function( data ){
                            if( !!this.checked !== !!data.billable ) this.setChecked( !!data.billable );
                        },
                        events: [
                            {
                                type: "change",
                                self: true,
                                listener: function(){
                                    var form = this.getParentBy({ key: "form" });
                                    var model = form.model.getData();
                                    if( !!model.billable === !!this.checked ){
                                        form.model.setData({
                                            billable: !!!this.checked
                                        }, true );
                                    }
                                }
                            }
                        ]
                    },
                    {
                        type: WIDGET.TYPE.BLOCK,
                        html: "Billable to a client?",
                        className: "flexNone italic textColor paddingLeftMedium"
                    }
                ]
            },
            {
                type: WIDGET.TYPE.BLOCK,
                className: "flexNone column marginTopLarge",
                afterInit: function(){
                    var form = this.getParentBy({ key: "form" });
                    this.modelSubscribe( form.model, this.onModelChange.bind( this ) );
                },
                onModelChange: function( data ){
                    if( data.billable ) this.show();
                    else this.hide();
                },
                children: [
                    {
                        type: WIDGET.TYPE.BLOCK,
                        html: "Client *",
                        className: "italic textColor"
                    },
                    {
                        type: WIDGET.TYPE.SELECT,
                        options: [
                            {
                                value: "Acme"
                            },
                            {
                                value: "OpenAI"
                            },
                            {
                                value: "Microsoft"
                            },
                            {
                                value: "Oracle"
                            }
                        ],
                        afterInit: function(){
                            var form = this.getParentBy({ key: "form" });
                            this.modelSubscribe( form.model, this.onModelChange.bind( this ) );
                        },
                        onModelChange: function( data ){
                            var value = this.getValue();
                            if( value !== data.client ) this.setValue( data.client );
                        },
                        events: [
                            {
                                type: "change",
                                self: true,
                                listener: function(){
                                    var form = this.getParentBy({ key: "form" });
                                    var model = form.model.getData();
                                    var value = this.getValue();
                                    if( model.client !== value ){
                                        form.model.setData({
                                            client: value
                                        }, true );
                                    }
                                }
                            }
                        ]
                    }
                ]
            },
            {
                type: WIDGET.TYPE.BLOCK,
                className: "flexNone column marginTopLarge",
                afterInit: function(){
                    var form = this.getParentBy({ key: "form" });
                    this.modelSubscribe( form.model, this.onModelChange.bind( this ) );
                },
                onModelChange: function( data ){
                    if( data.amountCents >= 100000 ) this.show();
                    else this.hide();
                },
                children: [
                    {
                        type: WIDGET.TYPE.BLOCK,
                        html: "Extra justification *",
                        className: "italic textColor"
                    },
                    {
                        type: WIDGET.TYPE.INPUT,
                        afterInit: function(){
                            var form = this.getParentBy({ key: "form" });
                            this.modelSubscribe( form.model, this.onModelChange.bind( this ) );
                        },
                        onModelChange: function( data ){
                            var value = this.getValue();
                            var str = data.additionalJustification || "";
                            if( value !== str ) this.setValue( str );
                        },
                        events: [
                            {
                                type: "change",
                                self: true,
                                listener: function(){
                                    var form = this.getParentBy({ key: "form" });
                                    var model = form.model.getData();
                                    var value = this.getValue();
                                    if( model.additionalJustification !== value ){
                                        form.model.setData({
                                            additionalJustification: value
                                        }, true );
                                    }
                                }
                            }
                        ]
                    }
                ]
            },
            {
                type: WIDGET.TYPE.BLOCK,
                className: "flexNone column marginTopLarge",
                afterInit: function(){
                    var form = this.getParentBy({ key: "form" });
                    this.modelSubscribe( form.model, this.onModelChange.bind( this ) );
                },
                onModelChange: function( data ){
                    if( data.expenseType === "Other" ) this.show();
                    else this.hide();
                },
                children: [
                    {
                        type: WIDGET.TYPE.BLOCK,
                        html: "Other reason *",
                        className: "italic textColor"
                    },
                    {
                        type: WIDGET.TYPE.INPUT,
                        afterInit: function(){
                            var form = this.getParentBy({ key: "form" });
                            this.modelSubscribe( form.model, this.onModelChange.bind( this ) );
                        },
                        onModelChange: function( data ){
                            var value = this.getValue();
                            var str = data.otherReason || "";
                            if( value !== str ) this.setValue( str );
                        },
                        events: [
                            {
                                type: "change",
                                self: true,
                                listener: function(){
                                    var form = this.getParentBy({ key: "form" });
                                    var model = form.model.getData();
                                    var value = this.getValue();
                                    if( model.otherReason !== value ){
                                        form.model.setData({
                                            otherReason: value
                                        }, true );
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    };
});