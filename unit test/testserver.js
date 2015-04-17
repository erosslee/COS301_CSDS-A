var ldap = require('ldapjs');
var assert = require('assert');
var test = require('unit.js');
var client = ldap.createClient({url: 'ldap://reaper.up.ac.za:'});
var base = 'ou=Computer Science,o=University of Pretoria,c=ZA';

//binds using a user's dn and provided password
function auth(dn, password, callback)
{
    client = ldap.createClient({url: 'ldap://reaper.up.ac.za:'});
    client.bind(dn, password, function (err){
        client.unbind();
	client = ldap.createClient({url: 'ldap://reaper.up.ac.za:'});
        callback(err === null, err);
    });
}

//bind anonymously
function anonBind(cb)
{
    client.bind('','', function (err){
        client.unbind();
        cb(err === null, err);
    });
}

function output(res, err)
{
	describe('Checking bind', function()
	{
		it('Bind Status', function()
		{
			if (res)
			{
				//test.value(res).match(true)
				test.must(res==true).be.true();
			}
			else
			{
				console.log('failure to bind ' + err.message);
			}
		});
	});
}

var found = false;

function authUser(username,password)
{
    client = ldap.createClient({url: 'ldap://reaper.up.ac.za:'});
}

var dn = '';
function findUser(username,password){
    var opts = {
        filter: 'uid='+username,
        scope: 'sub'
    };

    function callback(err,res){
        assert.ifError(err);

        res.on('searchEntry', (function (entry) {
            var user = JSON.parse(JSON.stringify(entry.object));
            if (typeof user.dn == "string") {
                setDnTest(user.dn);
                found = true;
            }
            if (found) {
                auth(entry.object.dn, password, output);
        }}));
        res.on('error',function(err){
            console.error('error: '+ err.message);
        });
        res.on('end',function(result){
            //console.error('status: '+ result.status);
        });

    }
    client.search(base, opts,callback);
}

//*************Find modules user is registered for*****************//
function findUserModules(memberUid,callback) {
	describe('Find User modules', function(){
		it('user modules', function(){
			var parseFilter = require('ldapjs').parseFilter;
			var f = parseFilter('(&(memberuid=' + memberUid + ')(cn=stud_' + '*))');

				  var opts = {
					filter: f,
					scope: 'sub'
				};
			
				client.search(base, opts, function (err, res) {
				{
				    assert.ifError(err);
				    res.on('searchEntry', function (entry) {
					var moduleCode = entry.object.cn.slice(-6);
					test
					    .string(moduleCode)
					    .startsWith('COS')
					    .match(/[a-z] + [0-9]/)
					    .if(example = 'bad value')
						.error(function(){
						  example.badMethod();
						});
				    });
				    res.on('error', function (err) {
					console.error('error: ' + err.message);
				    });
				    res.on('end', function (result) {
					console.error('status: ' + result.status);
				    });
				}
			});
		});
	});
}

//*************Users role for a module*****************//
function getUserRolesForModules(memberUid,callback){
	describe('Users roles for modules', function(){
		it('user roles for module', function(){
		    var opts = {
			filter: 'memberUid='+memberUid,
			scope: 'sub'
		    };
		    client.search(base, opts, function (err, res)
		    {
			assert.ifError(err);
			res.on('searchEntry', function (entry)
			{
				var role = JSON.parse(JSON.stringify(entry.object.cn));
				test
					    .string(role)
					    .contains('u')
					    .startsWith('u')
					    .match(/[a-z] + [0-9]/)
					    .if(example = 'bad value')
						.error(function(){
						  example.badMethod();
						})
			});
			res.on('error',function(err){
			    console.error('error: '+ err.message);
			});
			res.on('end',function(result){
			    console.error('status: '+ result.status);
			});
		    });
	    });
	});
}

//*************Active modules for the year*****************//
function getActiveModulesForYear(res){
	describe('Get active modules for the year', function(){
		it('active modules', function(){
			    var opts = {
				filter: ('cn=lect_' + '*'),
				scope: 'sub'
			    };
			    var modulesObject;
			    var modulesDn;
			    //console.log('Active modules for the year: ');
			    client.search(base,opts, function(err,res){
				assert.ifError(err);
				res.on('searchEntry', function (entry)
				{
				    modulesDn = JSON.stringify(entry.object.cn);
				    modulesObject = (JSON.parse(modulesDn));
				    var res = modulesObject.substring(5, 11);
					test
					    .string(res)
					    .startsWith('COS')
					    .match(/[a-z] + [0-9]/)
					    .if(example = 'bad value')
						.error(function(){
						  example.badMethod();
						});
				    //console.log(res);
				});
				res.on('error',function(err){
				    console.error('error: '+ err.message);
				});
				res.on('end',function(result){
				    console.error('status: '+ result.status);
				});
				});
		});
	});
}

//*************Find modules user is registered for*****************
function getUsersWithRole(role,moduleCode,callback){
	describe('Users with specific roles', function(){
		it('user roles', function(){
			    var Role;
			    switch(role){
				case 'lecturer':
				case 'Lecturer':
				    Role = 'lect_';
				    break;
				case 'student':
				case 'Student':
				    Role = 'stud_';
				    break;
				case 'teaching assistant':
				case 'Teaching Assistant':
				case 'TA':
				    Role = 'teachasst_';
				    break;
				case 'tutor':
				case 'Tutor':
				    Role = 'tuts_';
				    break;
			    }

			    var f = Role.concat(moduleCode);
			    var opts = {
				filter: ('cn=' + f),
				scope: 'sub'
			    };
			    var modulesObject;
			    var modulesDn;
			    client.search(base,opts, function(err,res){
				assert.ifError(err);
				res.on('searchEntry', function (entry)
				{
				    modulesDn = JSON.stringify(entry.object.memberUid);
				    modulesObject = (JSON.parse(modulesDn));
					test
					    .string(modulesObject)
					    .contains('u')
					    .startsWith('u')
					    .match(/[a-z] + [0-9]/)
					    .if(example = 'bad value')
						.error(function(){
						  example.badMethod();
						});
				});
				res.on('error',function(err){
				    console.error('error: '+ err.message);
				});
				res.on('end',function(result){
				    console.error('status: '+ result.status);
				});
				});
		});
	});
}


//*************Gets email addresses*****************
function getUserEmail(username,callback) {
	describe('Get user email', function(){
		it('user email', function(){
		    var parseFilter = require('ldapjs').parseFilter;
		    var email;
		    var opts = {
			filter: 'uid='+username,
			scope: 'sub'
		    };

		    client.search(base, opts, function (err, res) {
			{
			    assert.ifError(err);
			    res.on('searchEntry', function (entry) {
				email = entry.object.mail;
				    test
					    .string(email)
					    .contains('@')
					    .startsWith('u')
					    .match(/[a-z] + [0-9]/)
					    .if(example = 'bad value')
						.error(function(){
						  example.badMethod();
						})
				if(email == null)
				    //callback(username + '@tuks.co.za')
				else
				//callback(email);
			    });

			    res.on('error', function (err) {
				console.error('error: ' + err.message);
			    });
			    res.on('end', function (result) {
				console.error('status: ' + result.status);
			});
		    }});
	    });
	    });
    }

function setDnTest(string)
{
    dn = string;
    string = dn;
}

function login(username,password, res)
{
	//client = ldap.createClient({url: 'ldap://reaper.up.ac.za:'});
	findUser(username,password);
}

function main()
{
   login('u89000609','Hammond',findUserModules('u89000609',function(res){console.log(res)}));
   login('u89000609','Hammond',getActiveModulesForYear(function(res){console.log(res)}));
    login('u89000609','Hammond',getUserEmail('u89000609',function(res){console.log(res)}));
    login('u89000609','Hammond',getUserRolesForModules('u89000609',function(res){console.log(res)}));
     login('u89000609','Hammond',getUsersWithRole('student','COS110',function(res){console.log(res)}));
}

main();