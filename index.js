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
