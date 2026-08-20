import { fixture, assert, nextFrame, html } from '@open-wc/testing';
import '../api-navigation.js';
import { AmfLoader } from './amf-loader.js';

/* eslint-disable no-plusplus */

/** @typedef {import('../').ApiNavigation} ApiNavigation */

/**
 * OAS 3.1/3.2 top-level webhooks render in their own "Webhooks" nav section,
 * separate from "Endpoints". A webhook compiles to an `apiContract#EndPoint`
 * node identical to a regular endpoint; the only distinction is the WebAPI root
 * references it via `apiContract#webhooks` instead of `apiContract#endpoint`.
 *
 * The model is built inline (expanded AMF, no `@context`) so these tests do not
 * depend on the model generator — the webhook demo fixture is git-ignored
 * (`npm run build:models` artifact) and must never gate this behavior.
 */
describe('<api-navigation> webhooks (OAS 3.1/3.2)', () => {
  const DOC = 'http://a.ml/vocabularies/document#Document';
  const ENCODES = 'http://a.ml/vocabularies/document#encodes';
  const WEBAPI = 'http://a.ml/vocabularies/apiContract#WebAPI';
  const ENDPOINT = 'http://a.ml/vocabularies/apiContract#endpoint';
  const WEBHOOKS = 'http://a.ml/vocabularies/apiContract#webhooks';
  const ENDPOINT_T = 'http://a.ml/vocabularies/apiContract#EndPoint';
  const OPERATION_T = 'http://a.ml/vocabularies/apiContract#Operation';
  const SUPPORTED_OP = 'http://a.ml/vocabularies/apiContract#supportedOperation';
  const PATH = 'http://a.ml/vocabularies/apiContract#path';
  const METHOD = 'http://a.ml/vocabularies/apiContract#method';

  /**
   * Document with one regular endpoint (`/pets` GET) and one top-level webhook
   * (`newPet` POST). The webhook carries no `core#name`, so its label defaults
   * to the path — the event name.
   */
  function buildWebhookModel() {
    return {
      '@type': [DOC],
      [ENCODES]: [{
        '@id': 'amf://id#1',
        '@type': [WEBAPI],
        [ENDPOINT]: [{
          '@id': 'amf://id#10',
          '@type': [ENDPOINT_T],
          [PATH]: [{ '@value': '/pets' }],
          [SUPPORTED_OP]: [{
            '@id': 'amf://id#11',
            '@type': [OPERATION_T],
            [METHOD]: [{ '@value': 'get' }],
          }],
        }],
        [WEBHOOKS]: [{
          '@id': 'amf://id#20',
          '@type': [ENDPOINT_T],
          [PATH]: [{ '@value': 'newPet' }],
          [SUPPORTED_OP]: [{
            '@id': 'amf://id#21',
            '@type': [OPERATION_T],
            [METHOD]: [{ '@value': 'post' }],
          }],
        }],
      }],
    };
  }

  /**
   * @param {any} amf
   * @returns {Promise<ApiNavigation>}
   */
  async function modelFixture(amf) {
    const elm = /** @type ApiNavigation */ (await fixture(html`<api-navigation
      endpointsOpened
      webhooksOpened
      .amf="${amf}"
    ></api-navigation>`));
    await nextFrame();
    return elm;
  }

  let element;
  let model;

  beforeEach(async () => {
    model = buildWebhookModel();
    element = await modelFixture(model);
  });

  it('collects the webhook into a dedicated collection', () => {
    assert.isArray(element._webhooks, '_webhooks is an array');
    assert.lengthOf(element._webhooks, 1, 'has the single webhook');
    assert.isTrue(element.hasWebhooks, 'hasWebhooks getter is true');
  });

  it('does not leak the webhook into the endpoints collection', () => {
    assert.lengthOf(element._endpoints, 1, 'only the regular endpoint is present');
    assert.equal(element._endpoints[0].path, '/pets');
    const ids = element._endpoints.map((e) => e.id);
    assert.notInclude(ids, 'amf://id#20', 'webhook id is absent from endpoints');
  });

  it('labels the webhook with the event name and does not render a path', () => {
    const webhook = element._webhooks[0];
    assert.equal(webhook.label, 'newPet', 'label is the event name');
    assert.isFalse(webhook.renderPath, 'renderPath is false (no URI shown)');
  });

  it('renders a distinct "Webhooks" section in the shadow DOM', () => {
    const section = element.shadowRoot.querySelector('section.webhooks');
    assert.ok(section, 'webhooks section exists');
    const title = section.querySelector('.title-h3');
    assert.equal(title.textContent.trim(), 'Webhooks', 'section title is Webhooks');
  });

  it('renders the webhook item inside the Webhooks section, not Endpoints', () => {
    const webhooksSection = element.shadowRoot.querySelector('section.webhooks');
    const webhookItem = webhooksSection.querySelector('[data-endpoint-id="amf://id#20"]');
    assert.ok(webhookItem, 'webhook item is under the Webhooks section');

    const endpointsSection = element.shadowRoot.querySelector('section.endpoints');
    const leaked = endpointsSection.querySelector('[data-endpoint-id="amf://id#20"]');
    assert.isNull(leaked, 'webhook item does not appear under Endpoints');
  });

  it('does not render a Webhooks section when the API has no webhooks', async () => {
    const noWebhooks = {
      '@type': [DOC],
      [ENCODES]: [{
        '@id': 'amf://id#1',
        '@type': [WEBAPI],
        [ENDPOINT]: [{
          '@id': 'amf://id#10',
          '@type': [ENDPOINT_T],
          [PATH]: [{ '@value': '/pets' }],
          [SUPPORTED_OP]: [{
            '@id': 'amf://id#11',
            '@type': [OPERATION_T],
            [METHOD]: [{ '@value': 'get' }],
          }],
        }],
      }],
    };
    const el = await modelFixture(noWebhooks);
    assert.isFalse(el.hasWebhooks, 'hasWebhooks is false');
    assert.isNull(el.shadowRoot.querySelector('section.webhooks'), 'no webhooks section');
  });
});

/**
 * Smoke test against the real generated model (`demo/oas31-webhooks`), not an
 * inline hand-built one. Guards the `apiContract#webhooks` predicate contract
 * end-to-end: a future generator change to the predicate would fail here even
 * though the inline suite above would still pass.
 */
describe('<api-navigation> webhooks (generated model)', () => {
  async function modelFixture(amf) {
    const elm = await fixture(html`<api-navigation
      endpointsOpened
      webhooksOpened
      .amf="${amf}"
    ></api-navigation>`);
    await nextFrame();
    return elm;
  }

  [true, false].forEach((compact) => {
    it(`renders the Webhooks section from the ${compact ? 'compact' : 'full'} model`, async () => {
      const amf = await AmfLoader.load(compact, 'oas31-webhooks');
      const element = await modelFixture(amf);
      assert.isTrue(element.hasWebhooks, 'hasWebhooks is true');
      assert.lengthOf(element._webhooks, 1, 'one webhook resolved');
      const section = element.shadowRoot.querySelector('section.webhooks');
      assert.ok(section, 'webhooks section is rendered');
    });
  });
});
