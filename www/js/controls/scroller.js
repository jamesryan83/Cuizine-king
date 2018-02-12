

// Horizontal scroller
app.controls.HorizontalScroller = function (containerEl, clickCallback) {

    var mouseIsDown = false;
    var startMouseX = 0;
    var startPosX = 0;
    var currentX = 0;

    // start
    $(containerEl).on("mousedown", function (e) {
        mouseIsDown = true;
        startMouseX = e.clientX;
        startPosX = $(this).scrollLeft();
    });


    // scrolling
    $(window).on("mousemove", function (e) {
        if (mouseIsDown) {
            e.stopPropagation();
            $(containerEl).scrollLeft(startPosX - (e.clientX - startMouseX));
        }
    });

    // stop
    $(window).on("mouseup", function (e) {
        mouseIsDown = false;
    });


    // click callback if mouse doesn't move much
    $(containerEl).on("mouseup", function (e) {
        var diff = e.clientX - startMouseX;

        if (diff >= -4 && diff <= 4) {
            clickCallback(e.target);
        }
    });
}