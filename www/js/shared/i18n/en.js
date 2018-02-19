
if (typeof app === "undefined") {
    var app = {};
}

app.i18n = {};

// english
app.i18n.en = {
    storeIdMissing: "Store Id missing",
    imageFileMissing: "Image file missing",
    imageFileWrongType: "Incorrect image type.  Only Jpg is supported",
    imageFileTooBig: "Image file size too big.  Must be < 250kB",
}


if (typeof module !== "undefined" && this.module !== module) {
    exports = module.exports = app.i18n.en;
}