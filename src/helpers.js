/* eslint-disable import/prefer-default-export */

/**
 * @summary Safely return the value of a key from an object
 * @function
 * @public
 * @locus client
 *
 * @param {object} object
 * @param {string} [props]
 * @param {any} defaultValue
 *
 * @returns {string}
 *
 * @example
 * getName(state, 'all.length');
 * => [] // state.all.length
 */
export function getValue(object, props, defaultValue) {
  if (!object) {
    return defaultValue;
  }

  // If props is passed, it means we want to safely get a nested property from
  // this object. like in the example
  if (props) {
    const res = props.split('.').reduce((prv, crr) => (prv ? prv[crr] : undefined), object);
    return res === undefined ? defaultValue : res;
  }

  return defaultValue || '';
}
