
// Scroller on store and cms menu pages
app.controls.CategoryScroller = function (categories) {

    var scrollerListEl = ".category-scroller-list";
    var $categoryScrollerContainer = $(".category-scroller-container");
    var $categoryScroller = $(".category-scroller");
    var $categoryScrollerList = $(scrollerListEl);


    // Add items to scroller
    var frag = document.createDocumentFragment();
    for (var i = 0; i < categories.length; i++) {
        var $item = $("<li class='store-menu-nav-list-item'>" + categories[i].title + "</li>");

        // Item clicked event
        $item.on("click", function (e) {
            var el = $(".store-menu-list-item-group-heading:contains('" + e.target.innerText + "')");

            if (el[0]) {
                $("html").animate({ scrollTop: el[0].offsetTop - 30 }, 500);
            }
        });

        frag.append($item[0]);
    }
    $categoryScrollerList.append(frag);


    // top category nav
    new app.controls.HorizontalScroller(scrollerListEl, function (clickedEl) {

    });


    // Change to floating navbar
    $(window).on("scroll", function (e) {
        if ($categoryScrollerContainer[0].getBoundingClientRect().top < 20) {
            $categoryScroller.addClass("floating");
        } else {
            $categoryScroller.removeClass("floating");
        }
    });
}