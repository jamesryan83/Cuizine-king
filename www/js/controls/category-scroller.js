
// Scroller on store and cms menu pages
app.controls.CategoryScroller = function (categories) {

    var $html = $("html");
    var scrollerListEl = ".category-scroller-list";
    var $categoryScrollerContainer = $(".category-scroller-container");
    var $categoryScroller = $(".category-scroller");
    var $categoryScrollerList = $(scrollerListEl);
    var $categoryScrollerListItems = [];
    var $headings = $(".store-menu-list-item.heading");

    var i = 0;
    var headingPositions = [];


    // update the position of the headings from the top of the screen
    function updateHeadingPositions () {
        headingPositions = [];
        $headings.each(function () {
            headingPositions.push(this.getBoundingClientRect().top + $html.scrollTop());
        });
    }

    // Sets the active heading
    function setActiveHeading () {
        var st = $html.scrollTop();
        for (i = headingPositions.length - 1; i >= 0; i--) {
            if (st > headingPositions[i] - 100) {
                $categoryScrollerListItems.removeClass("active");
                $($categoryScrollerListItems[i]).addClass("active");
                break;
            }
        }
    }


    // Add items to scroller
    var frag = document.createDocumentFragment();
    for (i = 0; i < categories.length; i++) {
        var $item = $("<li class='store-menu-nav-list-item'>" + categories[i].title + "</li>");

        // Item clicked event
        $item.on("click", function (e) {
            var el = $(".store-menu-list-item.heading:contains('" + e.target.innerText + "')");

            if (el[0]) {
                $("html").animate({ scrollTop: el[0].offsetTop + 100 }, 500);
            }
        });

        frag.append($item[0]);
    }
    $categoryScrollerList.append(frag);


    // make scrollable
    new app.controls.HorizontalScroller(scrollerListEl, function () { });


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


    // Resize window
    $(window).on("resize", function () {
        updateHeadingPositions();
        setActiveHeading();
    });


    // get scroller items for highlighting and update heading positions
    $categoryScrollerListItems = $(".store-menu-nav-list-item");
    updateHeadingPositions();

}