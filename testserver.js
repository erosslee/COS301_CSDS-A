//COS301 Authors CSDS-A
//Construction in process

//////////////////////UNIT TESTING
 var test = require('unit.js');



////////////////////////



var ldap = require('ldapjs');
var assert = require('assert');
var client = ldap.createClient({url: 'ldap://reaper.up.ac.za:'});
var base = 'ou=Computer Science,o=University of Pretoria,c=ZA';

//binds using a user's dn and provided password
function auth(dn, password, callback)
{
    client = ldap.createClient({url: 'ldap://reaper.up.ac.za:'});
    client.bind(dn, password, function (err){
        client.unbind();
        callback(err === null, err);
    });
}

//auth('uid=u89000100,ou=Students,ou=Computer Science,o=University of Pretoria,c=ZA', 'Misters', output);
//bind anonymously
function anonBind(cb)
{
    client.bind('','', function (err){
        //do something
        client.unbind();
        cb(err === null, err);
    });
}

function output(res, err) {
    if (res) {
        console.log('successful bind');
    } else {
        console.log('failure to bind ' + err.message);
    }
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

    console.log('searching for user: '+username);
    function callback(err,res){
        assert.ifError(err);

        res.on('searchEntry', (function (entry) {
            //JSON obj to string
            //console.log(JSON.parse(JSON.stringify(entry.object)));
            var user = JSON.parse(JSON.stringify(entry.object));
            if (typeof user.dn == "string") {
                setDnTest(user.dn);
                found = true;
            }
            if (found) {
                //console.log('User ' + username + ' found');
                //console.log('User object: ' + JSON.stringify(entry.object));
                auth(entry.object.dn, password, output);
                //findUserModules(username);
                //getActiveModulesForYear();
                //getUserRolesForModules(username);
                //getUsersWithRole('student','COS110');
            }
        }));
        res.on('error',function(err){
            console.error('error: '+ err.message);
        });
        res.on('end',function(result){
            console.error('status: '+ result.status);
        });

    }
    client.search(base, opts,callback);
}

//*************
function findUserModules(memberUid,callback) {
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
                //console.log('Active Module: ' + moduleCode);
                callback(moduleCode);
            });
            res.on('error', function (err) {
                console.error('error: ' + err.message);
            });
            res.on('end', function (result) {
                console.error('status: ' + result.status);
            });
        }
    });
}

//Users role for a module
function getUserRolesForModules(memberUid){
    var opts = {
        filter: 'memberUid='+memberUid,
        scope: 'sub'
    };
    client.search(base, opts, function (err, res)
    {
        assert.ifError(err);
        res.on('searchEntry', function (entry)
        {
            console.log('Module role: ' + JSON.parse(JSON.stringify(entry.object.cn)));
        });
        res.on('error',function(err){
            console.error('error: '+ err.message);
        });
        res.on('end',function(result){
            console.error('status: '+ result.status);
        });
    });
}

//Active modules for the year
function getActiveModulesForYear(){
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
            console.log(res);
        });
        res.on('error',function(err){
            console.error('error: '+ err.message);
        });
        res.on('end',function(result){
            console.error('status: '+ result.status);
        });
    });
}

//Users with particular role for particular module
function getUsersWithRole(role,moduleCode){
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
            console.log(role + ' for ' + moduleCode + ': ' + modulesObject);
        });
        res.on('error',function(err){
            console.error('error: '+ err.message);
        });
        res.on('end',function(result){
            console.error('status: '+ result.status);
        });
    });
}


//returns email address
function getUserEmail(username,callback) {
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
                if(email == null)
                    callback(username + '@tuks.co.za')
                else
                callback(email);
            });

            res.on('error', function (err) {
                console.error('error: ' + err.message);
            });
            //must have
            res.on('end', function (result) {
                console.error('status: ' + result.status);
            });
        }
    })
}





function setDnTest(string)
{
    dn = string;
    string = dn;
    console.log("Dn has been set to: "+string);
}

function login(username,password, res)
{
    //first verify that user exists, return dn if they exist
    findUser(username,password);
    /*if(){
        console.log('logged in!');
        console.log('DN after find: '+dn);
    }
    else{
        //console.log('log in failed!');
    }*/
}

function main()
{
    //login('u89000609','Hammond',function(res){getUsersWithRole('student','COS110')});
    login('u89000609','Hammond',findUserModules('u89000609',function(res){console.log(res)}));
    //login('u89000609','Hammond',function(res){getActiveModulesForYear()});
    //login('u89000609','Hammond',function(res){getUserRolesForModules('u89000609')});
    login('u89000609','Hammond',getUserEmail('u89000609',function(res){console.log(res)}));
}

main();