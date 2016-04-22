# ember-cli-table-pagination
makes it easy to build remote backed tables w/ ember-cli-pagination and bootstrap

This README outlines the details of collaborating on this Ember addon.

## Usage

### `table-pagination`

#### Properties

TODO

#### Events

TODO 

#### Replaceable components

Here is a list of the replaceable components and their respective defaults

* `titleComponent` (`table-pagination.table-title`): Display the table title if specified
  * should be a component with a body. The body will be replaced by the title.
* `bodyComponent` (`table-pagination.table-body`): wrap up the table body
  * no parameters, will wrap all the component's HTML except the title
* `toolbarComponent` (`table-pagination.table-toolbar`): wrap up the toolbar
  * no parameters, its body will host the quick-search, item/page selector as well as the page selector
* `toolsComponent` (`table-pagination.table-tools`): receive the following parameters:
  * `allowQuickSearch`(boolean): either or not the quick-search should be enabled
  * `searchString`(string): two-way binding to the quick-search value
  * `perPage`(integer): two-way binding to the item/page value
  * `refresh`(action): action passed on to the `refresh` action of `table-pagination`
  The `toolsComponent` should display these values and offer the user a way to manipulate `searchString` and `perPage`
* `pagerComponent` (`table-pagination.table-pager`): should display the current page number and allow the user to change page
  * `count`(integer): total amount of pages
  * `current`(integer): current page number (1-indexed)
  * `changePage`(action): action passed on the `changePage` action of the component if the pagination is remotely handled else the component will deal with the page change by itself.
* `contentComponent` (`table-pagination.table-content`):

Note: to allow for more flexibility when overriding the component, a special parameter will be passed to each of the overridable sub-components that can be used to pass arbitrary parameters from the main component to any of its sub-components. These parameters are called: `titleParams`, `bodyParams`, `toolbarParams`, `toolsParams`, `pagerParams` & `contentParams`.

### `bs-table-pagination`

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
