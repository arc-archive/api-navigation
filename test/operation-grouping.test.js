import { assert, fixture, html, aTimeout } from '@open-wc/testing';
import { AmfLoader } from './amf-loader.js';
import '../api-navigation.js';

describe('OAS 3.2 operation grouping (navigation)', () => {
  let element;

  before(async () => {
    const amf = await AmfLoader.load(true, 'oas32');
    element = await fixture(
      html`<api-navigation .amf="${amf}" .operationsOpened="${true}"></api-navigation>`
    );
    await aTimeout(0);
  });

  it('labels query and additional operation groups', () => {
    const labels = Array.from(
      element.shadowRoot.querySelectorAll('.op-group-label')
    ).map((n) => n.textContent.trim());
    assert.deepEqual(labels, ['Operations', 'Query', 'Additional operations']);
  });

  it('renders the standard-only endpoint as a flat list with no group labels', () => {
    const endpointNode = Array.from(
      element.shadowRoot.querySelectorAll('.list-item.endpoint')
    ).find((n) => n.dataset.endpointPath === '/auth');
    assert.exists(endpointNode, 'endpoint node for /auth not found');
    const collapse = endpointNode.nextElementSibling;
    assert.equal(collapse.querySelectorAll('.op-group-label').length, 0);
  });
});
