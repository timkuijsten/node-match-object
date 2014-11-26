/**
 * Copyright (c) 2014 Tim Kuijsten
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

'use strict';

/**
 * Check if all given criteria hold on the given object.
 *
 * Treats the $in keyword special, value of $in must be an array.
 *
 * @param {Object} criteria  search conditions
 * @param {Object} obj  object to compare with
 * @return {Boolean} true if all criteria hold, false otherise
 */
function match(criteria, obj) {
  if (typeof criteria !== 'object') { throw new TypeError('criteria must be an object'); }

  return Object.keys(criteria).every(function(key) {
    // treat $in key special
    if (key === '$in') { return true; }
    if (criteria[key].hasOwnProperty('$in')) {
      if (!Array.isArray(criteria[key].$in)) { throw new TypeError('$in keys should point to an array'); }
      return criteria[key].$in.some(function(el) {
        return el === obj[key];
      });
    }

    // else compare or recurse
    if (~['string', 'number', 'boolean'].indexOf(typeof criteria[key])) {
      return criteria[key] === obj[key];
    } else if (typeof criteria[key] === 'object' && Object.keys(criteria[key]).length) {
      // recurse if obj[key] also has any properties
      if (typeof obj[key] !== 'object' || !Object.keys(obj[key]).length) {
        return false;
      }
      return match(criteria[key], obj[key]);
    } else {
      return JSON.stringify(criteria[key]) === JSON.stringify(obj[key]);
    }
  });
}

module.exports = match;
