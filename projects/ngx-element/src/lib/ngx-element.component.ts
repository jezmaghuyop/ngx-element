import {
  Component,
  ComponentFactory,
  OnInit,
  Input,
  Type,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  OnDestroy,
  EventEmitter,
  ElementRef,
  Injector,
  Inject,
  ChangeDetectorRef,
  NgZone
} from '@angular/core';
import {NgxElementService} from './ngx-element.service';
import {merge, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import { LazyComponentRegistry, LAZY_CMPS_REGISTRY } from './tokens';

@Component({
  template: `
    <ng-template #container></ng-template>
    <ng-content></ng-content>
  `,
  styles: []
})
export class NgxElementComponent implements OnInit, OnDestroy {

  private ngElementEventsSubscription: Subscription;
  @Input() selector: string;
  @ViewChild('container', {read: ViewContainerRef}) container;

  componentRef;
  componentToLoad: Type<any>;
  componentFactoryResolver: ComponentFactoryResolver;
  injector: Injector;
  refInjector: Injector;

  constructor(
    private ngxElementService: NgxElementService,
    private elementRef: ElementRef,
    private ngZone: NgZone,
    @Inject(LAZY_CMPS_REGISTRY) private registry: LazyComponentRegistry
  ) { }

  /**
   * Add input proxies of a lazy loaded and dynamically instantiated Angular component
   * and set the on the actual element when it is ready.
   */
     private setProxiedInputs(factory: ComponentFactory<any>): void {
      factory.inputs.forEach(input => {
        const comRef = this.componentRef;
        
        comRef.instance[input.propName] = this.elementRef.nativeElement[input.propName];
        Object.defineProperty(this.elementRef.nativeElement, input.propName, {
          get(this: NgxElementComponent) {
            return (comRef.instance as any)[input.propName];
          },
          set(this: NgxElementComponent, value: any) {
            const setter = () => (comRef.instance as any)[input.propName] = value;
            NgZone.isInAngularZone()
            ? setter()
            : this.ngZone.run(setter);
            (comRef.instance as any)[input.propName] = value;
          }
        });
      });
    }

  /**
   * Subscribe to event emitters of a lazy loaded and dynamically instantiated Angular component
   * and dispatch them as Custom Events on the NgxElementComponent that is used in a template.
   */
  private setProxiedOutputs(factory: ComponentFactory<any>): void {
    const eventEmitters = factory.outputs.map(({propName, templateName}) => {
      const emitter = (this.componentRef.instance as any)[propName] as EventEmitter<any>;
      return emitter.pipe(map((value: any) => ({name: templateName, value})));
    });
    const outputEvents = merge(...eventEmitters);
    this.ngElementEventsSubscription = outputEvents.subscribe(subscription => {
      const customEvent = document.createEvent('CustomEvent');
      customEvent.initCustomEvent(subscription.name, false, false, subscription.value);
      this.elementRef.nativeElement.dispatchEvent(customEvent);
    });
  }

  ngOnInit(): void {
    const selector = this.resolveSelector();

    this.ngxElementService.getComponentToLoad(selector).subscribe(event => {
      this.componentToLoad = event.componentClass;
      this.componentFactoryResolver = this.ngxElementService.getComponentFactoryResolver(this.componentToLoad);
      this.injector = this.ngxElementService.getInjector(this.componentToLoad);

      const attributes = this.getElementAttributes();
      this.createComponent(attributes);
    });
  }

  createComponent(attributes) {
    const factory = this.componentFactoryResolver.resolveComponentFactory(this.componentToLoad);

    if (factory.selector != 'ng-component') {
      console.warn(`Cannot lazy load component that defines ${factory.selector} as a selector, because the selector is
                    already reserved in the LazyComponentRegistry.`);
      return;
    }

    this.refInjector = Injector.create({ providers: [{ provide: this.componentToLoad, useValue: this.componentToLoad }] });

    const projectNodes = this.extractProjectedNodes(factory);
    this.container.clear();
    this.componentRef = this.container.createComponent(factory, 0, this.refInjector, projectNodes);

    this.setAttributes(attributes);
    this.listenToAttributeChanges();
    this.setProxiedInputs(factory);
    this.setProxiedOutputs(factory);
  }

  setAttributes(attributes) {
    attributes.forEach(attr => {
      this.componentRef.instance[attr.name] = attr.value;
    });
  }

  getElementAttributes() {
    const attrs = this.elementRef.nativeElement.attributes;
    const attributes = [];

    for (let attr, i = 0; i < attrs.length; i++) {
      attr = attrs[i];

      attributes.push({
        name: this.camelCaseAttribute(attr.nodeName),
        value: attr.nodeValue
      });
    
    }

    return attributes;
  }

  camelCaseAttribute(attribute: string) {
    const attr = attribute.replace('data-', '');
    const chunks = attr.split('-');

    if (chunks.length > 1) {
      return chunks[0] + chunks.slice(1).map(chunk => chunk.replace(/^\w/, c => c.toUpperCase())).join('');
    }

    return attr;
  }

  listenToAttributeChanges() {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes') {
          const attributes = this.getElementAttributes();
          this.setAttributes(attributes);
        }
      });
    });

    observer.observe(this.elementRef.nativeElement, {
      attributes: true
    });
  }

  ngOnDestroy() {
    if(this.componentRef != null) {
      this.componentRef.destroy();
    }

    if(this.ngElementEventsSubscription != null) {
      this.ngElementEventsSubscription.unsubscribe();
    }
  }

  private extractProjectedNodes(factory: ComponentFactory<any>) {
    const projectNodes = [];
    factory.ngContentSelectors.forEach(selector => {
      const el = this.elementRef.nativeElement as HTMLElement;
      const content = el.querySelectorAll(selector);
      if (content) {
        const nodes = [];
        content.forEach(c => {
          const p = c.parentElement;
          nodes.push(p.removeChild(c));
        });
        projectNodes.push(nodes);
      }
    });
    return projectNodes;
  }

  private resolveSelector() {
    const tagName = this.elementRef.nativeElement.localName;
    return tagName.substring(this.registry.prefix.length + 1);
  }
}
