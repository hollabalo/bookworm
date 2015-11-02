var usermodel = require('./model/user');
var bookmodel = require('./model/book');
var User = usermodel.model;
var Book = bookmodel.model;

var query = new User({
	fbId : '786868768687678',
	name : 'Test Name',
	username : 'admin',
	password : 'admin'
});

usermodel.add(query, function(err, doc) {
	if(err) {
		console.log(JSON.stringify(err));
	}
	console.log('Added admin');
});

query = new Book({
	title : 'The Adventures of Sherlock Holmes',
	author : 'Arthur Conan Doyle',
	picture : 'http://d.gr-assets.com/books/1164045516l/3590.jpg',
	description : "Complete in nine handsome volumes, each with an introduction by a Doyle scholar, a chronology, a selected bibliography, and explanatory notes, the Oxford Sherlock Holmes series offers a definitive collection of the famous detective's adventures. No home library is complete without it.\n\nComprising the series of short stories that made the fortunes of the Strand, the magazine in which they were first published, this volume won even more popularity for Sherlock Holmes and Dr. Watson. Holmes is at the height of his powers in many of his most famous cases, including The Red-Headed League, The Speckled Band, and The Blue Carbuncle.",
	downloadLink : 'https://www.gutenberg.org/ebooks/1661',
	views: 0
});

bookmodel.add(query, function(err, doc) {
	if(err) {
		console.log(JSON.stringify(err));
	}
	console.log('Added a book');
});