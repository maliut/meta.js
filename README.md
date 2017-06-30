# meta.js
meta.js offers meta-programming skills for Javascript and make it more like a class-based language.

[中文文档](README_chn.md)

## How to use
We suggest to define class by es6 syntax, and use .new factory method to create instance.
``` javascript
class Person {}
let p = Person.new();
```

## Features
### Get the class of intance
``` javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  walk() {
    console.log(`${this.name} walks`);
  }
}

let man = Animal.new("jtwang");
man.class.name;   // => "Animal"
```

### Get instance methods of class
``` javascript
Animal.instanceMethods;   // => ["constructor", "walk"]
```
Methods in superclass are not included.

### Get methods of instance
``` javascript
man.methods;   // => ["constructor", "walk"]
```
Methods in superclass are not included. Can add them if in need.

### Get properties of instance
``` javascript
man.instanceVariables;  // => ["name", "_origin"]
```
*_origin* is an inner variable of meta.js. Will explain it later.

### Get superclass
``` javascript
class Cat extends Animal {
  constructor(name) {
    super(name);
  }
}
let kitty = Cat.new("kitty");
kitty.class.superclass.name;   // => "Animal"
```

### Extend a class
Javascript cannot open class like Ruby, so use *defineMethod* instead.
``` javascript
Cat.defineMethod("meow", function() {
  console.log(`${this.name} meow`);
});
kitty.meow();   // => "kitty meow"
```
Someone may ask what's the difference between it and `Cat.prototype.meow = function() {...}`. It hides the *prototype* and defines methods in a more meaningful way, which is encouraged by es6 standard.

### Delete methods
``` javascript
Cat.deleteMethod("meow");
kitty.meow();   // => error!
```
It does not delete method in superclass. Can add the function if in need.

### Alias method
``` javascript
Animal.aliasMethod("oldWalk", "walk");
Animal.defineMethod("walk", function() {
  console.log("start walk");
  this.oldWalk();
  console.log("end walk");
});
man.walk();   // => "start walk\n jtwang walks\n end walk"
```
This example use alias to implement around method, and can be used in AOP.

### Method missing
``` javascript
class Entity {
  methodMissing(name, args) {
    console.log(`call method ${name} with args: ${args.join(',')}`);
  }
}
let e = Entity.new();
e.arbitrarymethod(1,2,3);   // => "call method arbitrarymethod with args: 1,2,3"
```
It's implemented by Proxy in es6, so use `new Entity()` will lose this feature. You can also use `e._origin` to get the object behind proxy.
The side effect is, because function is also a propery of object in Javascript, call `e.arbitraryproperty` will get a function rather than *undefined*.

##  
The code is easy in meta.js, and feel free to raise issues or pull request for any problems and suggestions.
