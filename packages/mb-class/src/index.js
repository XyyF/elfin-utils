/**
 * javascript 类工厂
 * create at 2022/02/18
 */

function mbClass(methods) {
  if (methods === undefined || methods === null) return function () { };
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
  // 原型链属性值(包括constructor)
  if (!Ctor.prototype) Ctor.prototype = Object.create(Object.prototype);
  Object.defineProperties(Ctor.prototype, methodProperties);

  return Ctor;
}

var res = {
  constructor: function(name) {
    console.log(1111)
    this._name = name
  },
  _name: '',
  setName(name) {
    this._name = name;
  },
  speak() {
    console.log(this._name + ' says...')
  }
}
var Pet = mbClass(res)
var pet = new Pet('Garfield')
pet.setName('123');
pet.speak()