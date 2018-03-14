

// Menu page
app.cms.menu = {

    init: function () {
        var self = this;

        app.storeContent.init();


        this.$categoryScrollerContainer = $(".category-scroller-container");
        this.$storeMenuList = $("#store-menu-list");
        this.$editMenuItems = $("#edit-menu-items");
        this.$previewBorder = $("#preview-mode-border");
        this.$returnButton = $(".cms-menu-return");
        this.$previewButton = $(".cms-menu-preview");
        this.$addCategoryButton = $("#cms-menu-add-category");
        this.$addMenuItemButton = $("#cms-menu-add-menu-item");
        this.$saveButton = $("#page-cms-menu-save");
        this.$editMenuItemsList = $("#edit-menu-items-list");

        this.categoryScroller = null;


        // Get the store menu data
        app.data.getStoreData(function (storeData) {
            if (!storeData) {
                console.log("no data")
                return;
            }

            self.setupPage(storeData);
        });


        // Show Edit mode
        this.$returnButton.on("click", function () {
            self.$categoryScrollerContainer.hide();
            self.$storeMenuList.hide();
            self.$editMenuItems.show();

            self.$previewBorder.hide();
            self.$previewButton.show();
            self.$returnButton.hide();
            self.$addCategoryButton.show();
            self.$addMenuItemButton.show();
            self.$saveButton.show();
        });


        // Show Preview
        this.$previewButton.on("click", function () {
            self.$categoryScrollerContainer.show();
            self.$storeMenuList.show();
            self.$editMenuItems.hide();

            self.$previewBorder.show();
            self.$previewButton.hide();
            self.$returnButton.show();
            self.$addCategoryButton.hide();
            self.$addMenuItemButton.hide();
            self.$saveButton.hide();

            self.categoryScroller.updateHeadingPositions();
        });


        // Add category
        this.$addCategoryButton.on("click", function () {
            var catButton = app.util.loadTemplate(
                "#template-edit-menu-item-heading");


            self.$editMenuItemsList.append(catButton)
        });



        // Add menu item
        this.$addMenuItemButton.on("click", function () {

        });



    },


    // Add data to page
    setupPage: function (storeData) {
        var self = this;

        if (storeData) {
            app.storeContent.addMenuDataToPage(storeData);

            // menu drag/drop
            var drake = dragula([$("#edit-menu-items-list")[0]]);

            drake.on("drop", function (el, target, source, sibling) {
//                app.data.getMenuPositions($(".store-menu-list-item"));
            });


            console.log(storeData)


            // add products to list


            // add headings to list
            var frag = document.createDocumentFragment();
            for (var i = 0; i < storeData.product_headings.length; i++) {
                var heading = storeData.product_headings[i];

                heading = app.util.loadTemplate(
                    "#template-edit-menu-item-heading", heading);

                frag.append(heading[0]);
            }

            this.$editMenuItemsList.append(frag);

            // Category scroller
            self.categoryScroller =
                new app.controls.CategoryScroller(
                storeData.product_headings, 100, 100);
        }
    },

}