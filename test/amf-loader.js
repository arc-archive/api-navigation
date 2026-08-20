import { AmfHelperMixin } from '@api-components/amf-helper-mixin/amf-helper-mixin.js';

/**
 * amf-client-js 5.11.x emits models in flattened `@graph` form
 * (`{"@graph":[...]}`), whereas 4.7 emitted a plain array (`[{...}]`).
 * Tests that navigate the loaded model directly (`_collectData(amf)`,
 * `AmfHelper.getEndpoint(element, amf, ...)`) break on the raw `@graph` form:
 * `_computeWebApi` returns `undefined`.
 *
 * The component's `amf` setter already expands internally (via
 * `AmfHelperMixin._expand`), so runtime is fine — but the raw model handed to
 * test helpers is not. We expand here, at load time, so every consumer receives
 * a navigable (expanded) model. Re-feeding an already-expanded model to the
 * setter is idempotent (`AmfModelExpander.isInExpandedForm` is a no-op when
 * there is no `@graph`).
 */
class HelperElement extends AmfHelperMixin(Object) {}

const helper = new HelperElement();

/**
 * Expands a raw (possibly flattened `@graph`) AMF model via the mixin setter
 * and returns the navigable document node.
 * @param {any} model Raw API model.
 * @return {any} Expanded model.
 */
const expand = (model) => {
  helper.amf = model;
  const { amf } = helper;
  return Array.isArray(amf) ? amf[0] : amf;
};

export const AmfLoader = {};
AmfLoader.load = async function(compact, fileName='demo-api') {
  const file = '/' + fileName + (compact ? '-compact' : '') + '.json';
  const url = location.protocol + '//' + location.host + '/base/demo/' + file;
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', (e) => {
      let data;
      try {
        data = JSON.parse(e.target.response);
      } catch (e) {
        reject(e);
        return;
      }
      resolve(expand(data));
    });
    xhr.addEventListener('error', () => reject(new Error('Unable to load model file')));
    xhr.open('GET', url);
    xhr.send();
  });
};
