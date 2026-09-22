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
        "util/Model",
        "feature/Router"
    ],
    function(
        WidgetManager,
        ColorManager,
        WIDGET,
        COLOR,
        DEVICE,
        EVENT,
        Model,
        Router
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
                Router
            ]
        });
    });