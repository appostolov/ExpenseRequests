requirejs.config({
	baseUrl: '/js'
});

requirejs(
    [
        "manager/WidgetManager",
        "manager/ColorManager",
        "const/widget",
        "const/color",
        "const/device",
        "const/event",
        "feature/user/User",
        "util/Model"
    ],
    function(
        WidgetManager,
        ColorManager,
        WIDGET,
        COLOR,
        DEVICE,
        EVENT,
        User,
        Model
    ){
        WidgetManager.create({
            key: "root",
            type: WIDGET.TYPE.BLOCK,
            className: "absoluteFull column",
            css: [
                "/css/main.css",
                "/css/animations.css"
            ],
            beforeInit: function(){
                ColorManager.deploy( COLOR );
            },
            children: [
                Object.assign(
                    {},
                    User,
                    {
                        beforeInit: function(){
                            this.model = new Model({
                                name: "Alice"
                            });
                        }
                    }
                )
            ]
        });
    });