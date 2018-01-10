"use strict";

var parameters = require("./parameters.js");

var dbFileName = parameters.dbFileName;
var sqlite = require("sqlite3").verbose();

// The parenthesis allow to use this method as a singleton instance.
//module.exports = user();

var user = function(){

    var counts;

    var authenticate = function (data){
        
        //console.log("The user id received is: "+memberId);
        //console.log("The JSON data received is: "+JSON.stringify(data));

        var username = data.username;
        var password = data.password;
    
        if(username && password){
            console.log("The member information will be recovered from the database based on the credential.");
            let db = new sqlite.Database(dbFileName);
            "Users(Id, Firstname, Lastname, Username, Password, Cellphone, Email"
            var query = "SELECT Id, Firstname, Lastname, Username, Password, Cellphone, Email From Users WHERE Username = ? AND Password = ?";
            db.get(query, [username, password], function(error, row){
                if(error){
                    console.log("There is an error on the query -> "+JSON.stringify(error));
                    callback(null, error);
                }
                else{
    
                    var user = { 
                        Id: row.Id, 
                        Firstname: row.Firstname, 
                        Lastname: row.Lastname,
                        Username: row.Username,
                        Password: row.Password,
                        Cellphone: row.Cellphone,
                        Email: row.Email
                    };

                    console.log("The user information recovered is: "+JSON.stringify(row));
                    //callback(member, null);
                    db.close();
                }
            });
        }
        else{
            console.log("An empty member will be returned.");
            member = { Id: 0, Firstname: '', Lastname: "", Username: '', Password: "", Cellphone: "", Email: ""};
            //callback(member, null);
        }
    }
    
    var update_user = function(data, callback){
        var member;
        var memberId = data.Id;
        
        console.log("The member id received is: "+memberId);
        console.log("The JSON data received is: "+JSON.stringify(data));
    
        if(memberId){
            console.log("The member information will be recovered from the database.");
            let db = new sqlite.Database(dbFileName);
            var query = "SELECT Id, Firstname, Lastname, Username, Password, Cellphone, Email From Users WHERE Id = ?";
            db.get(query, [memberId], function(error, row){
                if(error){
                    console.log("There is an error on the query -> "+JSON.stringify(error));
                    callback(null, error);
                }
                else{
                    var address = '';
                    if(row.Address)
                    {
                        row.Address = row.Address.trim();
                    }
    
                    member = {
                        Id: row.Id,
                        Firstname: row.Firstname,
                        Lastname: row.Lastname,
                        Username: row.Username,
                        Password: row.Password,
                        Cellphone: row.Cellphone,
                        Email: row.Email
                    };
                    console.log("The user information recovered is: "+JSON.stringify(row));
                    callback(member, null);
                    db.close();
                }
            });
        }
        else{
            console.log("An empty member will be returned.");
            member = { Id: 0, Firstname: '', Lastname: "", Username: '', Password: "", Cellphone: "", Email: "" };
            callback(member, null);
        }
    }

    var get_users = function (data){

        var db = new sqlite.Database(dbFileName);
        var list = [];
    
        db.all("Select Id, Firstname, Lastname, Username, Password, Cellphone, Email FROM Users ORDER BY Firstname, Lastname ", function(error, rows){
            rows.forEach(function(row){
                //console.log(row.memberId, row.first_name, row.last_name, row.mobile_phone);
                var user = {"Id": row.Id, "Firstname":row.Firstname, "Lastname":row.Lastname, "Username": row.Username};
                console.log("getAllUsers -> " + JSON.stringify(user));
                list.push(user);
            });
            console.log("The returned list size is: "+list.length);
            //callback(list, null);
            db.close();
        });
    }
    
    var delete_user = function (data, callback){
    
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
            callback(list, null);
            db.close();
        });
    }

    return {
        authenticate: authenticate,
        updateUser: update_user,
        getUsers: get_users,
        deleteUser: delete_user
    };

// If you add a parenthesis after the last } you could convert it to a singleton instance
// This is the same as using: module.exports = user();
}();

