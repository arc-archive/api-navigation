import { assert, fixture, html, aTimeout } from '@open-wc/testing';
import { AmfLoader } from './amf-loader.js';
import '../api-navigation.js';

describe('AsyncAPI 3.0 operation rendering (navigation)', () => {
  let element;
  before(async () => {
    const amf = await AmfLoader.load(true, 'async30'); // (compact, fileName)
    element = await fixture(html`<api-navigation .amf="${amf}" summary endpointsOpened></api-navigation>`);
    await aTimeout(0);
  });

  it('labels the async op SEND (not POST) and colors it publish', () => {
    const badges = Array.from(element.shadowRoot.querySelectorAll('.method-label'));
    const texts = badges.map((n) => n.textContent.trim().toLowerCase());
    assert.include(texts, 'send');
    assert.notInclude(texts, 'post');
    const send = badges.find((n) => n.textContent.trim().toLowerCase() === 'send');
    assert.equal(send.getAttribute('data-method'), 'publish');
  });

  it('_methodFilter does not throw for a MethodItem with undefined method', () => {
    // Directly drives the guarded `(item.method || '').indexOf(...)` branch
    // in `_methodFilter` (ApiNavigation.js) with a method-less item — the
    // shape you'd get from an operation `_computeOperationMethod` couldn't
    // resolve a method/action for. `_flushQuery()` alone never reaches this
    // code (it only sets `__effectiveQuery`; filtering runs later inside the
    // Lit render cycle), so we call the filter itself.
    element.__effectiveQuery = 'sig';
    const item = { label: 'label-without-match', method: undefined };
    let result;
    assert.doesNotThrow(() => {
      result = element._methodFilter(item);
    });
    assert.isBoolean(result);
  });

  it('_getFilteredEndpoints does not throw for an endpoint with a method-less MethodItem', () => {
    // Directly drives the guarded `(method.method || '').indexOf(q)` branch
    // in `_getFilteredEndpoints`.
    element.__effectiveQuery = 'sig';
    const endpoints = [
      {
        label: 'endpoint-without-match',
        path: '/no-match',
        methods: [{ label: 'label-without-match', method: undefined }],
      },
    ];
    let result;
    assert.doesNotThrow(() => {
      result = element._getFilteredEndpoints.call({
        _endpoints: endpoints,
        __effectiveQuery: element.__effectiveQuery,
      });
    });
    assert.deepEqual(result, []);
  });
});
