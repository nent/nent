```html
<n-presentation>
  <n-video target-element="player">
    <video>
      <source cross-origin="anonymous"
        src="https://cdn.videvo.net/videvo_files/video/premium/video0290/small_watermarked/_LightShow86_preview.webm"
        type="video/webm" />
    </video>
  </n-video>
  <div hidden
    n-in-time="0"
    class="fade-in"
    n-out-time="3">
    <h3>First</h3>
    <p>This content appears for the first 3 seconds.</p>
  </div>
  <div hidden
    n-in-time="3"
    class="fade-in"
    n-out-time="6">
    <h3>THEN...</h3>
    <p>This content appears for the until 6 seconds has passed.</p>
  </div>
  <div hidden
    n-in-time="6"
    class="fade-in"
    n-out-time="10">
    <h3>Finally...</h3>
    <p>This content shows until the end.</p>
  </div>
</n-presentation>
```