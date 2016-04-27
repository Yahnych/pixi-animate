import ColorUtils from './ColorUtils';

/**
 * Contains the collection of graphics data
 * @namespace PIXI.animate
 * @class ShapesCache
 */
const ShapesCache = {};

/**
 * Add an item or itesm to the cache
 * @method add
 * @static
 * @param {String|Object} prop  The id of graphic or the map of graphics to add
 * @param {Array} [value] If adding a single property, the draw commands
 */
Object.defineProperty(ShapesCache, 'add', {
    enumerable: false,
    value: function(prop, draw) {
        if (typeof prop === "object") {
            for (let p in prop) {
                ShapesCache.add(p, prop[p]);
            }
            return;
        }
        // Convert all hex string colors (animate) to int (pixi.js)
        for (let d in draw) {
            let arg = draw[d];
            if (typeof arg === 'string' && arg[0] === '#') {
                draw[d] = ColorUtils.hexToUint(arg);
            }
        }
        ShapesCache[prop] = draw;
    }
});

/**
 * Decode a shapes string into draw commands
 * @method decode
 * @static
 * @param  {String} str The string to decode
 * @return {Object} The map of shape drawing commands
 */
Object.defineProperty(ShapesCache, 'decode', {
    enumerable: false,
    value: function(str) {
        const result = {};
        // each shape is a new line
        let shapes = str.split("\n");
        let isCommand = /^[a-z]{1,2}$/;
        for (let i = 0; i < shapes.length; i++) {
            let shape = shapes[i].split(' '); // arguments are space separated
            let name = shape.shift(); // first argument is the ID
            for (let j = 0; j < shape.length; j++) {
                // Convert all numbers to floats, ignore colors
                let arg = shape[j];
                if (arg[0] !== '#' && !isCommand.test(arg)) {
                    shape[j] = parseFloat(arg);
                }
            }
            result[name] = shape;
        }
        return result;
    }
});

/**
 * Get the graphic from cache
 * @method  fromCache
 * @static
 * @param  {String} id The cache id
 * @return {Array} Series of graphic draw commands
 */
Object.defineProperty(ShapesCache, 'fromCache', {
    enumerable: false,
    value: function(id) {
        return ShapesCache[id] || null;
    }
});

/**
 * Remove the graphic from cache
 * @method  remove
 * @static
 * @param  {String|Object} id The cache id or map
 */
Object.defineProperty(ShapesCache, 'remove', {
    enumerable: false,
    value: function(id) {
        if (typeof id === "object") {
            for (let name in id) {
                ShapesCache.remove(name);
            }
            return;
        }
        if (ShapesCache[id]) {
            ShapesCache[id].length = 0;
            delete ShapesCache[id];
        }
    }
});

/**
 * Remove all graphics from cache
 * @method  removeAll
 * @static
 */
Object.defineProperty(ShapesCache, 'removeAll', {
    enumerable: false,
    value: function() {
        for (let id in ShapesCache) {
            ShapesCache.remove(id);
        }
    }
});

// Assign to namespace
export default ShapesCache;