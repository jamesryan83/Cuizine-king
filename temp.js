
// https://docs.microsoft.com/en-us/rest/api/
// https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-create-service-principal-portal

var request = require("request");

var tenantId = "f12c5c9b-8a40-4fff-9aa0-f7719b468326"; // aka directoryId
var apiKey = "A8GclCKVyLGMOsBeCSL9pHah0qA9ZmUSQeg20WIUiq0=";
var apiAppId = "959e0b5b-079f-4dc6-8e52-cdecabef58d2";
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
  console.log('error:', error);
  console.log('statusCode:', response && response.statusCode);
  console.log('body:', body);
});

