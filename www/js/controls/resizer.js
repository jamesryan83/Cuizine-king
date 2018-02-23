
// Creates a vertical or horizontal resizer
app.controls.Resizer = function (direction, handle, container, offset, resizeCallback) {

    var $handle = $(handle);
    var $container = $(container);

    var startX = 0;
    var startY = 0;
    var mouseIsDown = false;
    var currentHeight = 0;


    $handle.on("mousedown", function (e) {
        mouseIsDown = true;
        startX = e.clientX;
        startY = e.clientY;

        console.log(startX, startY)
    });


    $(window).on("mousemove", function (e) {
        e.preventDefault();

        if (mouseIsDown) {
            $container.show();
            currentHeight = window.innerHeight - e.clientY - offset;
            $container.height(currentHeight);

            if (resizeCallback) resizeCallback();
        }
    });


    $(window).on("mouseup", function () {
        mouseIsDown = false;
    });


//    if (direction === "vertical") {
//
//    } else if (direction === "horizontal") {
//
//    } else {
//        throw new Error("Unknown Resizer direction: " + direction);
//    }


}