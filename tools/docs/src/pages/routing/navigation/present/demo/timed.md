# Present HTML Animation

This page is part of a guided-navigation system. The back and next are automatically defined based on the convention we discussed.

The above is done using special attributes that only work on a guided route ``n-view-prompt`

```html
<div class="card-media">
  <img id="step1" hidden n-in-time="1" n-out-time="9" src="https://via.placeholder.com/728x390.png?text=Step+1" />
  <img id="step2" hidden n-in-time="10" n-out-time="19" src="https://via.placeholder.com/728x390.png?text=Step+2" />
  <img id="step3" hidden n-in-time="20" n-out-time="29" src="https://via.placeholder.com/728x390.png?text=Step+3" />
</div>
<progress-bar color="primary" n-percentage-to="value"></progress-bar>

<p>Progress: <span n-percentage-to></span></p>

<div hidden n-int-time="0" n-in-class="fade-in" n-out-time="9" n-out-class="fade-out">
  <h1>Step 1 Stuff</h1>
  <p>Fake Step 1 copy.</p>
</div>

<div hidden n-in-time="10" n-in-class="fade-in" n-out-time="19" n-out-class="fade-out">
  <h1>Step 2 Stuff</h1>
  <p>Fake Step 2 copy.</p>
</div>

<div hidden n-in-time="20" n-in-class="fade-in" n-out-time="30" n-out-class="fade-out">
  <h1>Step 3 Stuff</h1>
  <p>Fake Step 3 copy.</p>
</div>
```
