"use strict";

var express = require('express');
var session = require('express-session');
var sqlite = require("sqlite3").verbose();
var bodyParser = require('body-parser');

var member = require("./node-functions/member.js");

var dbFileName = "mydb.db";

var db = new sqlite.Database(dbFileName);

db.serialize(function(){

    console.log( "Starting DB Serialize function ... " );

    //db.run("CREATE TABLE [IF NOT EXISTS] members(memberId INTEGER PRIMARY KEY, first_name TEXT NOT NULL, last_name TEXT NOT NULL, mobile_phone TEXT NOT NULL) [WITHOUT ROWID]");
    //db.run("DROP TABLE IF EXISTS Members");
    db.run("CREATE TABLE IF NOT EXISTS Members (Id INTEGER PRIMARY KEY, Firstname TEXT, Lastname TEXT, SSN TEXT, Phone TEXT, Cellphone TEXT, Email TEXT, Address TEXT, RegisterDate TEXT)");
    //db.close();
});
db.close();

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure Express
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
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

    console.log("Starting the member page.");

    var memberId = req.query.id;

    console.log("The member id received is: "+memberId);

    member.handler("get", req.query, function(response, error){

        if(error){
            console.log("Member get error -> "+JSON.stringify(error));
        }

        if(response.Id && response.Id>0){
            res.render("pages/member", { member: response, Title: "Member Edition" });
        }
        else
        {
            res.render("pages/member", { member: response, Title: "Create a new Member" });
        }
    });
});

app.post('/admin/delete', function(req, res){
    
        console.log("Starting the delete event."+JSON.stringify(req.body));
    
        var memberId = req.body.id;

        member.handler("delete", req.body, function(id, err){

            if(error){
                console.log("Member delete error -> "+JSON.stringify(err));
            }

            member.handler("list",null, function(response, error){

                if(error){
                    console.log("Member delete-list error -> "+JSON.stringify(error));
                }

                res.render("pages/members-list",{ Members: response, Title: title });
            });
        });
    });

app.get('/admin/members-list', function(req, res){
    member.handler("list", null, function(response, error){
        
        if(error){
            console.log("Members-list error -> "+JSON.stringify(error));
        }

        res.render("pages/members-list",{ Members: response, Title: "Members list page" });
    });
});


app.post('/admin/member', function(req, res){
    console.log("Redirecting to the /admin/members-list page.");
    console.log("The body content is: "+JSON.stringify(req.body));
    console.log("The username is: "+req.body.firstname);
    console.log("The lastname is: "+req.body.lastname);
    console.log("The memberId is: "+req.body.memberId);

    member.handler("list", req.body, function(response, error){
        if(error){
            console.log("Member post error -> "+JSON.stringify(error));
        }
        res.render("pages/members-list",{ Members: response, Title: "Members list page" });
    });
});

app.listen(3001);