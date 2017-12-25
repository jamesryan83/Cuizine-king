//"use strict";
//
//var app = app || {};
//
//
//// Storage. file/folder stuff
//// path is relative to phone external storage root folder (file:///storage/emulated/0/)
//
//
//app.storage = {
//
//    startupSetup: function (callback) {
////        app.fileFolder.createFolder("Neeonn/photos", false, function (success) {
////            if (success === true) {
////                app.fileFolder.createFolder("Neeonn/storyboards", false, function (success) {
////                    if (success === true) {
////                        callback(true);
////                    } else {
////                        callback(false);
////                    }
////                });
////            } else { callback(false); }
////        });
//    },
//
//
//
//
//    // Returns the generated html from json files
//    getGeneratedHtml: function () {
//        // TODO : return array [loggedInHtml, loggedOutHtml]
//    },
//
//
//
//
//
//
//// ---------------------------------- General File/Folder Functions ----------------------------------
//
//
////    // Creates a folder recursively - path needs to be like "folder1/folder2/folder3"
////    createFolder: function (path, exclusive, callback) {
////        var folders = path.split("/");
////
////        var errorCallback = function (e) { app.fileFolder._errorHandler(e); callback(false); }
////
////        window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (entry) {
////            app.fileFolder._createFolderRecursively(entry, exclusive, folders, callback)
////        }, errorCallback);
////    },
////
////
////    // goes with function above
////    _createFolderRecursively = function (entry, exclusive, folders, callback) {
////        var errorCallback = function (e) { app.fileFolder._errorHandler(e); callback(false); }
////
////        // remove possible errors in array
////        if (folders[0] == "." || folders[0] == "") { folders.splice(0, 1); }
////
////        // create folder
////        entry.getDirectory(folders[0], { create: true, exclusive: exclusive }, function (directoryEntry) {
////            if (folders.length > 1) {
////                folders.splice(0, 1);
////                app.fileFolder._createFolderRecursively(directoryEntry, exclusive, folders, callback);
////            } else {
////                callback(true);
////            }
////        }, errorCallback);
////    },
////
////
////
////    // Creates a file with text content
////    // Directory must exist otherwise get INVALID_MODIFICATION_ERR
////    createFile: function (path, exclusive, text, callback) {
////        var errorCallback = function (e) { app.fileFolder._errorHandler(e); callback(false); }
////
////        window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (entry) {
////            entry.getFile(path, { create: true, exclusive: exclusive }, function (fileEntry) {
////                if (text !== null && text.length > 0) {
////                    fileEntry.createWriter(function (fileWriter) {
////                        fileWriter.onwriteend = function (e) {
////                            callback(true);
////                            return;
////                        }
////                        fileWriter.onerror = function (e) {
////                            alert("Error writing to file");
////                            console.log(e.toString());
////                            callback(false);
////                            return;
////                        }
////
////
////                        // http://stackoverflow.com/a/15335607
////                        var blob = null;
////                        try {
////                            blob = new Blob([text], { type: 'text/plain' });
////                        } catch(e) {
////                            window.BlobBuilder = window.BlobBuilder ||
////                                    window.WebKitBlobBuilder ||
////                                    window.MozBlobBuilder ||
////                                    window.MSBlobBuilder;
////
////                            if (e.name == 'TypeError' && window.BlobBuilder) {
////                                var bb = new BlobBuilder();
////                                bb.append(text);
////                                blob = bb.getBlob('text/plain');
////                            }
////                            else if (e.name == "InvalidStateError") {
////                                // InvalidStateError (tested on FF13 WinXP)
////                                blob = new Blob([text], {type: 'text/plain'});
////                            } else {
////                                alert("Unfortunately the version of your phone is too old to " +
////                                      "run this program.  You need at least Android v4.1");
////                                console.log("Error creating file : No Blob or BlobBuilder constructor");
////                                return;
////                            }
////                        }
////
////                        fileWriter.write(blob);
////                    });
////                } else {
////                    alert("text for createFile is empty");
////                    callback(false);
////                }
////            }, errorCallback);
////        }, errorCallback);
////    },
////
////
////    // Save image blob to file
////    saveBlobToFile: function (fileName, blob, callback) {
////        var path = "Neeonn/photos/" + fileName;
////        var errorCallback = function (e) { app.fileFolder._errorHandler(e); callback(false); }
////
////        window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (entry) {
////            entry.getFile(path, { create: true, exclusive: false }, function (fileEntry) {
////                if (blob !== undefined && blob !== null) {
////                    fileEntry.createWriter(function (fileWriter) {
////                        fileWriter.onwriteend = function (e) {
////                            callback(true);
////                            return;
////                        }
////                        fileWriter.onerror = function (e) {
////                            alert("Error writing to file");
////                            console.log(e.toString());
////                            callback(false);
////                            return;
////                        }
////
////                        fileWriter.write(blob);
////                    });
////                } else {
////                    alert("Image blob is undefined or null");
////                    callback(false)
////                }
////            }, errorCallback);
////        }, errorCallback);
////    },
////
////
////
////
////    // Move a file
////    moveFile: function (destinationFoler, currentFilePath, callback) {
////        var errorCallback = function (e) { app.fileFolder._errorHandler(e); callback(false); }
////
////        window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (entry) {
////            entry.getFile(currentFilePath, {}, function (fileEntry) {
////                entry.getDirectory(destinationFoler, {}, function (directoryEntry) {
////                    fileEntry.moveTo(directoryEntry, null, callback(true), errorCallback);
////                }, errorCallback);
////            }, errorCallback);
////        }, errorCallback);
////    },
////
////
////
////    // Rename a file
////    renameFile: function (currentFolder, oldName, newName, callback) {
////        var errorCallback = function (e) { app.fileFolder._errorHandler(e); callback(false); }
////
////        window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (entry) {
////            entry.getDirectory(currentFolder, {}, function (directoryEntry) {
////                directoryEntry.getFile("/" + currentFolder + "/" + oldName, {}, function (fileEntry) {
////                    fileEntry.moveTo(directoryEntry, newName, callback(true), errorCallback);
////                }, errorCallback);
////            }, errorCallback);
////        }, errorCallback);
////    },
////
////
////
////    // Read a file
////    readFile: function (filePath, callback) {
////        var errorCallback = function (e) { app.fileFolder._errorHandler(e); callback(false); }
////
////        window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (entry) {
////            entry.getFile(filePath, {}, function (fileEntry) {
////                fileEntry.file(function (file) {
////                    var reader = new FileReader();
////
////                    reader.onloadend = function (e) {
////                        callback(true, this.result);
////                    }
////
////                    reader.readAsText(file);
////                }, errorCallback);
////            }, errorCallback);
////        }, errorCallback);
////    },
////
////
////    // Get all files in folder
////    getAllFilepathsInFolder: function (folderPath, callback) {
////        var errorCallback = function (e) { app.fileFolder._errorHandler(e); callback(false); }
////
////        window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (entry) {
////            entry.getDirectory(folderPath, {}, function (directoryEntry) {
////                var dirReader = directoryEntry.createReader();
////                var entries = [];
////
////                var readEntries = function () {
////                    dirReader.readEntries(function (results) {
////                        if (results === null || results.length === 0) {
////                            callback(true, entries);
////                            return;
////                        } else {
////                            for (var i = 0; i < results.length; i++) {
////                                entries.push(results[i].fullPath);
////                            }
////                            readEntries();
////                        }
////                    }, errorCallback);
////                }
////
////                readEntries();
////            }, errorCallback);
////        }, errorCallback);
////    },
////
////
////    // Read data from multiple files into an array
////    readDataFromMultipleFiles: function (folderPath, callback) {
////        app.fileFolder.getAllFilepathsInFolder(folderPath, function (success, results) {
////
////            if (results === null || results.length === 0) {
////                callback(true, []);
////                return;
////            }
////
////            var fileData = [];
////            var readData = function () {
////                app.fileFolder.readFile(results[0], function (success, data) {
////                    if (success === true) {
////                        fileData.push(JSON.parse(data))
////                        results.splice(0, 1);
////
////                        if (results.length === 0) {
////                            callback(true, fileData);
////                            return;
////                        } else {
////                            readData();
////                        }
////                    } else {
////                        callback (false);
////                        return;
////                    }
////                });
////            }
////
////            readData();
////        });
////    },
////
////
////
////    // Rename a folder
////    renameFolder: function (parentFolder, oldName, newName, callback) {
////        var errorCallback = function (e) { app.fileFolder._errorHandler(e); callback(false); }
////
////        window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (entry) {
////            entry.getDirectory(parentFolder, {}, function (directoryEntry) {
////                directoryEntry.getDirectory("/" + parentFolder + "/" + oldName, {}, function (directoryEntry2) {
////                    directoryEntry2.moveTo(directoryEntry, newName, callback(true), errorCallback);
////                }, errorCallback);
////            }, errorCallback);
////        }, errorCallback);
////    },
////
////
////
////    // Deletes a file
////    deleteFile: function (path, callback) {
////        var errorCallback = function (e) { app.fileFolder._errorHandler(e); callback(false); }
////
////        window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (entry) {
////            entry.getFile(path, { create: false }, function (fileEntry) {
////                fileEntry.remove(function () {
////                    callback(true);
////                }, errorCallback);
////            }, errorCallback);
////        }, errorCallback);
////    },
////
////
////
////    // Deletes a folder and all its contents
////    // NOT_FOUND_ERR if folder not found
////    deleteFolder: function (path, callback) {
////        var errorCallback = function (e) { app.fileFolder._errorHandler(e); callback(false); }
////
////        window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (entry) {
////            entry.getDirectory(path, {}, function (directoryEntry) {
////                directoryEntry.removeRecursively(function () {
////                    callback(true);
////                }, errorCallback);
////            }, errorCallback);
////        }, errorCallback);
////    },
////
////
////
////    // Filesystem error handler
////    _errorHandler: function(e) {
////        var msg = "";
////
////        switch (e.code) {
////            case FileError.QUOTA_EXCEEDED_ERR:
////                msg = "QUOTA_EXCEEDED_ERR";
////                break;
////            case FileError.NOT_FOUND_ERR:
////                msg = "File or Folder not found";
////                break;
////            case FileError.SECURITY_ERR:
////                msg = "SECURITY_ERR";
////                break;
////            case FileError.INVALID_MODIFICATION_ERR:
////                msg = "Required part of file/folder path doesn't exist";
////                break;
////            case FileError.INVALID_STATE_ERR:
////                msg = "INVALID_STATE_ERR";
////                break;
////            case FileError.PATH_EXISTS_ERR:
////                // this error will also occur if trying to create a folder in a folder that doesn't exist
////                msg = "An item with this name already exists.  Please choose a different name";
////                break;
////            default:
////                msg = "Unknown Error";
////                break;
////        };
////
////        alert("Error " + e.code + " : " + msg);
////    },
//
//}
//
//
//
//
//
