
// Creates a suburb typeahead control
app.controls.Typeahead = function (callback) {
    var self = this;

    var $typeaheadInput = $("#typeahead-suburb-search");
    var $typeaheadList = $("#typeahead-suburb-list");

    var lookupTimeout = 500;
    var typeaheadTimeout = null;

    this.baseUrl = "/api/v1/location?q=";


    // when a dropdown item is selected
    function selectItem (el) {
        var result = {
            suburb: encodeURIComponent($(el).find(".typeahead-item-suburb").text()),
            postcode: $(el).find(".typeahead-item-postcode").text()
        };

        $typeaheadList.hide();

        if (!result.suburb || !result.postcode) {
            return callback(null);
        }

        // put selected item into input
        $typeaheadInput.val(result.postcode + " - " + result.suburb);

        return callback(result);
    }


    // list item clicked
    $typeaheadList.on("click", function (e) {
        selectItem(e.target);
    });


    // input focused
    $typeaheadInput.on("focus", function () {
        this.setSelectionRange(0, this.value.length);
    });


    // when typing, generate dropdown list
    $typeaheadInput.on("keyup", function (e) {
        var value = $(this).val().toLowerCase();

        // esc
        if (e.which == 27) return;

        // enter
        if (e.which == 13) {
            var selectedItem = $(".typeahead-item.active");
            if (selectedItem.length > 0) {
                selectItem(selectedItem[0]);
            }
            return;
        }

        // up arrow select previous item
        if (e.which == 38) {
            var items = $(".typeahead-item");
            for (var i = 0; i < items.length; i++) {
                if ($(items[i]).hasClass("active")) {
                    $(items[i]).removeClass("active");
                    $(items[i]).prev().addClass("active");
                    break;
                }

                if (i == items.length - 1) {
                    $(items[items.length - 1]).addClass("active");
                }
            }
            return;
        }

        // down arrow select next item
        if (e.which == 40) {
            var items = $(".typeahead-item");
            for (var i = items.length - 1; i >= 0; i--) {
                if ($(items[i]).hasClass("active")) {
                    $(items[i]).removeClass("active");
                    $(items[i]).next().addClass("active");
                    break;
                }

                if (i == 0) $(items[0]).addClass("active");
            }
            return;
        }


        // allow a lookup every x ms
        clearTimeout(typeaheadTimeout);
        typeaheadTimeout = setTimeout(function () {
            if (!value) {
                $typeaheadList.hide();
                return;
            }

            // get locations from server
            var url = self.baseUrl + value;
            app.util.ajaxRequest({
                method: "GET", url: url
            }, function (err, result) {
                if (err) return;

                // create new list items
                var listItems = [];
                for (var i = 0; i < result.data.length; i++) {
                    listItems.push(
                        "<li class='typeahead-item'>" +
                            "<label class='typeahead-item-postcode'>" + result.data[i].postcode + "</label>" +
                            "<span>\u2654</span>" +
                            "<label class='typeahead-item-suburb'>" + app.util.toTitleCase(result.data[i].suburb) + "</label>" +
                        "</li>");
                }

                $typeaheadList.empty();

                // add list items
                if (listItems.length > 0) {
                    $typeaheadList.append(listItems.join(""));
                    $typeaheadList.show();
                } else {
                    $typeaheadList.show();
                    $typeaheadList.append(
                        "<li class='typeahead-item'>NO RESULTS</li>");
                }
            });
        }, lookupTimeout);
    });


    // hide when click outside control
    $(window).on("mousedown", function (e) {
        if (e.target.className != "typeahead-item") {
            $typeaheadList.hide();
        }
    });


    // hide when esc is presed
    $(window).on("keydown", function (e) {
        if (e.which == 27) {
            $typeaheadList.hide();
        }
    });

}

