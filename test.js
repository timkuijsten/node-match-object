/**
 * Copyright (c) 2014, 2015 Tim Kuijsten
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

'use strict';

var assert = require('assert');

var nestNamespace = require('nest-namespace');
var match = require('./index');

// require criteria to be an object
assert.throws(function() { match(); }, /criteria must be an object/);

// return true if created with empty filter object and called with empty item
var result = match(nestNamespace({}), {});
assert.strictEqual(result, true);

// work with empty search
var result = match(nestNamespace({}), { foo: 'bar' });
assert.strictEqual(result, true);

// work with 1d namespace
var result = match(nestNamespace({ foo: 'bar' }), { foo: 'bar' });
assert.strictEqual(result, true);

// work with 1d namespace not exists
var result = match(nestNamespace({ foo: 'baz' }), { foo: 'bar' });
assert.strictEqual(result, false);

// work with 2d namespace
var result = match(nestNamespace({ 'foo.baz': 'bar' }), { foo: { baz: 'bar' }});
assert.strictEqual(result, true);

// work with 2d namespace not exists
var result = match(nestNamespace({ 'foo.baz': 'baz' }), { foo: { baz: 'bar' }});
assert.strictEqual(result, false);

// work with 3d namespace
var result = match(nestNamespace({ 'foo.baz.qux': 'bar' }), { foo: { baz: { qux:'bar' }}});
assert.strictEqual(result, true);

// work with 3d namespace not exists
var result = match(nestNamespace({ 'foo.baz.quux': 'bar' }), { foo: { baz: { qux:'bar' }}});
assert.strictEqual(result, false);

// work with 1d, 2d and 3d namespace
var result = match(nestNamespace({
  'foo.foo': 'bar',
  'baz.baz.quux': 'baz',
  'bar.qux': 'bar'
}), {
  foo: { foo: 'bar' },
  baz: { baz: { quux: 'baz' }},
  bar: { qux: 'bar' }
});

assert.strictEqual(result, true);

// work with 1d, 2d and 3d namespace not exists
var result = match(nestNamespace({
  'foo': 'bar',
  'baz.baz.quux': 'baz',
  'bar.qux': 'bar'
}), {
  foo: { foo: 'bar' },
  baz: { baz: { quux: 'baz' }},
  bar: { qux: 'bar' }
});

assert.strictEqual(result, false);

// work with complex non-string values
var result = match(nestNamespace({
  'foo': { foo: 'bar' },
  'baz.baz.quux': 'baz',
  'bar.qux': 'bar'
}), {
  foo: { foo: 'bar' },
  baz: { baz: { quux: 'baz' }},
  bar: { qux: 'bar' }
});

assert.strictEqual(result, true);

// work with dates and match
var filter = { _id: new Date('2014-11-26 10:00:00') };
var obj    = { _id: new Date('2014-11-26 10:00:00'), foo: 'bar' };

var result = match(filter, obj);
assert.strictEqual(result, true);

// work with dates and not match
var filter = { _id: new Date('2014-11-26 10:00:00') };
var obj    = { _id: new Date('2014-11-26 22:22:22'), foo: 'bar' };

var result = match(filter, obj);
assert.strictEqual(result, false);

// work with dates and string and match
var filter = { _id: new Date('2014-11-26 10:00:00'), foo: 'bar' };
var obj    = { _id: new Date('2014-11-26 10:00:00'), foo: 'bar' };

var result = match(filter, obj);
assert.strictEqual(result, true);

// work with dates and string and not match on string
var filter = { _id: new Date('2014-11-26 10:00:00'), foo: 'baz' };
var obj    = { _id: new Date('2014-11-26 10:00:00'), foo: 'bar' };

var result = match(filter, obj);
assert.strictEqual(result, false);

// recursive filter with unrecursive date in object
var filter = { _id: { _id: new Date('2014-11-26 10:00:00') } };
var obj    = { _id: new Date('2014-11-26 10:00:00') };

var result = match(filter, obj);
assert.strictEqual(result, false);


/////
// $in
///

// recurse and work with dates and others and match
var filter = { _id: { _id: new Date('2014-11-26 10:00:00'), _v: { $in: ['B', 'A'] }, _pe: { $in: ['_local']}}};
var obj    = { _id: { _id: new Date('2014-11-26 10:00:00'), _v: 'A', _pe: '_local' }};

var result = match(filter, obj);
assert.strictEqual(result, true);

// recurse and work with dates and others and not match on _v
var filter = { _id: { _id: new Date('2014-11-26 10:00:00'), _v: { $in: ['B'] }, _pe: { $in: ['_local']}}};
var obj    = { _id: { _id: new Date('2014-11-26 10:00:00'), _v: 'A', _pe: '_local' }};

var result = match(filter, obj);
assert.strictEqual(result, false);

// recurse and work with dates and not match
var filter = { _id: { _id: new Date('2014-11-26 10:00:00'), _v: { $in: ['A'] }, _pe: { $in: ['_local']}}};
var obj    = { _id: { _id: new Date('2014-11-26 10:00:00'), _v: 'B', _pe: '_local' }};

var result = match(filter, obj);
assert.strictEqual(result, false);

// require $in values to be of type array
var filter = { foo: 'bar', bar: { $in: {} } };
var obj = { foo: 'bar', bar: {} };

assert.throws(function() { match(filter, obj); }, /\$in keys should point to an array/);

// work with $in and any match
var filter = { foo: 'bar', bar: { $in: [ 'baz' ] } };
var obj = { foo: 'bar', bar: 'baz' };

var result = match(filter, obj);
assert.strictEqual(result, true);

// work with $in and no match
var filter = { foo: 'bar', bar: { $in: [ 'bar' ] } };
var obj = { foo: 'bar', bar: 'baz' };

var result = match(filter, obj);
assert.strictEqual(result, false);

// work only when everything holds
var filter = { foo: 'bar', bar: { $in: [ 'baz' ] }, baz: 'qux' };
var obj = { foo: 'bar', bar: 'baz' };

var result = match(filter, obj);
assert.strictEqual(result, false);

console.log('ok');
