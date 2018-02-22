

// Horizontal scroller
app.controls.HorizontalScroller = function (scrollerListEl, clickCallback) {
    var self = this;

    var mouseIsDown = false;
    this.startMouseX = 0;
    var startPosX = 0;
    var scrollTriggered = false;
    this.diff = 0;

    this.scrollBlurTolerance = 5;

    this.$scrollerList = $(scrollerListEl);
    this.$scrollBlurLeft = this.$scrollerList.prev();
    this.$scrollBlurRight = this.$scrollerList.next();


    // start
    this.$scrollerList.on("mousedown", function (e) {
        mouseIsDown = true;
        scrollTriggered = false;
        self.startMouseX = e.clientX;
        startPosX = $(this).scrollLeft();
    });


    // scrolling
    $(window).on("mousemove", function (e) {
        if (mouseIsDown) {
            e.stopPropagation();
            self.$scrollerList.scrollLeft(startPosX - (e.clientX - self.startMouseX));

            if (!self.isInsideTolerance(e.clientX)) {
                scrollTriggered = true;
            }
        }
    });


    // stop
    $(window).on("mouseup", function () {
        mouseIsDown = false;
    });


    // click callback if mouse doesn't move much
    this.$scrollerList.on("mouseup", function (e) {
        if (!scrollTriggered) {
            return clickCallback(e.target);
        }

        scrollTriggered = false;
    });


    // scroll event
    this.$scrollerList.on("scroll", function () {
        self.updateScrollBlurs();
    });


    // Window resize
    $(window).on("resize", function () {
        self.updateScrollBlurs();
    });


    this.updateScrollBlurs();
}



// turn blurs on or off
app.controls.HorizontalScroller.prototype.updateScrollBlurs = function () {
    if (this.$scrollerList[0].scrollLeft > this.scrollBlurTolerance) {
        this.$scrollBlurLeft.show();
    } else {
        this.$scrollBlurLeft.hide();
    }

    if (this.$scrollerList[0].scrollLeft + this.$scrollerList[0].clientWidth < this.$scrollerList[0].scrollWidth - this.scrollBlurTolerance) {
        this.$scrollBlurRight.show();
    } else {
        this.$scrollBlurRight.hide();
    }
}


// is outside tolerance
app.controls.HorizontalScroller.prototype.isInsideTolerance = function (clientX) {
    this.diff = clientX - this.startMouseX;
    return (this.diff >= -this.scrollBlurTolerance && this.diff <= this.scrollBlurTolerance);
}