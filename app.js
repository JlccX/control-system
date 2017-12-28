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

    if(memberId){
        console.log("The member information will be updated.");
        let db = new sqlite.Database(dbFileName);
        //var query = "SELECT MemberId, Firstname, Lastname, Mobilephone WHERE MemberId = ?";
        var query = "SELECT Id, Firstname, Lastname, SSN, Phone, Cellphone, Email, Address, RegisterDate From Members WHERE Id = ?";
        db.get(query, [memberId], function(error, row){
            if(error){
                console.log("There is an error on the query -> "+JSON.stringify(error));
                return error.message;
            }
            else{
                var member = { 
                    Id: row.Id, 
                    Firstname: row.Firstname, 
                    Lastname: row.Lastname,
                    SSN: row.SSN,
                    Phone: row.Phone,
                    Cellphone: row.Cellphone,
                    Email: row.Email,
                    Address: row.Address,
                    RegisterDate: row.RegisterDate
                };
                console.log("The member xxx recovered is: "+JSON.stringify(row));
                if(row.Id && row.Id>0){
                    res.render("pages/member", { member: member, Title: "Member Edition" });
                }
                else
                {
                    res.render("pages/member", { member: member, Title: "Create a new Member" });
                }
                db.close();
            }
        });
    }
    else{
        console.log("A new member wil be created.");
        var member = { Id: 0, Firstname: '', Lastname: "", SSN: '', Phone: "", Cellphone: "", Email: "", Address: "", RegisterDate:"" };
        res.render("pages/member", { member: member, Title: "Create a new Member" });
    }
});

app.post('/admin/delete', function(req, res){
    
        console.log("Starting the delete event."+JSON.stringify(req.body));
    
        var memberId = req.body.id;

        //memberId = 1024;

        console.log("The member id received is: "+memberId);
        let db = new sqlite.Database(dbFileName);
        //var query = "SELECT MemberId, Firstname, Lastname, Mobilephone WHERE MemberId = ?";
        var query = "DELETE FROM Members WHERE Id = ?";
        db.get(query, [memberId], function(error, row){
            if(error){
                console.log("There is an error on the query -> "+JSON.stringify(error));
                return error.message;
            }
            else{
                console.log("The member to remove is: "+JSON.stringify(row));
                
                getMembersList(res);
            }
        });
        
    });

app.get('/admin/members-list', function(req, res){
    getMembersList(res);
});

function getMembersList(res){
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
}

app.post('/admin/member', function(req, res){
    console.log("Redirecting to the /admin/members-list page.");
    console.log("The body content is: "+JSON.stringify(req.body));
    console.log("The username is: "+req.body.firstname);
    console.log("The lastname is: "+req.body.lastname);
    console.log("The memberId is: "+req.body.memberId);

    var id = req.body.id;

    if(id<=0){
        id = null;
    }

    var data = [req.body.firstname, req.body.lastname, req.body.ssn, req.body.phone, req.body.cellphone, req.body.email, req.body.address.trim(), req.body.registerDate, id];
    let db = new sqlite.Database(dbFileName);
    //var data = [req.body.memberId];

    if(req.body.id>0){
        var query = "UPDATE Members SET Firstname = ?, Lastname = ?, SSN = ?, Phone = ?, Cellphone = ?, Email = ?, Address = ?, RegisterDate = ?  WHERE Id = ?";
        
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
    }
    else{
        db.run("INSERT INTO Members (Firstname,Lastname,SSN,Phone,Cellphone,Email,Address,RegisterDate,Id) VALUES(?,?,?,?,?,?,?,?,?)", data);
        res.redirect("/admin/members-list?id=newMember");
    }
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

    db.all("Select Id, Firstname, Lastname, SSN, Phone, Cellphone, Email, Address, RegisterDate FROM Members ORDER BY Firstname, Lastname ", function(error, rows){
        rows.forEach(function(row){
            //console.log(row.memberId, row.first_name, row.last_name, row.mobile_phone);
            var member = {"Id": row.Id, "SSN":row.SSN, "Firstname":row.Firstname, "Lastname":row.Lastname, "Cellphone": row.Cellphone};
            console.log("getAllMembers -> " + JSON.stringify(member));
            list.push(member);
        });
        console.log("The returned list size is: "+list.length);
        callback(list);
        db.close();
    });
}

app.listen(3001);