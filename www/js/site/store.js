
// Page for a single store
app.site.store = {

    init: function (routeData) {
        var self = this;

        app.storeContent.init();

        this.checkoutHeaderHeight = 65;
        this.$checkout = $("#store-checkout");
        this.$checkoutContent = $("#store-checkout-content");
        this.$checkoutHide = $("#store-checkout-header-hide");
        this.$checkoutShow = $("#store-checkout-header-show");


        // Get checkout height
        var checkoutHeight = localStorage.getItem("cht");
        if (!checkoutHeight) {
            checkoutHeight = (screen.height / 2) - this.checkoutHeaderHeight;
            localStorage.setItem("cht", checkoutHeight);
        }


        this.$checkoutContent.css("height", checkoutHeight);


        // Store id from url
        var id_store = routeData.route.split("/");
        id_store = id_store[id_store.length - 1];

        app.storeContent.id_store = id_store;



        new app.controls.Resizer(
            "vertical", "#store-checkout-resize",
            "#store-checkout-content", this.checkoutHeaderHeight);


        // Get the store data
        app.storeContent.getStoreData(function (storeData) {
            if (storeData) {
                storeData.id_store = app.storeContent.id_store;
                app.storeContent.addStoreDetailsDataToPage(storeData);
                app.storeContent.addMenuDataToPage(storeData);
            }
        });


        $("#store-checkout-header-show").on("click", function () {
            self.$checkoutContent.show();
            self.$checkoutHide.show();
            self.$checkoutShow.hide();
        });


        $("#store-checkout-header-hide").on("click", function () {
            self.$checkoutContent.hide();
            self.$checkoutHide.hide();
            self.$checkoutShow.show();
        });
    },

}
