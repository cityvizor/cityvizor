
var _self:any = self;

if (!_self.Promise) {
  console.log("Compatibility: Loading polyfill for Promise API");
  importScripts("/assets/polyfills/bluebird.min.js");
}

if (!_self.TransformStream) {
  console.log("Compatibility: Loading polyfill for Web Streams API");
  importScripts("/assets/polyfills/web-streams.js");
  _self.streamsPolyfill = true;
}

if (!_self.TextDecoder) {
  console.log("Compatibility: Loading polyfill for TextDecoder API");
  importScripts(
    "/assets/polyfills/encoding-indexes.js",
    "/assets/polyfills/encoding.js",
  );
}

// https://github.com/tc39/proposal-object-values-entries
if (!Object.entries) {
  console.log("Compatibility: Loading polyfill for Object.entries()");
  Object.entries = function( obj ){
    var ownProps = Object.keys( obj ),
        i = ownProps.length,
        resArray = new Array(i); // preallocate the Array
    while (i--)
      resArray[i] = [ownProps[i], obj[ownProps[i]]];
    
    return resArray;
  };
}

// https://tc39.github.io/ecma262/#sec-array.prototype.find
if (!Array.prototype.find) {
  console.log("Compatibility: Loading polyfill for Array.prototype.find()");
  Object.defineProperty(Array.prototype, 'find', {
    value: function(predicate) {
     // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return kValue.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return kValue;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return undefined.
      return undefined;
    },
    configurable: true,
    writable: true
  });
}