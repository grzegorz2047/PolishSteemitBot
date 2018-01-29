var http = require("http");
var steem = require("steem")
var iconv = require('iconv');
var fs = require('fs');
//https://steemit.com/steem/@klye/an-introduction-to-steemd-api-calls-functions-and-usage
//https://github.com/steemit/steem-js/tree/master/doc#keys
//https://steemit.com/piston/@woung717/piston-api-tutorial-make-a-vote-and-post-using-python
//


function main() {
	let path = "credentials.json";

	if (!fs.existsSync(path)) {		
		createFile(path);
	}else {
		runBot(path);
	}
}
function createFile(path) {
	var stream = fs.createWriteStream(path);
	stream.once('open', function(fd) {
	  stream.write("{\n");
	  stream.write("\"login\" : \"login\",\n");
	  stream.write("\"password\" : \"password\"\n");
	  stream.write("}\n");
	  stream.end();
	});
	console.log("Stworzylem plik jsonowy");
	console.log("Uruchom ponownie program z wypelnionymi danymi logowania w pliku credentials.json!");
}
	
 
function runBot(path) {
		var contents = fs.readFileSync(path);
		var jsonContent = JSON.parse(contents);
		console.log("Username:", jsonContent.login);
		console.log("Password:", jsonContent.password);
		getNewestPost(jsonContent.login, jsonContent.password);
}
	
function getNewestPost(login, password) {
	steem.api.getDiscussionsByCreated({"tag":"polish","limit":"10"}, function(err, result) {
		var authorName = result[0]['author'];
		var authorNames = [authorName];
		//console.log("Result is " + JSON.stringify(result[0]));
		//console.log("============================");
		console.log("Author name is " + authorName);
		//console.log(result[0]);
		steem.api.getAccounts(authorNames, function(err, posts) {
		  console.log(posts[0]);
		  var postCount = posts[0]['post_count'];
		  var commentCount = posts[0]['comment_count'];
		  console.log("Liczba postow to " + postCount);
		  console.log("Liczba komentarzy to " + commentCount);
		  if(commentCount == 1) {
			  var commentForTitle = "";//It's not article
			  var bodyOfComment = "To jest testowy komentarz";
			  var wif = steem.auth.toWif(login, password, 'posting');
			  steem.broadcast.comment(wif, authorName, parentPermlink, botName, permlink, title, bodyOfComment, jsonMetadata, function(err, result) {
				console.log(err, result);
			  });
		  }
		});
		
	 });	
}
 
main();
