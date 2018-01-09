var chai = require("chai");

var members = require("../node-functions/member.js");
var params = require("../node-functions/parameters.js");

var mydb = params.mydb;
var timeout = params.timeout;
var memberId;

////////////////    Members   ////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
describe("Member Tests", function(){
    it("Test - Member creation.", function(done){

        this.timeout(timeout);
        var data = { Id: 0, Firstname: 'Joseph', Lastname: "Golden", SSN: 'A84748382920', Phone: "4332944994", Cellphone: "78737568", Email: "", Address: "", RegisterDate: (new Date()).toLocaleDateString("en-US") };
        
        members.handler("post", data, function(response, error){
    
            chai.expect(error).to.be.null;
            chai.expect(response).is.not.null;
            chai.expect(response.Id).greaterThan(0);
            memberId = response.Id;

        });
        done();
    });
    it("Test - Members one row list.", function(done){

        this.timeout(timeout);
        
        members.handler("list", null, function(response, error){
    
            chai.expect(error).to.be.null;
            chai.expect(response).is.not.null;
            chai.expect(response.length).equal.to(1);

        });
        done();
    });
    it("Test - Get Member.", function(done){

        this.timeout(timeout);
        var data = { Id: memberId};
        console.log("The Id to get is: "+memberId);
        
        members.handler("get", data, function(response, error){
    
            chai.expect(error).to.be.null;
            chai.expect(response).is.not.null;
            //chai.expect(response.Id).greaterThan(0);
            //chai.expect(memberId).equal.to(response.Id);

        });
        done();
    });
    it("Test - Delete Member.", function(done){

        this.timeout(timeout);
        var data = { Id: memberId };
        
        members.handler("delete", data, function(response, error){
    
            chai.expect(error).to.be.null;
            chai.expect(response).is.not.null;
            chai.expect(response.Id).greaterThan(0);
            chai.expect(id).equals.to(response.Id);

        });
        done();
    });
    it("Test - Members empty list.", function(done){

        this.timeout(timeout);
        
        members.handler("list", null, function(response, error){
    
            chai.expect(error).to.be.null;
            chai.expect(response).is.not.null;
            chai.expect(response.length).equal.to(0);

        });
        done();
    });
});