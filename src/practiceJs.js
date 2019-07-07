function Person(first, last){
    this.first = first;
    this.last = last;
}
// Person.prototype是一个可以被Person的所有实例共享的对象
// 它是一个名叫原型链的查询链的一部分
Person.prototype.fullName = function(){
    return this.first + ' ' + this.last;
}
Person.prototype.fullNameReversed = function(){
    return this.last + ' ' + this.first; 
}

//...args为剩余参数
function trivialNew(constructor,...args){
    var o = {}; //创建一个对象
    constructor.apply(o, args);
    return o;
}

var bill = trivialNew(Person, 'william', 'Orange');
var bill = new Person('William', 'Orange');

//内部函数
function parentFunc(){
    var a = 1;

    function nestedFunc(){
        var b = 4;
        return a + b;
    }
    return nestedFunc();  //5
}

//闭包:一个函数与其被创建时所带有的作用域对象的集合
//作用域对象组成了一个名为作用连的（调用）链
function makeAdder(a){
    return function(b){
        return a+b;
    }
}
var add5 = makeAdder(5);
var add20 = makeAdder(20);
add5(6) //11
add20(7)//27