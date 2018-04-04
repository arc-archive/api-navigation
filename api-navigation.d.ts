/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   api-navigation.html
 */

/// <reference path="../polymer/types/polymer-element.d.ts" />
/// <reference path="../polymer/types/lib/elements/dom-if.d.ts" />
/// <reference path="../polymer/types/lib/elements/dom-repeat.d.ts" />
/// <reference path="../polymer/types/lib/utils/render-status.d.ts" />
/// <reference path="../raml-aware/raml-aware.d.ts" />
/// <reference path="../paper-icon-button/paper-icon-button.d.ts" />
/// <reference path="../arc-icons/arc-icons.d.ts" />
/// <reference path="../iron-collapse/iron-collapse.d.ts" />
/// <reference path="../iron-flex-layout/iron-flex-layout.d.ts" />
/// <reference path="amf-helper.d.ts" />

declare namespace ApiElements {

  /**
   * `api-navigation`
   * A navigation for an API spec using AMF model.
   *
   * This element is to replace deprecated `raml-path-selector`.
   * It is lightweight and much less complex in comparision.
   *
   * The element works with [AMF](https://github.com/mulesoft/amf)
   * json/ld model. When the model is set it computes list of documentation
   * nodes, types, endpoints, mathods and security schemas.
   * As a result user can select any of the items in the UI and the application
   * is informed about user choice via custom event.
   *
   * The selection is a selected API shape `@id`. The application is responsible
   * for computing the model selected by the user.
   *
   * AMF model can be passed directly by setting `amfModel` property or by
   * setting `aware` property and by use `raml-aware` element. It allows
   * to communicate AMF data without having access to the element due to
   * shadow DOM restrictions.
   *
   * ```html
   * <raml-aware scope="api-console"></raml-aware>
   * <api-navigation aware="api-console"></api-navigation>
   * ```
   *
   * Once the `raml-aware` element receives some that they are instantly
   * transfered to `api-navigation`.
   *
   * ## Styling
   *
   * Custom property | Description | Default
   * ----------------|-------------|----------
   * `--api-navigation` | Mixin applied to this element | `{}`
   * `--arc-font-common-base` | Mixin applied to section headers. Theme mixin | `{}`
   * `--arc-font-font1` | Mixin applied to the element. Theme mixin | `{}`
   * `--api-navigation-header-color` | Color of section title | `rgba(0, 0, 0, 0.84)`
   * `--api-navigation-section-title-background-color` | Background color of the section title | `inherit`
   * `--api-navigation-list-item-min-height` | Minimum heigtht of menu items | `48px`
   * `--api-navigation-list-item-color` | Color of the menu items | `#616161`
   * `--api-navigation-list-item` | Mixin applied to the menu items | `{}`
   * `--api-navigation-list-item-selected-weight` | Font weight of selected menu item | `bold`
   * `--api-navigation-list-item-selected-background-color` | Background color of selected menu item | `--accent-color`
   * `--api-navigation-list-item-selected-color` | Color of selected menu item | `#fff`
   * `--api-navigation-list-item-selected` | Mixin applied to the selected item | `{}`
   * `--api-navigation-list-item-disabled-color` | Color of disabled menu item. Currently not in use. | `--disabled-text-color`
   * `--api-navigation-list-item-disabled` | Mixin applied to disabled menu item. Currently not in use. | `{}`
   * `--api-navigation-list-item-focused` |  Mixin applied to focused menu item. | `{}`
   * `--api-navigation-list-item-focused-before` | Mixin applied to the `:before` pseudo-element of focused item | `{}`
   * `--api-navigation-list-item-hovered` | Mixin applied to menu item when hovering and not focused. Note, you should not rely of hover states | `{}`
   * `--api-navigation-toggle-icon-color` | Color of the toggle button next to section title | `rgba(0, 0, 0, 0.74)`
   * `--api-navigation-toggle-icon-hover-color` | Color of the toggle button next to section title when hovering. | `--secondary-button-color` or `rgba(0, 0, 0, 0.88)`
   * `--method-display-get-color` | Font color of the GET method label box | `rgb(0, 128, 0)`
   * `--method-display-post-color` | Font color of the POST method label box | `rgb(33, 150, 243)`
   * `--method-display-put-color` | Font color of the PUT method label box | `rgb(255, 165, 0)`
   * `--method-display-delete-color` | Font color of the DELETE method label box | `rgb(244, 67, 54)`
   * `--method-display-patch-color` | Font color of the PATCH method label box | `rgb(156, 39, 176)`
   */
  class ApiNavigation extends Polymer.Element {

    /**
     * `raml-aware` scope property to use.
     */
    aware: string|null|undefined;

    /**
     * Generated AMF json/ld model form the API spec.
     * The element assumes the object of the first array item to be a
     * type of `"http://raml.org/vocabularies/document#Document`
     * on AMF vocabulary.
     */
    amfModel: object|any[]|null;
    readonly _helper: object|null|undefined;

    /**
     * A model `@id` of selected documentation part.
     * Special case is for `summary` view. It's not part of an API
     * but most applications has some kins of summary view for the
     * API.
     */
    selected: string|null|undefined;

    /**
     * Type of the selected item.
     * One of `documentation`, `type`, `security`, `endpoint`, `method`
     * or `summary`.
     *
     * This property is set after `selected` property.
     */
    selectedType: string|null|undefined;

    /**
     * If set it renders `API summary` menu option.
     * It will allow to set `selected` and `selectedType` to `summary`
     * when this option is set.
     */
    summary: boolean|null|undefined;

    /**
     * Computed list of documentatoin items in the API.
     */
    readonly docs: Array<object|null>|null;

    /**
     * Computed value, true when `docs` property is set with values
     */
    readonly hasDocs: object|null;

    /**
     * Determines and changes state of documentation panel.
     */
    docsOpened: boolean|null|undefined;

    /**
     * Computed list of "type" items in the API.
     */
    readonly types: Array<object|null>|null;

    /**
     * Computed value, true when `types` property is set with values
     */
    readonly hasTypes: object|null;

    /**
     * Determines and changes state of types panel.
     */
    typesOpened: boolean|null|undefined;

    /**
     * Computed list of Security schemes items in the API.
     */
    readonly security: Array<object|null>|null;

    /**
     * Computed value, true when `security` property is set with values
     */
    readonly hasSecurity: object|null;

    /**
     * Determines and changes state of security panel.
     */
    securityOpened: boolean|null|undefined;

    /**
     * Computed list of endpoint items in the API.
     */
    readonly endpoints: Array<object|null>|null;

    /**
     * Computed value, true when `endpoints` property is set with values
     */
    readonly hasEndpoints: object|null;

    /**
     * Determines and changes state of endpoints panel.
     */
    endpointsOpened: boolean|null|undefined;

    /**
     * If true, the element will not produce a ripple effect when interacted with via the pointer.
     */
    noink: boolean|null|undefined;

    /**
     * Filters list elements by this value when set.
     * Clear the value to reset the search.
     *
     * This is not currently exposed in element's UI due
     * to complexity of search and performance.
     */
    query: string|null|undefined;

    /**
     * Ensures aria role atribute is in place.
     * Attaches element's listeners.
     */
    connectedCallback(): void;

    /**
     * Removes click event listener when removed from DOM.
     */
    disconnectedCallback(): void;

    /**
     * Creates instance of `ApiNavigationAmfHelper` with new model.
     *
     * @param model AMF model
     * @returns Helper instance.
     */
    _computeHelper(model: object|any[]|null): ApiNavigationAmfHelper|null;

    /**
     * Called when helper instance has been created.
     * It collects information about `documentation`, `types`, `security schemes`
     * and `endpoints`. This is set to corresponding properties
     * and eventually rendered by the navigation view element.
     *
     * @param helper Instance of ApiNavigationAmfHelper
     * with model loaded.
     */
    _helperReady(helper: ApiNavigationAmfHelper|null): void;

    /**
     * Checks if passed argument is set and has values.
     */
    _computeModelHasValues(items: Array<any|null>|null): Boolean|null;

    /**
     * Click handler for the element.
     * It either toggles panel visibility or selects an item.
     */
    _clickHandler(e: ClickEvent|null): void;

    /**
     * Selectes new item in the menu.
     */
    _selectItem(node: Node|null): void;

    /**
     * Toggles selection state of a node that has `data-api-id` set to
     * `id`.
     *
     * @param id Selected node id.
     */
    _toggleSelection(id: String|null): void;

    /**
     * Updates the state of selected element when `selected` changes.
     *
     * @param current New selection
     * @param previous Old selection
     */
    _selectedChangd(current: String|null, previous: String|null): void;

    /**
     * Label check agains `query` function called by `dom-repeat` element.
     * This method uses `__effectiveQuery` property set by `_flushQuery()`
     * method.
     *
     * @param item Model item with `lable` property.
     */
    _labelFilter(item: object|null): Boolean|null;

    /**
     * Label and method check agains `query` function called by `dom-repeat`
     * element. This method uses `__effectiveQuery` property set by
     * `_flushQuery()` method.
     *
     * @param item Model item with `lable` property.
     */
    _methodFilter(item: object|null): Boolean|null;

    /**
     * When `query` property change it runs the filter function
     * in a debouncer set for ~50 ms.
     */
    _queryChanged(): void;

    /**
     * Calles `render()` function on each data repeater that have filterable
     * items.
     * It set's `__effectiveQuery` property on the element that is beyond
     * Polymer's data binding system so it skips 2 function calls each time
     * it is read. In a repeater filter function that can be a lot.
     *
     * Also the `__effectiveQuery` is transformed to perform text search.
     */
    _flushQuery(): void;

    /**
     * Hides the parent model when number of children is 0 or shows it
     * otherwise.
     */
    _methodsCountChanged(e: CustomEvent|null): void;

    /**
     * Dispatches `api-navigation-selection-changed` event on selection change.
     *
     * @param selected Selected id
     * @param selectedType Type of AMF shape
     */
    _selectionChnaged(selected: String|null, selectedType: String|null): void;
  }
}

interface HTMLElementTagNameMap {
  "api-navigation": ApiElements.ApiNavigation;
}
