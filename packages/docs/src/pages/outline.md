
- [X] Landing
  * Update app to use /home
- [ ] Profile
- [X] Home    
  - [X] Welcome
    - [X] Name
    - [X] Accept Cookie
    - [ ] Install App
      * Auto Updates
      * Offline Capable
      * Disclaimer
  - [X] Welcome Back

- 🚀 Get Started
  - [ ] File Structure
  - [X] Install
    - [X] Select
    - [X] Use CDN
    - [X] Install NPM
    - [X] Insert Base Tag

- 📑 Content Elements
  - [X] Overview
  - [X] Partial Components
    - [X] Content Include
    - [X] Content Markdown
    - [X] Content Reveal
    - [X] Content Share

- 🔀 Routing System
  - [X] How it works
  - [ ] Installation
    - [ ] Components
      - [ ] Router 
      - [ ] Route
      - [ ] Route Prompt *
    - [ ] Simple Example
  - [X] Lazy Routes
    - - [X] Example
  - [X] Child Routes
    - [X] Nested vs Flat
    - - [X] Example
  
  - [ ] Required Routes 
    - [ ] Example

  - 🧭 Route Navigation
    - [X] Overview
    - [ ] Navigation Elements    
      - [ ] Route Link
      - [ ] Route Next (encapsulate 'get-next' from siblings)
      - [ ] Route Back (history back, or previous sibling)
      - [ ] Route List
        - [ ] Ancestors (breadcrumbs)
        - [ ] Children (sub-nav)
        - [ ] Siblings (way-finding, progress)
  
  - [ ] Extensions:
    + 🌠 Action System:
      - [ ] Navigation Actions
    + 💠 Data System:
      - [ ] Route Token Resolution
      - [ ] Route Data Tokens
      - [ ] Conditional Route Prompts
      - [ ] Dynamic Route


- 💠 Data System
  - [X] How it works
  - [ ] Installation
  - [X] Data Elements
    - [ ] Data Display
    - [ ] Data Repeat
    - [ ] Data Embed (no-template)
  - [X] Expressions
  - [ ] Predicates
  - [ ] Providers
    - [ ] Core
      - [ ] Route
      - [ ] Query
      - [ ] Data (from component)
      - [ ] Coming Soon
    - [ ] Available Add-ons
      - [ ] Audio
      - [ ] Cookie
      - [ ] Session
      - [ ] Storage
      - [ ] UI
    - [ ] Custom
  - [ ] Extends:
    - [ ] Token Resolution
      - [ ] X-Attributes 
      - [ ] Predicates
    - [ ] Views 
      - [ ] Page Title
      - [ ] Content Tokens
    - [ ] Presentation 
      - [ ] Tokens in When Condition 
      - [ ] Page Title
      - [ ] Content Tokens
      - [ ] Personalized Animations
- 🌠 Action System
  - [X] How it works
    - [X] Activation
    - [X] Listeners
  - [X] Activation Strategies
    - [ ] Event Bus Events
    - [X] View Events
    - [X] Element Events
    - [X] Timed Events (View Do only)
  - [ ] Action Elements
    - [ ] Action
    - [ ] Action Activator
    - [ ] Actions (action-bus event-listener)
    - [ ] Events (event-bus delegation)
  - [X] Listeners
    - [ ] Core
      - [ ] Routing
      - [ ] 💠Data
        - [ ] Register new provider
    - [ ] Available Add-ons
      - [ ] Analytics
      - [ ] Audio
      - [ ] Cookie
      - [ ] Elements
      - [ ] Session
      - [ ] Storage
      - [ ] UI
      - [ ] Video
    - [ ] Custom
      - [ ] Register new provider
- 🎧 Audio Elements
  - [X] How it works
  - [X] Installation
    - [ ] Simple Example
  - [ ] Extensions 
    - 🌠 Action System
      - [ ] Audio Actions
      - [ ] Audio Events
    - ✨ Presentation Component
      - [ ] Timed Action Example 
    - 💠 Data System
      - [ ] Audio Data Tokens
  - [ ] Advanced Examples
    - [X] Music Action Example 
    - [X] Sound Action Example 
    - [X] Music, with Timed Sounds Example   
- 📺 Video Elements
    - [ ] How it works
    - [ ] Installation
      - [ ] Native Example 
      - [ ] VimeJs Example
    - Extensions:
    - 🌠Action System 
      - [ ] Video Actions
      - [ ] Video Events
    - ✨ Presentation Component
      - [ ] Video as Timer   

- [ ] Analytics Element
  - [ ] Overview
  - [X] Installation
    - [ ] Example
  - Extensions:
    - 🌠Action System 
      - [ ] Custom Event Actions
    - ✨ Presentation Component
      - [ ] View-Time Reporting 
  - [X] Element Manipulation
    - [X] How it works
    - [X] Extends Core
      - [X] X-Attributes
        - [X] App
        - [X] Views
        - [X] Presentation
        - [X] Content
    - [X] Installation
    - [X] Action Listener
  - [X] UI System
    - [X] How it works
    - [X] Default Provider
      - [X] Installation
      - [X] Action Listener
        - [X] Set Theme
        - [X] Log
      - [X] Data Provider *
        - [X] Date
        - [X] Time
        - [X] Timezones
        - [X] Language
        - [X] Culture
        - [X] Random
    - [X] Custom Providers
      - [X] Roadmap
        - [X] Ionic
        - [X] Shoelace
        - [X] UI Kit
        - [X] Bootstrap
  
- [X] Advanced
- [X] Guides:
  - [X] Presentations
    - [X] Guided Navigation
    - [X] Conditional Decision Trees
    - [X] Timed Pages & Auto Next
    - [X] Media Timing
      - [X] Animations
      - [X] Video Components
      - [X] X-Attributes (if enabled)
  - [X] 100 Lighthouse Score
  - [X] Progressive Web Application
  - [X] Examples *
    - [X] Adaptive Survey
    - [X] Progressive Forms
    - [X] CYOA Short Story
    - [X] Interactive Video Experience
    - [X] Explanation Presentation
      - [X] Interactive Content
      - [X] Decision based results
      - [X] Video w/timed UI Updates
      - [X] Voice Over
      - [X] Background Music






TODO:
- [ ] Add view-time capturing to the router with a view-time event with seconds on that exact router
- [ ] Add presentation timer periodic time events if Analytics is enabled.
- [ ] Separate x-app into:
  - [ ] app router: n-app > n-app-page > n-app-page-prompt
  - [ ] event delegator and action listener: n-action-bus, n-event-bus
- [ ] Add n-app-offline (encapsulate a service-worker)
- [ ] x-content-share -> n-app-share