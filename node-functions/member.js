"use strict";

var parameters = require("./parameters.js");

var dbFileName = parameters.dbFileName;
var sqlite = require("sqlite3").verbose();

exports.handler = function(method, data, callback){
    switch(method){
        case "get":
            console.log("case member get"); 
            _get_member(data, callback);
        break;
        case "list":
            console.log("case members list");
            _get_members_list(data, callback);
        break;
        case "delete":
            console.log("case member delete");
            _delete_member(data, callback);
        break;
        case "post":
            console.log("case member post");
            _update_member(data, callback);
        break;
        default:
            throw new Error("Invalid resource");
        break;
    }
}

function _get_member(data, callback){
    var member;
    var memberId = data.Id;
    
    console.log("The member id received is: "+memberId);
    console.log("The JSON data received is: "+JSON.stringify(data));

    if(memberId){
        console.log("The member information will be recovered from the database.");
        let db = new sqlite.Database(dbFileName);
        var query = "SELECT Id, Firstname, Lastname, SSN, Phone, Cellphone, Email, Address, RegisterDate From Members WHERE Id = ?";
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
                    SSN: row.SSN,
                    Phone: row.Phone,
                    Cellphone: row.Cellphone,
                    Email: row.Email,
                    Address: row.Address,
                    RegisterDate: row.RegisterDate
                };
                console.log("The member information recovered is: "+JSON.stringify(row));
                callback(member, null);
                db.close();
            }
        });
    }
    else{
        console.log("An empty member will be returned.");
        member = { Id: 0, Firstname: '', Lastname: "", SSN: '', Phone: "", Cellphone: "", Email: "", Address: "", RegisterDate: "" };
        callback(member, null);
    }
}


function _get_members_list(data, callback){

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

function _delete_member(data, callback){
    console.log("Executing _delete_member function. "+JSON.stringify(data));
    
        var memberId = data.Id;

        //memberId = 1024;

        console.log("The member id received is: "+memberId);
        let db = new sqlite.Database(dbFileName);
        //var query = "SELECT MemberId, Firstname, Lastname, Mobilephone WHERE MemberId = ?";
        var query = "DELETE FROM Members WHERE Id = ?";
        db.get(query, [memberId], function(error, row){
            if(error){
                console.log("There is an error on the query -> "+JSON.stringify(error));
                callback(null, error);
            }
            else{
                console.log("The member to remove is: "+JSON.stringify(row));
                
                callback(memberId, null);
            }
        });
}

function _update_member(data, callback){
    var id = data.Id;

    if(id<=0 || !id){
        id = null;
    }

    var address = "";
    if(data.address){
        address = data.address;
    }

    var data = [data.firstname, data.lastname, data.ssn, data.phone, data.cellphone, data.email, address, data.registerDate, id];
    let db = new sqlite.Database(dbFileName);

    if(id>0){
        var query = "UPDATE Members SET Firstname = ?, Lastname = ?, SSN = ?, Phone = ?, Cellphone = ?, Email = ?, Address = ?, RegisterDate = ?  WHERE Id = ?";
        
        db.run(query, data, function(error, row){
            if(error){
                console.log("There is an error on the query -> "+JSON.stringify(error));
                callback(null, error);
            }
            else{
                callback(id, null);
            }
        });
    }
    else{
        db.run("INSERT INTO Members (Firstname,Lastname,SSN,Phone,Cellphone,Email,Address,RegisterDate,Id) VALUES(?,?,?,?,?,?,?,?,?)", data, function(err){
            data.Id = this.lastID;
            console.log("The Id created for the new object is: "+data.Id);
            callback(data, null);
        });
    }
}