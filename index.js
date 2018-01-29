var http = require("http");
var steem = require("steem")
var iconv = require('iconv');
var fs = require('fs');
//https://steemit.com/steem/@klye/an-introduction-to-steemd-api-calls-functions-and-usage
//https://github.com/steemit/steem-js/tree/master/doc#keys
 
steem.api.getDiscussionsByCreated({"tag":"polish","limit":"10"}, function(err, result) {
	var authorName = result[0]['author'];
	var authorNames = [authorName];
	//console.log("Result is " + JSON.stringify(result[0]));
	//console.log("============================");
	console.log("Author name is " + authorName);
	//console.log(result[0]);
	steem.api.getAccounts(authorNames, function(err, posts) {
	  console.log(posts[0]);
	  console.log("Liczba postow to " + posts[0]['post_count']);
	});
	
 });
