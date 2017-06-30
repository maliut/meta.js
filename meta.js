'use strict'
// 得到一个对象的类，即原型链上一步的构造器（ js 中类即构造器）
Reflect.defineProperty(Object.prototype, "class", {
    get: function() {   // 不用箭头函数，否则 this 会绑定定义时所在的 this
        return Reflect.getPrototypeOf(this).constructor;
    }
});

// 得到一个类的实例方法（不包含父类）
// 实例方法定义在类的 prototype 上，因此是 function 才有的属性
Reflect.defineProperty(Function.prototype, "instanceMethods", {
    get: function() {
        return Reflect.ownKeys(this.prototype);
    }
});

// 得到一个对象的方法，即对象所在类的实例方法
Reflect.defineProperty(Object.prototype, "methods", {
    get: function() {   
        return this.class.instanceMethods;
    }
});

// 得到一个对象的实例属性，实例属性定义在对象自身上
Reflect.defineProperty(Object.prototype, "instanceVariables", {
    get: function() {   
        return Reflect.ownKeys(this);
    }
});

// 注意：js 中方法和属性其实是同一种东西，并不一定 methods 方法得到的都是 Function
// 只是一般来说属性定义在对象自身上，而方法定义在原型上，所以如此命名
// 根据 es6 的标准，尽可能隐藏原型的存在，而向传统的类定义模式靠拢
// 因此也不建议使用除 class 以外的方法定义类

// 打开类
Function.prototype.defineMethod = function(name, value) {
    if (typeof value !== typeof Function) { // 只能向类扩充方法
        throw "meta.js: Can only extend functions in class.";
    }
    this.prototype[name] = value;
    return true;
};

// superclass
Reflect.defineProperty(Function.prototype, "superclass", {
    get: function() {
        return Reflect.getPrototypeOf(this);
    }
});

// 祖先链
// todo

// 动态派发、定义方法
// a["methodname"] 即可

// methodMissing
// 需要 proxy 实现
// 本来想通过改原型对象 object.prototype 但是不行，所以利用工厂方法
// 利用 A.new() 生成对象， .origin 属性可以得到内部的真实对象 
Function.prototype.new = function(...constructor_args) {
    // 在内部定义 proxy handler
    const handler = {
        get: function(target, property) {
            if (property in target) {
                return target[property];
            } else {
                return function(...args) {
                    target.methodMissing(property, args);
                }
            }
        }
    };
    let origin = new this(...constructor_args);
    let proxy = new Proxy(origin, handler);
    proxy._origin = origin;
    return proxy;
};

// respond_to, respond_to_missing
// 有需要再写

// 删除方法
Function.prototype.removeMethod = function(name) {
    if (typeof this.prototype[name] !== typeof Function) { 
        return false;
    }
    Reflect.deleteProperty(this.prototype, name);
    return true;
};
// undefMethod 删除原型链上所有方法，有需要再写

// 类宏：不支持

// 别名方法
Function.prototype.aliasMethod = function(new_name, old_name) {
    if (typeof this.prototype[old_name] !== typeof Function) { 
        throw `meta.js: No such method: ${old_name}.`;
    }
    this.prototype[new_name] = this.prototype[old_name];
    return true;
};
