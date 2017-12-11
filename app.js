var express = require('express');
var session = require('express-session');
var sqlite = require("sqlite3").verbose();
var bodyParser = require('body-parser');

var dbFileName = "mydb.db";
var db = new sqlite.Database(dbFileName);

db.serialize(function(){
    //db.run("CREATE TABLE [IF NOT EXISTS] members(memberId INTEGER PRIMARY KEY, first_name TEXT NOT NULL, last_name TEXT NOT NULL, mobile_phone TEXT NOT NULL) [WITHOUT ROWID]");
    db.run("DROP TABLE IF EXISTS Members");
    db.run("CREATE TABLE IF NOT EXISTS Members (memberId INTEGER, first_name TEXT, last_name TEXT, mobile_phone TEXT)");
});

//db.run("INSERT INTO Members (memberId,first_name,last_name,mobile_phone) VALUES(?,?,?,?)",['1024','Juan','Chavez','71787735']);

// db.all("Select memberId, first_name, last_name, mobile_phone FROM Members", function(error, rows){
//     rows.forEach(function(row) {
//         console.log(row.memberId, row.first_name, row.last_name, row.mobile_phone);
//     });
// });
// db.close();


var GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;



var cookieData;
var githubAccessToken;



var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure Express
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
//app.use(partials());
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(methodOverride());
//app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
// app.use(passport.initialize());
// app.use(passport.session());
app.use(express.static(__dirname));


app.get('/admin/member', function(req, res){
    res.sendFile(__dirname+"/views/member.html");
});

app.get('/admin/members-list', function(req, res){
    res.sendFile(__dirname+"/views/members-list.html");

    db.all("Select memberId, first_name, last_name, mobile_phone FROM Members", function(error, rows){
        rows.forEach(function(row) {
            console.log(row.memberId, row.first_name, row.last_name, row.mobile_phone);
        });
    });
    db.close();

});

//db.run("INSERT INTO Members (memberId,first_name,last_name,mobile_phone) VALUES(?,?,?,?)",['1024','Juan','Chavez','71787735']);



app.listen(3000);