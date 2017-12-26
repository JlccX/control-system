"use strict";

var express = require('express');
var session = require('express-session');
var sqlite = require("sqlite3").verbose();
var bodyParser = require('body-parser');

var dbFileName = "mydb.db";

var db = new sqlite.Database(dbFileName);

db.serialize(function(){

    console.log( "Starting DB Serialize function ... " );

    //db.run("CREATE TABLE [IF NOT EXISTS] members(memberId INTEGER PRIMARY KEY, first_name TEXT NOT NULL, last_name TEXT NOT NULL, mobile_phone TEXT NOT NULL) [WITHOUT ROWID]");
    //db.run("DROP TABLE IF EXISTS Members");
    db.run("CREATE TABLE IF NOT EXISTS Members (Id INTEGER, Firstname TEXT, Lastname TEXT, SSN TEXT, Phone TEXT, Cellphone TEXT, Email TEXT, Address TEXT, RegisterDate TEXT)");

    var count = 0;
    
    var query = "SELECT Count(*) AS Count From Members";
    
    db.get(query, function(error, row){
        if(error){
            console.log("There is an error on the query -> "+JSON.stringify(error));
            return error.message;
        }
        else{
            count = row.Count;
            console.log("The query response is: "+JSON.stringify(row));
            console.log("The count recovered is: "+count);

            if(count===0){

                console.log("There are no data, new rows will be added.");

                db.run("INSERT INTO Members (MemberId,Firstname,Lastname,Mobilephone) VALUES(?,?,?,?)",['1024','Juan','Chavez','71787735']);
                db.run("INSERT INTO Members (MemberId,Firstname,Lastname,Mobilephone) VALUES(?,?,?,?)",['2048','Susana','Mendez','71787736']);
                db.run("INSERT INTO Members (MemberId,Firstname,Lastname,Mobilephone) VALUES(?,?,?,?)",['4096','Paola','Arancibia','71787737']);
                db.run("INSERT INTO Members (MemberId,Firstname,Lastname,Mobilephone) VALUES(?,?,?,?)",['8192','Zara','Perez','71787738']);
                db.run("INSERT INTO Members (MemberId,Firstname,Lastname,Mobilephone) VALUES(?,?,?,?)",['16486','Ximena','Arellano','71787739']);

               
            }
        }
    });
});

//db.close();

var GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;

var cookieData;
var githubAccessToken;

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

    if(memberId){
        console.log("The member information will be updated.");
        let db = new sqlite.Database(dbFileName);
        //var query = "SELECT MemberId, Firstname, Lastname, Mobilephone WHERE MemberId = ?";
        var query = "SELECT MemberId, Firstname, Lastname From Members WHERE MemberId = ?";
        db.get(query, [memberId], function(error, row){
            if(error){
                console.log("There is an error on the query -> "+JSON.stringify(error));
                return error.message;
            }
            else{
                var member = { MemberId: row.MemberId, Firstname: row.Firstname, Lastname: row.Lastname };
                console.log("The member xxx recovered is: "+JSON.stringify(row));
                if(row.MemberId && row.MemberId>0){
                    res.render("pages/member", { member: member, Title: "Member Edition" });
                }
                else
                {
                    res.render("pages/member", { member: member, Title: "Create a new Member" });
                }
            }
        });
    }
    else{
        console.log("A new member wil be created.");
        var member = { MemberId: "", Firstname: "", Lastname: "" };
        res.render("pages/member", { member: member, Title: "Create a new Member" });
    }
});

app.post('/admin/delete', function(req, res){
    
        console.log("Starting the delete event."+JSON.stringify(req.body));
    
        var memberId = req.body.data;

        //memberId = 1024;

        console.log("The member id received is: "+memberId);
        let db = new sqlite.Database(dbFileName);
        //var query = "SELECT MemberId, Firstname, Lastname, Mobilephone WHERE MemberId = ?";
        var query = "DELETE FROM Members WHERE MemberId = ?";
        db.get(query, [memberId], function(error, row){
            if(error){
                console.log("There is an error on the query -> "+JSON.stringify(error));
                return error.message;
            }
            else{
                var member = { MemberId: row.MemberId, Firstname: row.Firstname, Lastname: row.Lastname };
                console.log("The member xxx recovered is: "+JSON.stringify(row));
                if(row.MemberId && row.MemberId>0){
                    res.render("pages/member", { member: member, Title: "Member Edition" });
                }
                else
                {
                    res.render("pages/member", { member: member, Title: "New Member" });
                }
            }
        });
        
    });

app.get('/admin/members-list', function(req, res){
    console.log("Starting the members-list page.");
    // res.render(__dirname+"/views/members-list.html");

    var members = [];

    var db = new sqlite.Database(dbFileName);

    var info = getAllMembers(function(data){
        members = data;
        console.log("myCallback The members size is: "+data.length);
    
        var title = "Organization members list";
        console.log("The membersX size is: "+members.length);
        res.render("pages/members-list",{ Members: data, Title: title });
        db.close();
    });
});

app.post('/admin/member', function(req, res){
    console.log("Redirecting to the /admin/members-list page.");
    console.log("The body content is: "+JSON.stringify(req.body));
    console.log("The username is: "+req.body.firstname);
    console.log("The lastname is: "+req.body.lastname);
    console.log("The memberId is: "+req.body.memberId);

    var data = [req.body.firstname, req.body.lastname, req.body.memberId];
    //var data = [req.body.memberId];

    var query = "UPDATE Members SET Firstname = ?, Lastname = ?  WHERE MemberId = ?";
    
    db.run(query, data, function(error, row){
        if(error){
            console.log("There is an error on the query -> "+JSON.stringify(error));
            return error.message;
        }
        else{
            
            console.log("The memberId updated is: "+req.body.memberId);
            res.redirect("/admin/members-list?id=xyz1");
        }
    });
    
});

// var myTestCallbackFunction = function(data){
//     console.log("myTestCallbackFunction The members size is: "+data.length);
//     console.log("myTestCallbackFunction The members size is: "+data.size);
//     console.log("myTestCallbackFunction The members size is: "+data.count);
//     console.log("The array information is: "+JSON.stringify(data) );
//     return data;
// };


//db.run("INSERT INTO Members (memberId,first_name,last_name,mobile_phone) VALUES(?,?,?,?)",['1024','Juan','Chavez','71787735']);

function getAllMembers(callback){

    var db = new sqlite.Database(dbFileName);
    var list = [];

    db.all("Select MemberId, Firstname, Lastname, Mobilephone FROM Members ORDER BY MemberId", function(error, rows){
        rows.forEach(function(row) {
            //console.log(row.memberId, row.first_name, row.last_name, row.mobile_phone);
            var member = {"MemberId": row.MemberId, "Firstname":row.Firstname, "Lastname":row.Lastname, "Mobilephone":row.Mobilephone};
            console.log("getAllMembers -> " + JSON.stringify(member) );
            list.push(member);
        });
        console.log("The returned list size is: "+list.length);
        callback(list);
        db.close();
    });
}

app.listen(3001);