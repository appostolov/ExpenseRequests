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
        "const/event"
    ],
    function(
        WidgetManager,
        ColorManager,
        WIDGET,
        COLOR,
        DEVICE,
        EVENT
    ){
        WidgetManager.create({
            key: "root",
            type: WIDGET.TYPE.BLOCK,
            className: "absoluteFull column",
            css: [
                "/u/css/main.css",
                "/u/css/animations.css"
            ],
            html: "Hello World",
            beforeInit: function(){
                ColorManager.deploy( COLOR );
            }
        });
    });