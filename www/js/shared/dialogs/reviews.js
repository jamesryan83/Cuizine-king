

// Reviews dialog
app.dialogs.reviews = {


    init: function (data) {
        var self = this;

        $("#dialog-store-reviews-add-review").on("click", function () {
            app.util.showToast("not working yet")
        });

        $("#dialog-store-reviews-close").on("click", function () {
            self.hide();
        });
    },


    update: function () {
        $("#dialog-store-reviews-count").text("( " + data.review_count + " )");

        app.ratingControls.setValue("#dialog-store-reviews-rating-control",
            Math.round(data.rating));

        var frag = document.createDocumentFragment();
        for (var i = 0; i < data.reviews.length; i++) {

            var ratingStars =
                "<li class='rating-control-star " + (data.reviews[i].rating > 0.5 ? "active" : "") + "'></li>" +
                "<li class='rating-control-star " + (data.reviews[i].rating > 1.5 ? "active" : "") + "'></li>" +
                "<li class='rating-control-star " + (data.reviews[i].rating > 2.5 ? "active" : "") + "'></li>" +
                "<li class='rating-control-star " + (data.reviews[i].rating > 3.5 ? "active" : "") + "'></li>" +
                "<li class='rating-control-star " + (data.reviews[i].rating > 4.5 ? "active" : "") + "'></li>";

            frag.append($(
                "<div class='store-reviews-list-item'>" +
                    "<div class='store-reviews-list-item-header'>" +
                        "<ul class='rating-control inactive'>" +
                            ratingStars +
                        "</ul>" +
                        "<label>" + data.reviews[i].title + "</label>" +
                    "</div>" +
                    "<p>" + data.reviews[i].review + "</p>" +
                "</div>")[0]);
        }
        $("#dialog-store-reviews-list").empty().append(frag);
    },


    show: function () {
        $("#dialog-container").show();
        $("#dialog-store-reviews").show();
    },


    hide: function () {
        $("#dialog-container").hide();
        $("#dialog-container > div").hide();
    },

}