```html
<n-presentation>
  <n-video analytics
    target-element="vm-player"
    time-event="vmCurrentTimeChange"
    end-event="vmPlaybackEnded"
    ready-event="vmPlaybackReady"
    time-property="currentTime"
    duration-property="duration">
    <vm-player no-controls>
      <vm-video>
        <source cross-origin="anonymous"
          data-src="https://cdn.videvo.net/videvo_files/video/premium/video0290/small_watermarked/_LightShow86_preview.webm"
          type="video/webm" />
      </vm-video>
      <vm-default-ui></vm-default-ui>
    </vm-player>
  </n-video>
  <progress max="1.0"
    value="0"
    style="width: 100%"
    n-percentage-to="value"></progress>
  <h2>Progress: <span n-percentage-to></span></h2>
  <div hidden
    n-in-time="0"
    class="fade-in"
    n-out-time="3">
    <h3>First...</h3>
  </div>
  <div hidden
    n-in-time="3"
    class="fade-in"
    n-out-time="6">
    <h3>THEN...</h3>
  </div>
  <div hidden
    n-in-time="6"
    class="fade-in"
    n-out-time="10">
    <h3>Finally...</h3>
  </div>
</n-presentation>
```