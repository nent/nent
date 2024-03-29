# NENT: Web Application Elements

![MIT](https://badgen.net/github/license/nent/nent?icon=github)
![ts](https://badgen.net/badge/icon/typescript?icon=typescript&label)
[![webnamespaces.org](https://badgen.net/badge/webnamespaces.org/n-*)](https://webnamespaces.org)
[![npm](https://badgen.net/npm/v/@nent/core?icon)](https://www.npmjs.com/package/@nent/core)
[![coverall](https://badgen.net/coveralls/c/github/nent/nent?icon=codecov)](https://coveralls.io/github/nent/nent)
[![jsdelivr](https://data.jsdelivr.com/v1/package/npm/@nent/core/badge)](https://www.jsdelivr.com/package/npm/@nent/core)
[![codacy](https://app.codacy.com/project/badge/Grade/8e52f7ee9e654e87bd569b83f79578f4)](https://www.codacy.com/gh/nent/nent/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=nent/nent&amp;utm_campaign=Badge_Grade)
[![coverage](https://github.com/nent/nent/actions/workflows/main.yml/badge.svg)](https://github.com/nent/nent/actions/workflows/main.yml)

![NENT](https://files.nent.dev/assets/logo-white-bg.png)

NENT is a set of Web Components that enables designers to add functionality to static HTML. No code, no build process, just simple and powerful functionality.

> ⚠️ This project is still under development. Expect breaking changes until the 1.0 release.

## Why use NENT?

NENT is a small library that allows you to include interactivity and animations to your static HTML pages. No framework, no build process, no code needed. Just include the JS file and add the elements where you need functionality within the semantics of HTML.

## Declared Functionality

Each element encapsulates a feature or functionality such as routing, dynamic content, data-merged templates, and reusable partials. Each element is lightweight and lazy-loaded, so they can be individually used without pulling in an entire framework or library.

Declarative-Applications:

* Easy to understand and reason about
* Easy to maintain, with reduced side-effects
* Deterministic and testable with static-analysis  
* More approachable to a wider range of skill levels
* FUN! HTML as it was meant to be.

### Element Groups

The elements are named and grouped by their sub-system. In some cases, shared services are enabled with a system-level element.

Sub-systems add functionality to other systems. For instance, view routes can use data expressions in their content when the data system is included.

### View Router: `<n-views-*>`

In-page routing and navigation elements with no dependencies.

* Single Page Application Routing
* Fast navigation between views
* Page History
* Route Transitions
* Nested Layouts
* Nav Links with Active Route detection
* Nav Lists: \
  Nav-Bars, Child Menus, and Breadcrumbs
* Guided Navigation
  
### Content: `<n-content-*>`

Independent content elements for managing the HTML on the page.

* Content Templates
* Deferred Content
* Content Data Injection
* Markdown Rendering
* Remote HTML / Partials

### App: `<n-app-*>`

Option elements to add robust application features to the HTML file with no dependencies.

* App Console Logging
* App Theme Detection & Control
* UI Component Kit Integrations (Ionic, shoelace, Material, etc)
* PWA Support (coming)
* Expose Event/Actions to the DOM

### Actions: `<n-action-*>`

Data structure elements to declare functions and their activations.

* Declared Actions
* Reactive Activators
* Add Custom Async Functions

### Data: `<n-data-*>`

Optional enhancements elements to add data-functionality and data-providers.

* Expression Evaluation
* Token Resolution
* Conditional Rule Evaluation

### Elements: `<n-elements>`

Optional enhancement to add DOM manipulation features to other NENT elements. It also enables declarative actions for DOM updates.

### Audio: `<n-audio-*>`

Optional audio element to orchestrate declarative audio playback.

* Voice-over Audio
* Event Sounds
* Background Music

### Analytics: `<n-analytics>`

Optional action listener to delegate events and route changes to any analytics provider (minor scripting required).

* Page Views
* View Times
* Custom Events

### Video: `<n-video-*>`

Optional wrapper element to normalize video events between various video players to enable media-timed events for synchronized actions. Useful for automatically navigating when a video ends or updating the content based on the video time.

## Get Started

You can spike out a new NENT project with the script reference in place, or follow the installation instructions below for an existing HTML file.

````bash
npm create @nent my-nent-app

````

## Installation

> ℹ️ Note: This is a pre-release project and is subject to breaking changes and incomplete features. Thank you for trying it out!

Add a single script reference to the page head and the library is ready to go.

**The initial download is under 1K!**

Each component you use is lazy-loaded when you first use one. Most are tiny, with the largest around 60k.

> ℹ️ [Component Sizes](https://nent.dev/dist/stats.html)

### CDN

```html
<head>
  <script
    type="module"
    src="https://cdn.jsdelivr.net/npm/@nent/core/dist/esm/nent.js"
  ></script>
</head>
```

### NPM

```html
<head>
  ...
  <script
    type="module"
    src="~/node_modules/@nent/core/dist/nent/nent.esm.js"
  ></script>
  ....
</head>
```

```bash
npm i @nent/core
# or
yarn add @nent/core
```

### Show your Love

If you use NENT and want to help spread the word, put a NENT badge on your readme or your website.

NENT badge:

[![NENT](https://badgen.net/badge/Powered%20by/NENT/purple)](https://nent.dev)

#### Markdown

```markdown
[![NENT](https://badgen.net/badge/Powered%20by/NENT/purple)](https://nent.dev)
```

#### HTML

```html
<a href="https://nent.dev" target="_blank">
  <img alt="Powered by NENT" 
    src="https://badgen.net/badge/Powered%20by/NENT/purple"/>
</a>
```

## Learn More

The best way to see what these elements in action, is to take a look at the documentation demo. The installable app is built using these elements in a single HTML file (with child-routes and partials lazy-loaded, as-needed).

[![Take the Tour](https://badgen.net/badge/Demo/NENT?color=purple)](https://nent.dev)

## Contact

If you like the idea, join us! Or give it a star.

[![github](https://badgen.net/badge/github/★?icon=github&color=purple)](https://github.com/nent/nent)

If you have requests, ideas, or feedback, reach out to us:

[![Twitter](https://badgen.net/badge/tweet/me?icon=twitter&color=purple)](https://twitter.com/NENT_dev)

## Attribution

### Built on the shoulders of giants

Thank you to the Ionic team and their fabulous [**Stencil.js** SDK](https://stenciljs.com) for the best way to build lightning-fast, native elements.

Also, thank you to the creators and contributors to all open-source efforts, but especially to the libraries we love and use in our plugin components:

* **expr-eval**: [declarative expression parser](https://github.com/silentmatt/expr-eval) used in n-data
* **jsonata**: [declarative data query/filter/transformation](https://jsonata.org/) used in n-content-repeat
* **howler**:  [easy-to-use audio playback tools](https://github.com/goldfire/howler.js) used in n-audio
* **remarkable**: [ridiculously fast markdown processing.](https://jonschlinkert.github.io/remarkable/demo/) used in n-content-markdown

[changelog](./changelog.md)
