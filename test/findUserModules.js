//COS301 Authors CSDS-A
//Construction in process

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
//*************

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