
// Page for a single store
app.site.store = {

    init: function (routeData) {
        var self = this;

        app.storeContent.init("site");

        this.checkoutHeaderHeight = 60;
        this.$checkout = $("#store-checkout");
        this.$checkoutContent = $("#store-checkout-content");
        this.$checkoutTable = $("#store-checkout-content-table");
        this.$checkoutHide = $("#store-checkout-header-hide");
        this.$checkoutShow = $("#store-checkout-header-show");
        this.$checkoutDetails = $("#store-checkout-header-details");


        // Get checkout height and show checkout
        var checkoutHeight = localStorage.getItem("cht");
        var checkoutOpen = localStorage.getItem("cop");
        if (!checkoutHeight) {
            checkoutHeight = (screen.height / 2) - this.checkoutHeaderHeight;
            localStorage.setItem("cht", checkoutHeight);
        }

        if (checkoutOpen) this.$checkoutContent.show();
        this.$checkoutContent.css("height", checkoutHeight);


        // Get store id from url
        var urlParts = routeData.route.split("/");
        var id_store = urlParts[urlParts.length - 1];


        // checkout vertical resizer
        new app.controls.Resizer(
            "vertical", "#store-checkout-resize",
            "#store-checkout-content", this.checkoutHeaderHeight, function () {

            });


        // Get the store data
        app.data.getStoreData(id_store, function (storeData) {
            console.log(storeData)
            self.afterStoreDataLoaded(storeData);
        });


        // show checkout
        this.$checkoutShow.on("click", function () {
            self.showCheckout();
        });


        // hide checkout
        this.$checkoutHide.on("click", function () {
            self.hideCheckout();
        });
    },



    // After store data is loaded
    afterStoreDataLoaded: function (storeData) {
        var self = this;

        // add data to page
        app.storeContent.addStoreDetailsDataToPage(storeData.id_store, storeData, "site");
        app.storeContent.addMenuDataToPage(storeData);

        // Category scroller
        new app.controls.CategoryScroller(storeData.product_headings, 100, 100);

        this.updateCheckout();

        // Product option clicked
        $(".store-menu-list-item-option").on("click", function (e) {
            self.addItemToCheckout(
                e.currentTarget.dataset.productOptionId,
                $(e.currentTarget).closest(".store-menu-list-item")[0].dataset.productId);
        });
    },



    // Show the checkout
    showCheckout: function () {
        this.$checkoutContent.show();
        this.$checkoutHide.show();
        this.$checkoutShow.hide();
    },


    // Hide the checkout
    hideCheckout: function () {
        this.$checkoutContent.hide();
        this.$checkoutHide.hide();
        this.$checkoutShow.show();
    },


    // Adds an item to the checkout data
    addItemToCheckout: function (productId, productOptionId) {
        if (!productId || !productOptionId) {
            console.log("productId or productOptionId missing");
            return;
        }

        var data = app.data.getCheckoutData();
        data.push({
            id_product: productId,
            id_product_option: productOptionId,
            quantity: 1,
            extras: []
        });
        app.data.setCheckoutData(data);

        this.updateCheckout(data);
    },


    // TODO : i18n
    // Update the checkout with the current data
    updateCheckout: function (data) {
        if (!data) data = app.data.getCheckoutData();

        this.$checkoutTable.empty();

        // checkout data is empty
        if (data.length === 0) {
            this.$checkout.hide();
            app.data.setCheckoutData([]);
            this.$checkoutDetails.text("");
            return;
        }

        if (!app.storeContent.storeData) return;

        // add items to checkout
        var product = null;
        var option = null;
        var frag = document.createDocumentFragment();
        for (var i = 0; i < data.length; i++) {
            product = app.storeContent.getProduct(data[i].id_product);
            option = app.storeContent.getProductOption(data[i].id_product_option);

            if (!product) {
                console.log("unable to find product", product, data[i]);
                continue;
            }

            if (!option) {
                console.log("unable to find option", option, data[i]);
                continue;
            }

            for (var j = 0; j < 20; j++) {
            frag.append(app.util.loadTemplate("#template-store-checkout-item", {
                name: product.name,
                nameOption: option.name,
                price: option.price,
                quantity: data[i].quantity,
                extras: data[i].extras,
                total: "$25.92"
            })[0]);
            }
        }
        this.$checkoutTable.append(frag);



        // checkout header text
        var text = data.length + " Item" + (data.length === 1 ? "" : "s") + " in your Basket";
        this.$checkoutDetails.text(text);

        this.$checkout.show();

    },

}
