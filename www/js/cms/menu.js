

// Menu page
app.cms.menu = {

    init: function () {
        var self = this;

        app.storeContent.init("cms");

        this.$returnButton = $(".cms-menu-return");
        this.$editMenuItems = $("#edit-menu-items");
        this.$saveButton = $("#page-cms-menu-save");
        this.$previewButton = $(".cms-menu-preview");
        this.$previewBorder = $("#preview-mode-border");
        this.$addHeadingButton = $("#cms-menu-add-heading");
        this.$editMenuItemsList = $("#edit-menu-items-list");
        this.$addMenuItemButton = $("#cms-menu-add-menu-item");
        this.$categoryScrollerContainer = $(".category-scroller-container");

        this.categoryScroller = null;


        // Get the store menu data
        app.data.getStoreData(function (storeData) {
            if (!storeData) return;

            self.setupPage(storeData);
        });


        // Bottom bar buttons
        this.$returnButton.on("click", function () {
            self.showPreview();
        });

        this.$previewButton.on("click", function () {
            self.hidePreview();
        });

        this.$addHeadingButton.on("click", function () {
            var catButton = app.util.loadTemplate(
                "#template-edit-menu-item-heading");

            self.$editMenuItemsList.append(catButton)
        });

        this.$addMenuItemButton.on("click", function () {

        });
    },


    // Show preview
    showPreview: function () {
        this.$returnButton.hide();
        this.$previewBorder.hide();
        app.storeContent.$menuList.hide();
        this.$categoryScrollerContainer.hide();

        this.$saveButton.show();
        this.$editMenuItems.show();
        this.$previewButton.show();
        this.$addHeadingButton.show();
        this.$addMenuItemButton.show();
    },


    // Hide preview
    hidePreview: function () {
        this.$saveButton.hide();
        this.$editMenuItems.hide();
        this.$previewButton.hide();
        this.$addHeadingButton.hide();
        this.$addMenuItemButton.hide();

        this.$returnButton.show();
        this.$previewBorder.show();
        app.storeContent.$menuList.show();
        this.$categoryScrollerContainer.show();

        this.categoryScroller.updateHeadingPositions();
    },



    // Add data to page
    setupPage: function (storeData) {
        var self = this;

        app.storeContent.addMenuDataToPage(storeData);

        if (!storeData) return;


        // menu drag/drop
        var drake = dragula([$("#edit-menu-items-list")[0]]);
        drake.on("drop", function (el, target, source, sibling) {
//                app.data.getMenuPositions($(".store-menu-list-item"));
        });



        // add products to list
        var frag = document.createDocumentFragment();
        for (var i = 0; i < storeData.products.length; i++) {
            var product = storeData.products[i];

            var $el = app.util.loadTemplate(
                "#template-edit-menu-item-product", product);

            $el.attr("data-id", product.id_product);
            frag.append($el[0]);
        }


        // add headings to fragment before products
        for (var i = 0; i < storeData.product_headings.length; i++) {
            var heading = storeData.product_headings[i];

            heading.title = heading.title || "Enter a heading...";

            var $el = app.util.loadTemplate(
                "#template-edit-menu-item-heading", heading);

            $el.attr("data-id", heading.id_product_heading);

            $(frag).find(
                ".edit-menu-item-product[data-id='" +
                heading.above_product_id + "']")
                .before($el);
        }



        // delete heading
//            heading.find(".edit-menu-item-delete").on("click", function () {
//                $(this).closest(".edit-menu-item-heading").remove();
//            });



//            for (var i = 0; i < storeData.product_headings.length; i++) {
//                var heading = storeData.product_headings[i];
//console.log(heading)
//                heading = app.util.loadTemplate(
//                    "#template-edit-menu-item-heading", heading);
//
//
//                // delete heading
//                heading.find(".edit-menu-item-delete").on("click", function () {
//                    $(this).closest(".edit-menu-item-heading").remove();
//                });
//
//                // click label
//                heading.find(".edit-menu-item-label").on("click", function () {
//                    var $el = $(this);
//
//                    $(".edit-menu-item-label").show();
//                    $el.hide();
//                    $(".edit-menu-item-input").hide();
//                    $el.next().show();
//                    setTimeout(function () { $el.next().focus(); }, 100);
//                });
//
//                // input lose focus
//                heading.find(".edit-menu-item-input").on("blur", function () {
//                    $(".edit-menu-item-input").hide();
//                    $(this).prev().show();
//                });
//
//                frag.append(heading[0]);
//            }

        this.$editMenuItemsList.append(frag);






        // Category scroller
        self.categoryScroller =
            new app.controls.CategoryScroller(
            storeData.product_headings, 100, 100);

    },

}