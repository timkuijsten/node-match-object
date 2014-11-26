# match-object

Check if all given criteria hold on the given object.

## Example

Match every object that contains `foo: bar`:

    var assert = require('assert');
    var match = require('match');

    var crit = { foo: 'bar' };

    var obj1 = { foo: 'bar', baz: 'qux' };
    assert.equal(match(crit, obj1), true);

    var obj2 = { foo: 'baz', baz: 'qux' };
    assert.equal(match(crit, obj2), false);

Match every object that contains `foo: bar` or `foo: baz` using the special keyword
`$in`:

    var crit = { foo: { $in: [ 'bar', 'baz' ] } };

    var obj1 = { foo: 'bar' };
    assert.equal(match(crit, obj1), true);

    var obj2 = { foo: 'qux' };
    assert.equal(match(crit, obj2), false);

## Installation

    $ npm install match-object

## API

### match(criteria, obj)
* criteria {Object}  search conditions
* obj {Object}  object to compare with
* @return {Boolean}  true if all criteria hold, false otherise

Check if all given criteria hold on the given object.

Treats the $in keyword special, value of $in must be an array.

## Tests

    $ npm test

## License

MIT

Copyright (c) 2014 Tim Kuijsten

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
