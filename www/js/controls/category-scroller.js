
// Scroller on store and cms menu pages
app.controls.CategoryScroller = function (categories, v1, v2) {
    var self = this;

    this.$html = $("html");
    var scrollerListEl = ".category-scroller-list";
    var $categoryScrollerContainer = $(".category-scroller-container");
    var $categoryScroller = $(".category-scroller");
    var $categoryScrollerList = $(scrollerListEl);
    var $categoryScrollerListItems = [];

    var i = 0;
    this.headingPositions = [];
    var verticalOffset1 = v1;
    var verticalOffset2 = v2;


    // Sets the active heading
    function setActiveHeading () {
        var st = self.$html.scrollTop();
        for (i = self.headingPositions.length - 1; i >= 0; i--) {
            if (st > self.headingPositions[i] - 110) {
                $categoryScrollerListItems.removeClass("active");
                $($categoryScrollerListItems[i]).addClass("active");
                break;
            }
        }
    }


    // Add items to scroller
    var $item = null;
    var frag = document.createDocumentFragment();
    for (i = 0; i < categories.length; i++) {
        $item = $("<li class='store-menu-nav-list-item'>" + categories[i].title + "</li>");
        frag.append($item[0]);
    }
    $categoryScrollerList.append(frag);


    // make scrollable
    new app.controls.HorizontalScroller(scrollerListEl, function (item) {

        // scroll item clicked
        var $el = $(".store-menu-list-item.heading:contains('" + item.innerText + "')");
        var verticalOffset = screen.width < 670 ? verticalOffset2 : verticalOffset1;

        if ($el[0]) {
            $("html").animate({
                scrollTop: $el[0].getBoundingClientRect().top +
                    self.$html.scrollTop() - verticalOffset
            }, 500);
        }
    });


    // window resized
    $(window).on("resize", function () {
        self.updateHeadingPositions();
        setActiveHeading();
    });


    // Change to floating navbar
    $(window).on("scroll", function () {
        if (!$categoryScrollerListItems.length) return;

        if ($categoryScrollerContainer[0].getBoundingClientRect().top < 20) {
            $categoryScroller.addClass("floating");
        } else {
            $categoryScroller.removeClass("floating");
        }

        setActiveHeading();
    });


    // get scroller items for highlighting and update heading positions
    $categoryScrollerListItems = $(".store-menu-nav-list-item");
    this.updateHeadingPositions();
}

// update the position of the headings from the top of the screen
app.controls.CategoryScroller.prototype.updateHeadingPositions = function () {
    var self = this;
    self.headingPositions = [];

    $(".store-menu-list-item.heading").each(function () {
        self.headingPositions.push(
            this.getBoundingClientRect().top + self.$html.scrollTop()
        );
    });
}
