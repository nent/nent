/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone } from '@angular/core';
import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';

import { Components } from '@nent/core';


export declare interface NAction extends Components.NAction {}
@ProxyCmp({
  inputs: ['command', 'topic'],
  methods: ['getAction', 'sendAction']
})
@Component({
  selector: 'n-action',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['command', 'topic']
})
export class NAction {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface NActionActivator extends Components.NActionActivator {}
@ProxyCmp({
  inputs: ['activate', 'debug', 'once', 'targetElement', 'targetEvent', 'time'],
  methods: ['activateActions']
})
@Component({
  selector: 'n-action-activator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['activate', 'debug', 'once', 'targetElement', 'targetEvent', 'time']
})
export class NActionActivator {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface NAppShare extends Components.NAppShare {}
@ProxyCmp({
  inputs: ['headline', 'text', 'url'],
  methods: ['share']
})
@Component({
  selector: 'n-app-share',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['headline', 'text', 'url']
})
export class NAppShare {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface NAppTheme extends Components.NAppTheme {}
@ProxyCmp({
  inputs: ['darkClass', 'display', 'targetElement']
})
@Component({
  selector: 'n-app-theme',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['darkClass', 'display', 'targetElement']
})
export class NAppTheme {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface NAppThemeSwitch extends Components.NAppThemeSwitch {}
@ProxyCmp({
  inputs: ['classes', 'inputId']
})
@Component({
  selector: 'n-app-theme-switch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['classes', 'inputId']
})
export class NAppThemeSwitch {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface NAudio extends Components.NAudio {}
@ProxyCmp({
  inputs: ['actions', 'dataProvider', 'debug', 'display', 'howlerVersion']
})
@Component({
  selector: 'n-audio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['actions', 'dataProvider', 'debug', 'display', 'howlerVersion']
})
export class NAudio {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface NAudioActionMusic extends Components.NAudioActionMusic {}
@ProxyCmp({
  inputs: ['command', 'topic', 'trackId', 'value'],
  methods: ['getAction', 'sendAction']
})
@Component({
  selector: 'n-audio-action-music',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['command', 'topic', 'trackId', 'value']
})
export class NAudioActionMusic {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface NAudioActionMusicLoad extends Components.NAudioActionMusicLoad {}
@ProxyCmp({
  inputs: ['deferLoad', 'discard', 'loop', 'mode', 'src', 'trackId'],
  methods: ['getAction', 'sendAction']
})
@Component({
  selector: 'n-audio-action-music-load',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['deferLoad', 'discard', 'loop', 'mode', 'src', 'trackId']
})
export class NAudioActionMusicLoad {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface NAudioActionSound extends Components.NAudioActionSound {}
@ProxyCmp({
  inputs: ['command', 'topic', 'trackId', 'value'],
  methods: ['getAction', 'sendAction']
})
@Component({
  selector: 'n-audio-action-sound',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['command', 'topic', 'trackId', 'value']
})
export class NAudioActionSound {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface NAudioActionSoundLoad extends Components.NAudioActionSoundLoad {}
@ProxyCmp({
  inputs: ['deferLoad', 'discard', 'mode', 'src', 'trackId'],
  methods: ['getAction', 'sendAction']
})
@Component({
  selector: 'n-audio-action-sound-load',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['deferLoad', 'discard', 'mode', 'src', 'trackId']
})
export class NAudioActionSoundLoad {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface NAudioSwitch extends Components.NAudioSwitch {}
@ProxyCmp({
  inputs: ['classes', 'dataProvider', 'inputId', 'setting']
})
@Component({
  selector: 'n-audio-switch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['classes', 'dataProvider', 'inputId', 'setting']
})
export class NAudioSwitch {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface NContentInclude extends Components.NContentInclude {}
@ProxyCmp({
  inputs: ['deferLoad', 'mode', 'resolveTokens', 'src', 'when']
})
@Component({
  selector: 'n-content-include',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['deferLoad', 'mode', 'resolveTokens', 'src', 'when']
})
export class NContentInclude {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface NContentMarkdown extends Components.NContentMarkdown {}
@ProxyCmp({
  inputs: ['deferLoad', 'mode', 'noCache', 'resolveTokens', 'src', 'when']
})
@Component({
  selector: 'n-content-markdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['deferLoad', 'mode', 'noCache', 'resolveTokens', 'src', 'when']
})
export class NContentMarkdown {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}

import { ContentReference as IContentReference } from '@nent/core/dist/types/components/n-content-reference/content-reference';
export declare interface NContentReference extends Components.NContentReference {}
@ProxyCmp({
  inputs: ['deferLoad', 'inline', 'module', 'noModule', 'scriptSrc', 'styleSrc', 'timeout'],
  methods: ['forceLoad']
})
@Component({
  selector: 'n-content-reference',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['deferLoad', 'inline', 'module', 'noModule', 'scriptSrc', 'styleSrc', 'timeout'],
  outputs: ['referenced']
})
export class NContentReference {
  /** This event is fired when the script and style
elements are loaded or timed out. The value for each
style and script will be true or false, for loaded
or timedout, respectively. */
  referenced!: IContentReference['reference'];
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['referenced']);
  }
}


export declare interface NContentRepeat extends Components.NContentRepeat {}
@ProxyCmp({
  inputs: ['debug', 'deferLoad', 'filter', 'items', 'itemsSrc', 'noCache', 'when']
})
@Component({
  selector: 'n-content-repeat',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['debug', 'deferLoad', 'filter', 'items', 'itemsSrc', 'noCache', 'when']
})
export class NContentRepeat {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface NContentReveal extends Components.NContentReveal {}
@ProxyCmp({
  inputs: ['animationDistance', 'delay', 'direction', 'duration', 'triggerDistance']
})
@Component({
  selector: 'n-content-reveal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['animationDistance', 'delay', 'direction', 'duration', 'triggerDistance']
})
export class NContentReveal {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface NContentShow extends Components.NContentShow {}
@ProxyCmp({
  inputs: ['when']
})
@Component({
  selector: 'n-content-show',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['when']
})
export class NContentShow {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface NContentTemplate extends Components.NContentTemplate {}
@ProxyCmp({
  inputs: ['deferLoad', 'text']
})
@Component({
  selector: 'n-content-template',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['deferLoad', 'text']
})
export class NContentTemplate {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface NData extends Components.NData {}
@ProxyCmp({
  inputs: ['debug', 'providerTimeout']
})
@Component({
  selector: 'n-data',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['debug', 'providerTimeout']
})
export class NData {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}

import { DataCookie as IDataCookie } from '@nent/core/dist/types/components/n-data-cookie/data-cookie';
export declare interface NDataCookie extends Components.NDataCookie {}
@ProxyCmp({
  inputs: ['name', 'skipConsent'],
  methods: ['registerProvider']
})
@Component({
  selector: 'n-data-cookie',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['name', 'skipConsent'],
  outputs: ['didConsent']
})
export class NDataCookie {
  /** This event is raised when the consents to cookies. */
  didConsent!: IDataCookie['didConsent'];
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['didConsent']);
  }
}


export declare interface NDataSession extends Components.NDataSession {}
@ProxyCmp({
  inputs: ['keyPrefix', 'name']
})
@Component({
  selector: 'n-data-session',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['keyPrefix', 'name']
})
export class NDataSession {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface NDataStorage extends Components.NDataStorage {}
@ProxyCmp({
  inputs: ['keyPrefix', 'name']
})
@Component({
  selector: 'n-data-storage',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['keyPrefix', 'name']
})
export class NDataStorage {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface NElements extends Components.NElements {}
@ProxyCmp({
  inputs: ['debug']
})
@Component({
  selector: 'n-elements',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['debug']
})
export class NElements {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface NPresentation extends Components.NPresentation {}
@ProxyCmp({
  inputs: ['analyticsEvent', 'debug', 'nextAfter', 'timerElement']
})
@Component({
  selector: 'n-presentation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['analyticsEvent', 'debug', 'nextAfter', 'timerElement']
})
export class NPresentation {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface NPresentationAction extends Components.NPresentationAction {}
@ProxyCmp({
  inputs: ['command', 'time', 'topic'],
  methods: ['getAction', 'sendAction']
})
@Component({
  selector: 'n-presentation-action',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['command', 'time', 'topic']
})
export class NPresentationAction {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}

import { PresentationTimer as IPresentationTimer } from '@nent/core/dist/types/components/n-presentation-timer/presentation-timer';
export declare interface NPresentationTimer extends Components.NPresentationTimer {}
@ProxyCmp({
  inputs: ['debug', 'deferLoad', 'display', 'duration', 'interval', 'timer'],
  methods: ['begin', 'stop']
})
@Component({
  selector: 'n-presentation-timer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['debug', 'deferLoad', 'display', 'duration', 'interval', 'timer'],
  outputs: ['ready']
})
export class NPresentationTimer {
  /** Ready event letting the presentation layer know it can
begin. */
  ready!: IPresentationTimer['ready'];
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ready']);
  }
}

import { NVideo as INVideo } from '@nent/core/dist/types/components/n-video/video';
export declare interface NVideo extends Components.NVideo {}
@ProxyCmp({
  inputs: ['debug', 'durationProperty', 'endEvent', 'readyEvent', 'targetElement', 'timeEvent', 'timeProperty', 'timer']
})
@Component({
  selector: 'n-video',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['debug', 'durationProperty', 'endEvent', 'readyEvent', 'targetElement', 'timeEvent', 'timeProperty', 'timer'],
  outputs: ['ready']
})
export class NVideo {
  /** Ready event letting the presentation layer know it can
begin. */
  ready!: INVideo['ready'];
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ready']);
  }
}


export declare interface NVideoSwitch extends Components.NVideoSwitch {}
@ProxyCmp({
  inputs: ['classes', 'dataProvider', 'inputId']
})
@Component({
  selector: 'n-video-switch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['classes', 'dataProvider', 'inputId']
})
export class NVideoSwitch {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface NView extends Components.NView {}
@ProxyCmp({
  inputs: ['contentSrc', 'debug', 'exact', 'mode', 'pageTitle', 'path', 'resolveTokens', 'route', 'scrollTopOffset', 'src', 'transition'],
  methods: ['getChildren']
})
@Component({
  selector: 'n-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['contentSrc', 'debug', 'exact', 'mode', 'pageTitle', 'path', 'resolveTokens', 'route', 'scrollTopOffset', 'src', 'transition']
})
export class NView {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface NViewLink extends Components.NViewLink {}
@ProxyCmp({
  inputs: ['activeClass', 'debug', 'exact', 'path', 'strict']
})
@Component({
  selector: 'n-view-link',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['activeClass', 'debug', 'exact', 'path', 'strict']
})
export class NViewLink {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface NViewLinkBack extends Components.NViewLinkBack {}
@ProxyCmp({
  inputs: ['text']
})
@Component({
  selector: 'n-view-link-back',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['text']
})
export class NViewLinkBack {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface NViewLinkList extends Components.NViewLinkList {}
@ProxyCmp({
  inputs: ['activeClass', 'excludeRoot', 'itemClass', 'listClass', 'mode']
})
@Component({
  selector: 'n-view-link-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['activeClass', 'excludeRoot', 'itemClass', 'listClass', 'mode']
})
export class NViewLinkList {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface NViewLinkNext extends Components.NViewLinkNext {}
@ProxyCmp({
  inputs: ['text']
})
@Component({
  selector: 'n-view-link-next',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['text']
})
export class NViewLinkNext {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface NViewNotFound extends Components.NViewNotFound {}
@ProxyCmp({
  inputs: ['pageTitle', 'scrollTopOffset', 'transition']
})
@Component({
  selector: 'n-view-not-found',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['pageTitle', 'scrollTopOffset', 'transition']
})
export class NViewNotFound {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface NViewPrompt extends Components.NViewPrompt {}
@ProxyCmp({
  inputs: ['contentSrc', 'debug', 'exact', 'mode', 'pageTitle', 'path', 'resolveTokens', 'route', 'scrollTopOffset', 'transition', 'visit', 'when']
})
@Component({
  selector: 'n-view-prompt',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['contentSrc', 'debug', 'exact', 'mode', 'pageTitle', 'path', 'resolveTokens', 'route', 'scrollTopOffset', 'transition', 'visit', 'when']
})
export class NViewPrompt {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface NViews extends Components.NViews {}
@ProxyCmp({
  inputs: ['root', 'scrollTopOffset', 'startDelay', 'startPath', 'transition']
})
@Component({
  selector: 'n-views',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['root', 'scrollTopOffset', 'startDelay', 'startPath', 'transition']
})
export class NViews {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}
