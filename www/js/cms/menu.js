

// Menu page
app.cms.menu = {

    init: function (routeData) {
        var self = this;


        app.storeContent.init(routeData, true);


        // Store id
        var id_store = app.util.getStoreIdFromStorage();


        // Get the store data
        app.storeContent.getStoreData(id_store, function (storeData) {
            self.setupPage(storeData);
        });


        // Show Edit mode
        $(".cms-menu-return").on("click", function () {
            $("#store-info-inner").hide();
            $("#store-info-edit").show();

            $("#preview-mode-border").hide();
            $(".cms-menu-preview").show();
            $(".cms-menu-return").hide();
        });


        // Show Preview
        $(".cms-menu-preview").on("click", function () {
            $("#store-info-edit").hide();
            $("#store-info-inner").show();

            $("#preview-mode-border").show();
            $(".cms-menu-preview").hide();
            $(".cms-menu-return").show();
        });

    },


    setupPage: function (storeData) {
        if (storeData) {
            app.storeContent.addMenuDataToPage(storeData);
        }
    },

}