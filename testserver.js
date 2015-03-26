var ldap = require('ldapjs');
var assert = require('assert');
var client;
var base = 'ou=Computer Science,o=University of Pretoria,c=ZA';

//binds using a user's dn and provided password
function auth(dn, password, callback)
{
    client = ldap.createClient({url: 'ldap://reaper.up.ac.za:'});
    client.bind(dn, password, function (err)
    {
        client.unbind();
        callback(err === null, err);
    });
}

//auth('uid=u89000100,ou=Students,ou=Computer Science,o=University of Pretoria,c=ZA', 'Misters', output);

//bind anonymously
function anonBind(cb)
{
    client.bind('','', function (err)
    {
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

//anonBind('',outputTest);
//var userObject;
var found = false;

function authUser(username,password)
{
    client = ldap.createClient({url: 'ldap://reaper.up.ac.za:'});

}

var dn = '';
function findUser(username,password){
    client = ldap.createClient({url: 'ldap://reaper.up.ac.za:'});
    var opts = {
        filter: 'uid='+username,
        scope: 'sub'
    };

    console.log('searching for user: '+username);
    function callback(err,res){
        assert.ifError(err);

        res.on('searchEntry', (function (entry) {
            console.log(JSON.parse(JSON.stringify(entry.object)));
            var user = JSON.parse(JSON.stringify(entry.object));
            if (typeof user.dn == "string") {
                setDnTest(user.dn);
                found = true;
            }
            if (found) {
                console.log('User ' + username + ' found');
                console.log('User object: ' + JSON.stringify(entry.object));
                auth(entry.object.dn, password, output);
                findUserModules(username);
                getActiveModulesForYear();
            }
        }));
        res.on('error',function(err){
            console.error('error: '+ err.message);
        });
        return found;
    }
    client.search(base, opts,callback);
}

function findUserModules(memberUid)
{
    client = ldap.createClient({url: 'ldap://reaper.up.ac.za:'});
    var opts = {
        filter: 'memberuid='+memberUid,
        scope: 'sub'
    };
    client.search(base, opts, function (err, res)
    {
        assert.ifError(err);

        res.on('searchEntry', function (entry)
        {
            console.log('entry: '+JSON.parse(JSON.stringify(entry.object)).toString());
        });
    });
}

//Active modules for the year
function getActiveModulesForYear(){
    client = ldap.createClient({url: 'ldap://reaper.up.ac.za:'});
    var opts = {
        filter: ('cn=lect_' + '*'),
        scope: 'sub'
    };
    var modulesObject;
    var modulesDn;

    client.search(base,opts, function(err,res){
        assert.ifError(err);
        res.on('searchEntry', function (entry)
        {
            modulesDn = JSON.stringify(entry.object.cn);
            modulesObject = (JSON.parse(modulesDn));
           console.log(modulesObject);
        });

    });
}

function setDnTest(string)
{
    console.log("Dn has been set to: "+string);
    dn = string;
}
function login(username,password)
{
    //first verify that user exists, return dn if they exist

    if(findUser(username,password))
    {
        console.log('DN after find: '+dn);
    }
    //authUser(username,password);
    //console.log('tmp: '+tmp);
    //console.log('dn: '+JSON.parse(JSON.stringify(object)));
    //console.log('dn for user '+username+': '+object);
    //console.log(dn);
}

function main()
{
    login('u89000100','Misters');

}
main();
//process.exit();
