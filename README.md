# NENT: Web Application Elements

![MIT](https://badgen.net/github/license/nent/nent?icon=github)
![size](https://badgen.net/badgesize/normal/file-url/unpkg.com/@nent/core/dist/nent/nent.esm.js?icon=sourcegraph&color=blue)
![tree-shaking](https://badgen.net/badge/tree-shaking/enabled?icon=packagephobia)
![ts](https://badgen.net/badge/icon/typescript?icon=typescript&label)

[![NPM](https://badgen.net/npm/v/@nent/core?icon&color=blue)](https://www.npmjs.com/package/@nent/core)
[![coverall](https://badgen.net/coveralls/c/github/nent/nent?icon=codecov&color=blue)](https://coveralls.io/github/nent/nent)
[![gitter](https://badgen.net/badge/chat/on%20gitter?icon=gitter)](https://gitter.im/nent/nent)
[![jsdelivr](https://badgen.net/badge/jsdelivr/CDN?icon=jsdelivr&color=blue)](https://cdn.jsdelivr.net/npm/@nent/core/+esm)
[![unpkgd](https://badgen.net/badge/unpkg/CDN)](https://unpkg.com/browse/@nent/core)

## What is Nent?

Nent is a library of function-elements (web-components) that add new features aimed for developing web applications.

> 'Nent' comes from the word compo-*nent* and it is the uncreative result of my tech-brain doing 'branding'.  

## Motivation

The goal of this project is to empower the next generation of web developers to create web-experiences with less development and deployment friction, within a single semantic-system. (Really though, I just needed to make high-performing, lightweight, web-applications quickly -- without complex builds, or frameworks.)

## Declared Functionality

Each elements encapsulate a feature or functionality, like routing, dynamic templates, and reusable-partials.

Simple web applications could be completely declarative, using HTML semantics. 

Declarative System Advantages:

* Easier to understand and reason about
* Easier to maintain, with reduced side-effects
* Deterministic, and testable with static-analysis 
* More accessible / approachable to a wider range of humans. 

### System Groups

The elements are named and grouped by their system or sub-system, with shared services enabled with a root-tag. 

Sub-systems add functionality to other systems. For instance, view routes can use data-expressions in their content when the data-system is included.

### Views: `<n-views-*>`
This is the routing and navigation system
- Single Page Application Routing
- Fast navigation between views
- Page History
- Route Transitions
- Nested Layouts
- Nav Links with Active Route detection
- Navigation Lists:
  Nav Bars, Child Menus and Breadcrumbs
- Guided Navigation
- View-Timed Actions
- View Entry / Exit Actions
  
### Content: `<n-content-*>`
- Dynamic Content Rendering
- Deferred Content
- Markdown Rendering
- Remote HTML

### App: `<n-app-*>`
- Page/Document Management
- Theme Detection & Control
- Console Logging
- UI Component Kit Integrations
- PWA Support (coming)

### Actions: `<n-action-*>`
- Declared Actions
- Reactive Activators
- Exposes the Event / Action Bus to the DOM
- Async Functions

### Data: `<n-data-*>`
- Adds: Expression Evaluation to conditionally rendered content
- Adds: Data-Template Rendering to `Content`
- Adds: Data-driven Rule Evaluation to `route-prompt`

### Elements: `<n-elements>`
- DOM Element Manipulation

### Audio:
- Reactive Audio
- Voice-overs
- Background Music

### Analytics:
- Page Views
- Page TImes 
- Custom Events

### Video:
- Interactive Video
- Video-Timed Actions

## Installation

> This is a pre-release project and is subject to breaking-changes and incomplete features. Thank you for trying it out!

Add a script-reference to the page head:

### CDN:
```html
<head>
  <script
    type="module"
    src="https://unpkg.com/@nent/core/dist/nent/nent.esm.js"
  ></script>
</head>
```

### NPM:

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
yarn add @nent/core
```
## Learn More

The best way to see what these elements in actoin, is to take a look at the documentation demo. The installable app is built using these elements in a single HTML file (with child-routes and partials lazy-loaded, as-needed).

[![Take the Tour](https://badgen.net/badge/@nent/core:%20demo?color=blue)](https://nent.dev)

## Contact

If you like the idea, join us! Or give it a star.

[![github](https://badgen.net/badge/github/★?icon=github&color=blue)](https://github.com/nent/nent)

If you have requests, ideas or feedback, join the discussion on Gitter:

[![gitter](https://badgen.net/badge/chat/with%20me%20on%20gitter?icon=gitter)](https://gitter.im/nent/nent)

Reach out to me personally:

[![Twitter](https://badgen.net/badge/tweet/me?icon=twitter&color=blue)](https://twitter.com/logrythmik)

## Contributions

### Built on the shoulders of giants!

Thank you to the Ionic team and their fabulous [**Stencil.js** SDK](https://stenciljs.com) for the best way to build lightening fast, native elements.

Also, thank you to the creators and contributors to all open-source efforts, but especially to the libraries we love and use in our plugin components:

- **expr-eval**: [declarative expression parser](https://github.com/silentmatt/expr-eval) 
- **jsonata**: [declarative data query/filter/transformation](https://jsonata.org/) 
- **howler**: [easy-to-use audio playback tools](https://github.com/goldfire/howler.js) 
- **remarkable**: [ridiculously fast markdown processing.](https://jonschlinkert.github.io/remarkable/demo/) 
