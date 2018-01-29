var http = require("http");
var steem = require("steem")
var iconv = require('iconv');
var fs = require('fs');
//https://steemit.com/steem/@klye/an-introduction-to-steemd-api-calls-functions-and-usage
//https://github.com/steemit/steem-js/tree/master/doc#keys
//https://steemit.com/piston/@woung717/piston-api-tutorial-make-a-vote-and-post-using-python
//

var currentCheckedId = 0;
function main() {
	let path = "credentials.json";

	if (!fs.existsSync(path)) {		
		createFile(path);
		//We can add file, where we'll save last checkedId
	}else {
		runBot(path);
	}
}
function createFile(path) {
	var stream = fs.createWriteStream(path);
	stream.once('open', function(fd) {
	  stream.write("{\n");
	  stream.write("\"login\" : \"login\",\n");
	  stream.write("\"password\" : \"password\", \n");
	  stream.write("\"tagToObserve\" : \"polish\", \n");
	  stream.write("\"welcomeMessage\" : \"Welcome message!\"\n");
	  stream.write("}\n");
	  stream.end();
	});
	console.log("JSON file created");
	console.log("Run bot again with credentials added in file called credentials.json!");
}	
 
function runBot(path) {
		var contents = fs.readFileSync(path);
		var jsonContent = JSON.parse(contents);
		//console.log("Username:", jsonContent.login);
		//console.log("Password:", jsonContent.password);
		var myInt = setInterval(function () {
			getNewestPost(jsonContent.login, jsonContent.password, jsonContent.welcomeMessage, jsonContent.tagToObserve);
			console.log(" ============= ");
		}, 1000);
}
	
function getNewestPost(login, password, message, tagToObserve) {
	steem.api.getDiscussionsByCreated({"tag":tagToObserve,"limit":"10"}, function(err, result) {
		var authorName = result[0]['author'];
		var postId = result[0]['id'];
		var authorNames = [authorName];
		//console.log("Result is " + JSON.stringify(result[0]));
		//console.log("============================");
		console.log("Author name is " + authorName);
		console.log("Post id is " + postId);
		//console.log(result[0]);
		steem.api.getAccounts(authorNames, function(err, posts) {
		 // console.log(posts[0]);
		  var postCount = posts[0]['post_count'];
		  var commentCount = posts[0]['comment_count'];
		  console.log("Liczba postow to " + postCount);
		  //console.log("Liczba komentarzy to " + commentCount);
		  if(isAlreadyChecked(postId,currentCheckedId)) {
			  console.log(" ");
			  console.log("I already checked this author!");
			  return;
		  }
		
		  if(commentCount == 1) {
			currentCheckedId = postId;
			  var commentForTitle = "";//It's not article
			  var bodyOfComment = message;
			  var wif = steem.auth.toWif(login, password, 'posting');
			  steem.broadcast.comment(wif, authorName, parentPermlink, botName, permlink, title, bodyOfComment, jsonMetadata, function(err, result) {
				console.log(err, result);
			  });
		  }else {
			currentCheckedId = postId;
		  }
		});
		
	 });	
}
function isAlreadyChecked(first, second) {
	console.log("Compare " + first + " with " + second); 
	return first == second;
}
 
main();
