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
 * These tests drive the REAL generated model (`demo/oas31-webhooks`, from
 * `demo/oas31-webhooks/oas31-webhooks.yaml`) rather than hand-built AMF, so a
 * generator change to the `apiContract#webhooks` predicate fails here instead
 * of silently passing an inline fixture.
 */
describe('<api-navigation> webhooks (OAS 3.1/3.2)', () => {
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

  [true, false].forEach((compact) => {
    describe(`${compact ? 'compact' : 'full'} model`, () => {
      let element;

      beforeEach(async () => {
        const amf = await AmfLoader.load(compact, 'oas31-webhooks');
        element = await modelFixture(amf);
      });

      it('collects the webhook into a dedicated collection', () => {
        assert.isArray(element._webhooks, '_webhooks is an array');
        assert.lengthOf(element._webhooks, 1, 'has the single webhook');
        assert.isTrue(element.hasWebhooks, 'hasWebhooks getter is true');
      });

      it('does not leak the webhook into the endpoints collection', () => {
        assert.lengthOf(element._endpoints, 1, 'only the regular endpoint is present');
        assert.equal(element._endpoints[0].path, '/pets');
        const webhookId = element._webhooks[0].id;
        const ids = element._endpoints.map((e) => e.id);
        assert.notInclude(ids, webhookId, 'webhook id is absent from endpoints');
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
        const webhookId = element._webhooks[0].id;
        const webhooksSection = element.shadowRoot.querySelector('section.webhooks');
        const webhookItem = webhooksSection.querySelector(`[data-endpoint-id="${webhookId}"]`);
        assert.ok(webhookItem, 'webhook item is under the Webhooks section');

        const endpointsSection = element.shadowRoot.querySelector('section.endpoints');
        const leaked = endpointsSection.querySelector(`[data-endpoint-id="${webhookId}"]`);
        assert.isNull(leaked, 'webhook item does not appear under Endpoints');
      });
    });
  });

  it('does not render a Webhooks section when the API has no webhooks', async () => {
    // `demo-api` is a RAML API with no top-level webhooks.
    const amf = await AmfLoader.load(false, 'demo-api');
    const el = await modelFixture(amf);
    assert.isFalse(el.hasWebhooks, 'hasWebhooks is false');
    assert.isNull(el.shadowRoot.querySelector('section.webhooks'), 'no webhooks section');
  });
});
