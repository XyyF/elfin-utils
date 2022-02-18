/**
 * javascript 类工厂
 * create at 2022/02/18
 */

function mbClass(methods) {
  if (methods === undefined || methods === null) return function() {};
  return createClass(methods);
}

/**
 * 创建class
 * @param {object} methods 方法集合
 */
function createClass(methods) {
  // 属性描述符集合
  let methodProperties = {};
  let names = Object.getOwnPropertyNames(methods);
  for (let i = 0, j = names.length; i < j; i++) {
    let name = names[i];
    let property = Object.getOwnPropertyDescriptor(methods, name);
    methodProperties[name] = property;
  }

  let Ctor;
  // 构造函数
  if (methodProperties.hasOwnProperty('constructor')) {
    Ctor = methodProperties.constructor.value;
    if (typeof Ctor !== 'function') throw new Error('constructor is not function');
  } else {
    Ctor = function () { };
    methodProperties.constructor = { value: Ctor, writable: true, configurable: true };
  }
  // 原型链
  Ctor.prototype = Object.create(Object.prototype);
  // 原型链属性值(包括constructor)
  Object.defineProperties(Ctor.prototype, methodProperties);

  return Ctor;
}

var res = {
  // constructor: null,
  _name: '',
  setName(name) {
    this._name = name;
  },
  speak: function () {
    console.log(this._name + ' says...')
  }
}
Object.defineProperty(res, 'constructor', {
  get() {
    return 123;
  }
})
var Pet = mbClass(res)
var pet = new Pet('Garfield')
pet.setName('123');
pet.speak()