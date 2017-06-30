# meta.js
meta.js 为 Javascript 语言扩充了一些元编程功能，并使其更像是一个基于类的语言。

## 如何使用
我们建议使用最新的 es6 语法来定义类，使用 .new 方法来生成实例。
``` javascript
class Person {}
let p = Person.new();
```

## 特性
### 得到类
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

### 得到类的实例方法
``` javascript
Animal.instanceMethods;   // => ["constructor", "walk"]
```
这里的实例方法并不包含父类的实例方法。

### 得到对象的方法
``` javascript
man.methods;   // => ["constructor", "walk"]
```
这里的实例方法并不包含父类的实例方法。如果有需要可以加上。

### 得到对象的属性
``` javascript
man.instanceVariables;  // => ["name", "_origin"]
```
_origin 是 meta.js 内部的一个变量，会在后面说明。

### 得到父类
``` javascript
class Cat extends Animal {
  constructor(name) {
    super(name);
  }
}
let kitty = Cat.new("kitty");
kitty.class.superclass.name;   // => "Animal"
```

### 打开类，为类扩充方法
由于 Javascript 不能打开类，因此只能通过变通的方法实现。
``` javascript
Cat.defineMethod("meow", function() {
  console.log(`${this.name} meow`);
});
kitty.meow();   // => "kitty meow"
```
也许会问这和 `Cat.prototype.meow = function() {...}` 有什么区别。这样做隐藏了 prototype 属性，以更加语义化的方法定义了方法，是新标准所鼓励的。

### 删除方法
``` javascript
Cat.deleteMethod("meow");
kitty.meow();   // => error!
```
删除方法只删除自己身上的方法，而不删除原型链上的方法。如果有需要可以加上。

### 别名方法
``` javascript
Animal.aliasMethod("oldWalk", "walk");
Animal.defineMethod("walk", function() {
  console.log("start walk");
  this.oldWalk();
  console.log("end walk");
});
man.walk();   // => "start walk\n jtwang walks\n end walk"
```
这里通过别名实现了环绕方法，可用于 AOP 。

### 幽灵方法 method missing
``` javascript
class Entity {
  methodMissing(name, args) {
    console.log(`call method ${name} with args: ${args.join(',')}`);
  }
}
let e = Entity.new();
e.arbitrarymethod(1,2,3);   // => "call method arbitrarymethod with args: 1,2,3"
```
幽灵方法是通过 es6 的 proxy 实现的，因此使用 `new Entity()` 得到的对象不包含这个特性。你也可以使用 `e._origin` 得到背后的对象。
幽灵方法的一个副作用是，由于 Javascript 中属性和方法是一样的，调用 `e.arbitraryproperty` 会得到一个 function 而不是 undefined 。

##  
meta.js 的代码十分简单，如有问题或建议欢迎 issue 或 pull request 。
