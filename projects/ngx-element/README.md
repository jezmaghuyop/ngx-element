[![Tests CI](https://github.com/jezmaghuyop/ngx-element/actions/workflows/nodejs.yml/badge.svg?branch=features%2Fangular-12)](https://github.com/jezmaghuyop/ngx-element/actions/workflows/nodejs.yml)
## Disclaimer
this is just an updated version that I personally modified for my project needs. 
I've updated the library to use Angular 12, the original package is [here ngx-element](https://github.com/Apaq/ngx-element) by [Michael Krog](https://github.com/michaelkrog) go check it out.
# NgxElement

NgxElement enables to lazy load Angular components in non-angular applications.
The library will register a custom element to which you can pass an attribute to specify what component you want to load.

It's a great way to use Angular in your CMS platform in an efficient manner.

## Install Angular Elements
This library depends on Angular Elements. You can install it by running:
```
$ ng add @angular/elements
```

## Installing the library
```
$ npm install @jezmaghuyop/ngx-lazy-element
```

## Usage
### 1) Configure the Module containing the lazy loaded component

First of all, expose the Angular Component that should be loaded via a customElementComponent property.

```
...
@NgModule({
  declarations: [TalkComponent],
  ...
  exports: [TalkComponent],
  entryComponents: [TalkComponent]
})
export class TalkModule {
  customElementComponent: Type<any> = TalkComponent;
  ...
}
```

### 2) Define the lazy component map in your AppModule
Just like with the Angular Router, define the map of component selector and lazy module.

```
const lazyConfig = {
  definitions: [
    {
      selector: 'talk',
      loadChildren: () => import('./talk/talk.module').then(m => m.TalkModule)
    }
  ],
  prefix: 'ws'
];


@NgModule({
  ...,
  imports: [
    ...,
    NgxElementModule.forRoot(lazyConfig)
  ],
  ...
})
export class AppModule {
  ...
  ngDoBootstrap() {}
}
```

### 3) Use the lazy loaded component
You can load your Angular component by adding an `<ngx-element>` tag to the DOM in your non-angular application like follows:

```
<ws-talk
  title="Angular Elements"
  description="How to write Angular and get Web Components"
  speaker="Bruno">
</ws-talk>
```

### 4) Listen to events
You can listen to events emitted by Angular components.

Add an `@Output` event to your component:

```
...
@Output() tagClick: EventEmitter<string> = new EventEmitter();
...
```

Then add an event listener to the `tagClick` event on the appropiate `<ngx-element>` element:

```
const talks = document.querySelector('ws-talk');
talks.addEventListener('tagClick', event => {
  const emittedValue = event.detail;
  ...
});
```
