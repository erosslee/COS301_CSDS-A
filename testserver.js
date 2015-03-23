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

var dn = 'this should be something else';
function findUser(username,password)
{
    client = ldap.createClient({url: 'ldap://reaper.up.ac.za:'});
    //console.log('1Value of found: '+found);
    //console.log('in findUser()');
    //var userObject;
    //var found = false;
    var opts = {
        filter: 'uid='+username,
        scope: 'sub'
    };
    console.log('searching for user: '+username);
    client.search(base, opts, function (err, res)
    {
        assert.ifError(err);

        res.on('searchEntry', function (entry)
        {
            //userObject = JSON.parse(JSON.stringify(entry.object));
            //userObject = (JSON.stringify(entry.object)).toString();
            console.log(JSON.parse(JSON.stringify(entry.object)));
            //console.log('type of userObject: ' + typeof userObject);
            //userObject = entry.object.dn;
            //console.log('userObject: '+userObject);
            var user = JSON.parse(JSON.stringify(entry.object));
            if(typeof entry.object.dn == "string")
            {
                //window.dn =entry.object.dn;
                setDnTest(entry.object.dn);
                found = true;
            }
            if(found)
            {
                console.log('User '+username+' found');
                console.log('User object: '+(JSON.parse(JSON.stringify(entry.object))));
                //bind as user
                auth(entry.object.dn,password,output);
                //console.log(tmp);
                findUserModules(username);
            }
            //return userObject;
            //dn.push(entry.object.dn);
        });
        /*res.on('searchReference', function (referral)
        {
            console.log('referral: ' + referral.uris.join());
        });
        res.on('error', function (err)
        {
            console.error('error: ' + err.message);
        });
        res.on('end', function (result)
        {
            console.log('status: ' + result.status);
        });
        console.log('type of test: '+typeof test);
        test = JSON.stringify(test);
        console.log('test: '+test);
        console.log(res);*/
    });
    //console.log(typeof dn);
    //console.log(dn);
    //console.log('leaving findUser()');
    return true;
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

function setDnTest(string)
{
    console.log("This should be in the above line: "+string);
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