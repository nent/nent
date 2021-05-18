
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


-  📱 App Elements    
    - [ ] Overview
    - [X] Components
      - [X] Theme Detection & Controls
      - [ ] Custom Component Integrations
      - [X] Native Share
      - [ ] Analytics 
         - [ ] Overview
         - [X] Installation
           - [ ] Example
         - Extensions:
           - 🌠Action System 
             - [ ] Custom Event Actions
           - ✨ Presentation Component
             - [ ] View-Time Reporting 
      - [ ] PWA 
        - [ ] Checks in dev-mode
        - [ ] Add / Warn about Required Tags
          - [ ] Service Worker
          - [ ] Handles manifest.json
          - [ ] Sets Up Offline  
    - [X] Default Provider
      - [X] Installation
      - [X] Action Listener
        - [X] Set Theme
        - [X] Log
    - [X] Custom Providers
      - [ ] Road-map
        - [ ] Ionic
        - [ ] Shoelace
        - [ ] UI Kit
        - [ ] Bootstrap
    - [ ] Data Provider *
      - [ ] Date
      - [ ] Time
      - [ ] Timezones
      - [ ] Language
      - [ ] Culture
      - [ ] Random
        - 
- 🌠 Action System
  - [X] How it works
    - [X] Activation
    - [X] Listeners
  - [X] Activation Strategies
    - [ ] Event Bus Events
    - [X] View Events
    - [X] Element Events
    - [X] Timed Events (View Do only)
  - [X] Action Elements
    - [X] Action
    - [X] Action Activator
    - [X] Actions (action-bus event-listener)
    - [X] Events (event-bus delegation)
  - [X] Listeners    
      - [X] Custom
      - 
- 📑 Content Elements
  - [X] Overview
  - [X] Components
    - [X] Content Include
    - [X] Content Template
    - [X] Content Repeat
    - [X] Content Markdown
    - [X] Content Reveal    - 
    - [X] Content Show
    - [X] Content Template
    - 
- 🔀 Routing
  - [X] How it works
  - [ ] Installation
    - [ ] Components
      - [ ] Views 
      - [ ] View
      - [ ] View Prompt *
    - [ ] Simple Example
  - [X] Lazy Routes
    - - [X] Example
  - [X] Child Routes
    - [X] Nested vs Flat
    - - [X] Example  
  - [ ] Required Routes 
    - [ ] Example
  - 🧭 Navigation
    - [X] Overview
    - [ ] Navigation Elements    
      - [ ] View Link
      - [ ] View Link Next (encapsulate 'get-next' from siblings)
      - [ ] View Link Back (history back, or previous sibling)
      - [ ] View Link List
        - [ ] Ancestors (breadcrumbs)
        - [ ] Children (sub-nav)
        - [ ] Siblings (way-finding, progress)
  - [X] Extensions:
    + 🌠 Action System:
      - [X] Navigation Actions
    + 💠 Data System:
      - [X] Route Token Resolution
      - [X] Route Data Tokens
      - [X] Conditional Route Prompts
      - [X] Dynamic Route

- 💠 Data System
  - [X] How it works
  - [X] Installation
  
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


  - [X] Elements Extension
    - [ ] How it works
    - [ ] Extends Core
      - [X] X-Attributes
        - [ ] App
        - [ ] Views
        - [ ] Presentation
        - [ ] Content
    - [ ] Installation
    - [ ] Action Listener
  
       

  
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
    - [X] Choose-your-own-adventure-style Short Story
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
- [ ] Separate n-views into:
  - [ ] app router: n-app > n-app-page > n-app-page-prompt
  - [ ] event delegator and action listener: n-action-bus, n-event-bus
- [ ] Add n-app-offline (encapsulate a service-worker)
- [ ] n-app-share -> n-app-share