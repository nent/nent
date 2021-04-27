```html
<n-presentation analytics>
  
  <h2>Element Timer: <n-presentation-timer debug display
    duration="30"></n-presentation-timer></h2>

  <div n-in-time="0"
    n-out-time="10">
    <h3>Step 1 Stuff</h3>
    <img id="step1"
      style="width:100%"
      src="https://via.placeholder.com/728x390.png?text=Step+1" />
    <p>Fake Step 1 copy.</p>
  </div>
  <div hidden
    n-in-time="10"
    n-out-time="20">
    <h3>Step 2 Stuff</h3>
    <img id="step2"
      style="width:100%"
      src="https://via.placeholder.com/728x390.png?text=Step+2" />
    <p>Fake Step 2 copy.</p>
  </div>
  <div hidden
    n-in-time="20">
    <h3>Step 3 Stuff</h3>
    <img id="step3"
      style="width:100%"
      src="https://via.placeholder.com/728x390.png?text=Step+3" />
    <p>Fake Step 3 copy.</p>
  </div>
  <progress max="1.0"
    value="0"
    style="width: 100%"
    n-percentage-to="value"></progress>
  <h2>Progress: <span n-percentage-to></span></h2>
</n-presentation>
```
