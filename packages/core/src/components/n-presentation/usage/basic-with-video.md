```html
<n-presentation>
  <n-video src="my.mov">
  </n-video>
  <n-presentation-action time="2" 
    topic="elements"
    command="add-class" 
    data-selector="#animation"
    data-class=".fadeIn">
  </n-presentation-action>
</n-presentation>
```

> ℹ️ Note: When using a video, the timed data from the video is used as the timing-source. This means scrub, pause and skip are all respected with the timed actions and elements.