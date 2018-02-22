
// https://docs.microsoft.com/en-us/rest/api/
// https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-create-service-principal-portal

var request = require("request");

// var tenantId = "f12c5c9b-8a40-4fff-9aa0-f7719b468326"; // aka directoryId
// var apiAppId = "959e0b5b-079f-4dc6-8e52-cdecabef58d2";

var apiKey = "A8GclCKVyLGMOsBeCSL9pHah0qA9ZmUSQeg20WIUiq0=";
var subscriptionId = "9349b27b-2b9d-4a85-ad7d-cff75a266373";
var resourceGroupName = "menuthing";
var serverName = "sqljames";
var databaseName = "menuthing";

var url = "https://management.azure.com/subscriptions/" + subscriptionId +
    "/resourceGroups/" + resourceGroupName + "/providers/Microsoft.Sql/servers/" +
    serverName + "/databases/" + databaseName + "?api-version=2014-04-01";


request({
    url: url, headers: { "Authorization": "Bearer " + apiKey }
}, function (error, response, body) {
  console.log("error:", error);
  console.log("statusCode:", response && response.statusCode);
  console.log("body:", body);
});



@import "dialogs/business-hours";
@import "dialogs/description";
@import "dialogs/reviews";


// Shared by website store page and cms details/menu pages


// Store content
#store-content {
    padding: 0 50px;
    position: relative;


    // Store Info (used by #store-info and #store-info-edit in cms section)
    > .container {
        padding: 20px;

        > .container-inner {
            position: relative;
            width: 100%;
            max-width: 1000px;


            // Store Details
            > div:last-of-type {
                float: left;
                text-align: left;
                width: calc(100% - #{$storeLogoWidth1});
                padding: 10px 20px 0 20px;

                > .container-inner {
                    text-align: left;
                }
            }
        }
    }



    // Store logo
    .image-store-logo {
        float: left;
        position: relative;

        > .container-inner {
            margin-top: 20px;
            width: $storeLogoWidth1;
            height: $storeLogoHeight1;

            img, div:not(.upload-button) {
                height: 100%;
                width: 100%;
            }

            // loading and empty overlay things
            div:not(.upload-button) {
                position: absolute;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 10;
                background-color: $colorGray13;
                width: $storeLogoWidth1;
                height: $storeLogoHeight1;

                label {
                    font-size: 16px;
                    white-space: nowrap;
                    font-weight: bold;
                    color: $colorBlue2;
                }
            }

            .store-info-image-loading {
                display: none;

                label {
                    animation: loadingScreenAnimation 1s infinite;
                }
            }
        }
    }



    // Store details row
    .store-info-row {
        margin-top: 5px;


        > label:first-of-type:not(.label-link) {
            font-weight: bold;
            width: 90px;
        }


        &:last-of-type {
            > label {
                height: 54px;
                line-height: 54px;
            }

            > div {
                display: inline-block;
                width: calc(100% - 145px);
                vertical-align: top;
                white-space: nowrap;

                label:first-of-type {
                    width: 50px;
                }
            }

            #store-info-phone-number {
                margin: 0 10px;
                color: $colorBlue2;
                min-width: 90px;
                max-width: 130px;
                white-space: nowrap;
                font-weight: bold;
            }

            #store-info-email {
                margin-left: 10px;
                color: $colorBlue2;
                min-width: 90px;
                max-width: 250px;
                white-space: nowrap;
                font-weight: bold;
            }
        }
    }



    // website store details page
    #store-info-details {

        label {
            display: inline-block;
        }


        #store-info-details-other {
            display: inline-block;

            // description
            #store-info-description-container {
                min-height: 120px;

                #store-info-description {
                    overflow: hidden;
                    text-align: justify;
                    max-height: 92px;
                }

                #store-info-button-description {
                    margin-left: 5px;
                }
            }


            // hours
            #store-info-hours-is-open {
                color: $colorBlue2;
                margin-right: 10px;
                font-weight: bold;
                font-size: 20px;
                height: 20px;
                line-height: 20px;
                vertical-align: middle;
            }


            #store-info-hours-opens-at {
                color: $colorGreen1;
            }


            // ratings
            .rating-control {
                padding: 2px;
                margin-left: -5px;
            }

        }
    }




    // heading menu item
    .store-menu-list-item.heading {
        margin-top: 10px;
        padding: 20px 0;

        h4 {
            font-size: 40px;
            line-height: 40px;
            height: 40px;
            color: $colorBlue2;
        }

        > hr {
            margin-bottom: 10px;
            background-color: $colorBlue3;
        }
    }



    // normal menu item
    .store-menu-list-item {
        position: relative;
        white-space: nowrap;
        overflow: hidden;


        &:not(.heading) {
            cursor: pointer;
            margin-bottom: 15px;
            background-color: $colorBlue7;
            box-shadow: 1px 1px 1px 1px $colorBlue4;
            border-radius: 2px;
        }


        h4, p, label, span {
            pointer-events: none;
        }


        // item inner div
        > div {
            width: 100%;
            height: 100%;
            background-color: $colorBlue7;

            > div {
                height: 100%;
            }
        }


        // content
        .store-menu-list-item-content {
            float: left;
            width: calc(100% - 150px);
        }


        // button on right
        .store-menu-list-item-button {
            position: absolute;
            width: 150px;
            right: 0;
            top: 0;
            border-left: 1px solid $colorBlue3;
            font-weight: bold;

            > label {
                text-align: center;
                width: 100px;
                white-space: normal;
            }

            &:hover {
                background-color: $colorBlue8;
            }
        }



        &.options-active {
            .store-menu-list-item-details {
                height: 0;
                opacity: 0;
            }

            .store-menu-list-item-options {
                transform: translateX(0);
                position: relative;
            }
        }


        // details
        .store-menu-list-item-details {
            transition: opacity 0.5s;

            .store-menu-list-item-content {
                padding: 20px;
                padding-left: 40px;

                &:hover {
                    background-color: $colorBlue8;
                }

                h4 {
                    font-weight: bold;
                    font-size: 21px;
                    margin-bottom: 10px;
                    margin-left: -10px;
                    white-space: normal;
                    max-width: calc(100% - 200px);
                    display: inline;
                }

                span {
                    margin-left: 15px;
                    color: $colorBlue2;
                    font-weight: bold;
                    padding-bottom: 2px;
                    vertical-align: text-top;
                }

                p {
                    display: block;
                    max-height: 46px;
                    font-size: 16px;
                    line-height: 23px;
                    overflow: hidden;
                    white-space: normal;
                }

                label {
                    display: none;
                }
            }
        }


        // options
        .store-menu-list-item-options {
            position: absolute;
            top: 0;
            left: 0;
            transform: translateX(100%);
            z-index: 10;
            transition: transform 0.3s;

            // A single option
            .store-menu-list-item-option {
                float: left;
                height: 100%;
                text-align: center;
                position: relative;

                &:hover {
                    background-color: $colorBlue8;
                }

                > div {
                    position: relative;

                    label {
                        pointer-events: none;
                        display: block;
                        height: 33%;
                        line-height: 24px;
                        white-space: normal;
                    }

                    label:nth-child(1) {
                        font-weight: bold;
                        font-size: 20px;
                    }

                    label:nth-child(2) {
                        font-size: 19px;
                    }

                    label:nth-child(3) {
                        font-weight: bold;
                        font-size: 14px;
                        color: $colorBlue2;
                    }
                }
            }

            .store-menu-list-item-option:not(:last-of-type) {
                border-right: 1px solid $colorBlue3;
            }
        }


        &:not(.heading):active {
            transform: scale(0.99, 0.99);
        }

    }



    // list of menu items
    #store-menu-list {
        width: 100%;
    }



    // Footer
    #store-footer {
        padding: 30px 10px;

        > p {
            font-size: 10px;
        }
    }




    @media (max-width: $mediaWidth4) {
        > .container {
            padding: 0 0 20px 0 !important;

            > .container-inner {
                clear: none;

                > .container:last-of-type {
                    float: none;
                    display: block;
                    width: 100%;
                }
            }
        }

        .image-store-logo {
            float: none;
        }

        #store-info-details {
            text-align: center;
            width: 100%;

            > div {
                text-align: left;
            }

            #store-info-details-other {
                padding-top: 20px;
            }
        }
    }




    @media (max-width: $mediaWidth3) {
        text-align: center;

        .category-scroller-container {
            margin-bottom: 30px;
        }

        // heading menu item
        .store-menu-list-item.heading {
            text-align: center;
            padding-bottom: 10px;
            width: 95%;

            h4 {
                font-size: 22px;
                line-height: 30px;
                height: 30px;
            }
        }

        .store-menu-list-item {
            display: inline-block;
            text-align: left;

            &:not(.heading) {
                width: 90%;
                margin-bottom: 20px;
            }

            .store-menu-list-item-content {
                float: none;
                width: 100%;
                height: auto;
            }

            // button on right
            .store-menu-list-item-button {
                border-top: 1px solid $colorBlue3;
                display: block;
                position: relative;
                width: 100%;
                right: auto;
                top: auto;
                height: 40px;
                border-left: none;
            }


            // options
            .store-menu-list-item-options {

                .store-menu-list-item-option {
                    display: block;
                    width: 100% !important;
                    float: none;
                    height: auto;
                    text-align: left;
                    padding: 20px;

                    > div {
                        left: auto;
                        top: auto;
                        transform: none;

                        label {
                            display: inline-block;
                            height: auto;
                            line-height: 24px;
                        }
                    }
                }

                .store-menu-list-item-option:not(:last-of-type) {
                    border-right: none;
                }
            }


            &:not(.heading):active {
                transform: scale(0.99, 0.99);
            }
        }
    }




    @media (max-width: $mediaWidth1) {
        padding: 0 10px !important;

        #store-info-details {
            #store-info-button-description {
                display: block;
                margin-left: -5px;
            }

            #store-info-details-other {
                > .store-info-row {
                    > label:first-of-type {
                        margin-left: -10px;
                        display: block;
                        height: 27px;
                        line-height: 27px;
                        vertical-align: inherit;
                    }
                }
            }
        }
    }




    @media (max-width: $mediaMobileWidth1) {
        .image-store-logo {
            .container-inner {
                width: 300px !important;
                height: 220px !important;

                div:not(.upload-button) {
                    width: 300px !important;
                    height: 220px !important;
                }
            }
        }
    }

}

