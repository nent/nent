import { Component, Element, h, Prop } from '@stencil/core'

/**
 * Use this component to add a little flair to any HTML.
 * It creates an entrance animation using the configured
 * attributes to add pop to any page.
 * @system content
 */
@Component({
  tag: 'x-content-reveal',
  styleUrl: 'x-content-reveal.css',
  shadow: true,
})
export class XContentReveal {
  @Element() el!: HTMLXContentRevealElement
  private subject!: HTMLDivElement

  /**
   * Direction the element moves when animating in
   */
  @Prop() direction: 'up' | 'down' | 'right' | 'left' = 'up'

  /**
   * How long to delay the animation (ms)
   */
  @Prop() delay: number = 0

  /**
   * How long the animation runs (ms)
   */
  @Prop() duration: number = 500

  /**
   * How far the element moves in the animation (% of element width/height)
   */
  @Prop() animationDistance: string = '30%'

  /**
   * How much of the element must be visible before it animates (% of element height)
   */
  @Prop() triggerDistance: string = '33%'

  private io?: IntersectionObserver

  componentDidLoad() {
    this.addIntersectionObserver()
    const animationDistance =
      this.direction === 'right' || this.direction === 'down'
        ? '-' + this.animationDistance
        : this.animationDistance
    this.subject.style.setProperty('--distance', animationDistance)
  }

  private addIntersectionObserver() {
    this.io = new window.IntersectionObserver(
      (data: any) => {
        if (data[0].isIntersecting) {
          this.subject.classList.add(`slide-${this.direction}`)
          this.removeIntersectionObserver()
        }
      },
      {
        threshold: parseFloat(this.triggerDistance) / 100,
      },
    )
    this.io.observe(this.subject)
  }

  private removeIntersectionObserver() {
    this.io?.disconnect()
  }

  render() {
    return (
      <div
        ref={el => (this.subject = el!)}
        class={'x-reveal'}
        style={{
          animationDuration: `${this.duration}ms`,
          animationDelay: `${this.delay}ms`,
        }}
      >
        <slot />
      </div>
    )
  }
  disconnectedCallback() {
    this.removeIntersectionObserver()
  }
}
