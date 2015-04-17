//loading unit.js module
var test = require('unit.js');
//example test value
var example = 'hello';

//-------------3 ways to test for string-----------------//
//1) check that assert value is a string
test.string(example);

//2) Must example
test.must(example).be.a.string();

//3)//with assert
test.assert(typeof example === 'string');

//Run test with Mocha
