define([], function(){

    return {
        ID: "widget_",
        CLASSNAME: "widget",
        TYPE: {
            BLOCK: "Block",
            BUTTON: "Button",
            INPUT: "Input",
            SELECT: "Select",
            POPOVER: "Popover",
            OVERFLOW: "Overflow",
            TEXTAREA: "Textarea",
            SUGGEST: "Suggest",
            ANIMATION: "Animation",
            HTML: "Html",
            LIST: "List"
        },
        BUTTON: {
            TYPE: {
                TEXT: "TEXT",
                BORDER: "BORDER",
                SOLID: "SOLID",
                DEFAULT: "TEXT",
                GLASS: "GLASS",
                CSS: {
                    TEXT: [ "transparentBackgroundColor", "transparentBorderColor", "mainColor" ],
                    BORDER: [ "transparentBackgroundColor", "mainBorderColor", "mainColor" ],
                    SOLID: [ "mainBackgroundColor", "mainBorderColor", "backColor" ],
                    GLASS: [ "glassBackgroundColor", "glassBorderColor", "mainColor" ],
                }
            }
        },
        HTMLS: "HtmlSanitizer",
        DIALOG: {
            INFO: "info",
            SUCCESS: "success",
            ERROR: "error",
            WARNING: "warning"
        },
        POPOVER: {
            CSS: "column overflowAuto paddingMedium alignItemsStart backBackgroundColor borderSolid borderSmall mainBorderColor borderRadiusSmall",
            CSS_STRECH: "column overflowAuto alignItemsStrech paddingMedium backBackgroundColor borderSolid borderSmall mainBorderColor borderRadiusSmall",
            CSS_CENTER: "column overflowAuto paddingMedium alignItemsCenter backBackgroundColor borderSolid borderSmall mainBorderColor borderRadiusSmall",
            CSS_ROW: "overflowAuto paddingMedium alignItemsCenter backBackgroundColor borderSolid borderSmall mainBorderColor borderRadiusSmall",
        }
    };
});