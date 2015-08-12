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

ISC

Copyright (c) 2014, 2015 Tim Kuijsten

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
