/**
 * test Constructor.extend() calls with "static" 
 *
 *  author:   @dfkaye - david.kaye
 *	date:	2012-10-30
 * 
 * This short suite explores the anti-pattern of attempting to inherit statics.
 *
 * The example is taken from "Programming in CoffeeScript" by Mark Bates, 
 * Addison-Wesley, pp. 147-150, where the author shows that CoffeeScript does 
 * not support static inheritance through the __super__  * keyword.  However, 
 * the example contains a more fundamental problem NOT specific to CoffeeScript.
 */

var test = require('tape');
var Constructor = require('../../constructor.js').Constructor;

// our base  and inheriting constructors
//var Employee, Manager;

function Employee() {
  Employee.hire(this);
};

Employee.hire = function hire(employee) {
  this.employees || (this.employees = []);
  return this.employees.push(employee);
};

Employee.total = function total() {
  return this.employees.length;
};

/*
 * First test that the Employee creation works.
 */
test('create employees', function (t) {

  var total = 4;
  
  for (var i = 0; i < total; i += 1) {
    new Employee();
  }
  
  t.strictEquals(Employee.total(), total);
  t.end();
});

/*
 * Now inherit from Employee
 */
var Manager = Constructor.extend(Employee, {
  constructor: function Manager() {
    this.__super__();
  },
  type: 'Manager'
});

test('inherit static', function (t) {    

  /*
   * The book's example shows the following CoffeeScript
   *
   *   class Manager extends Employee
   * 
   *     @total: -> 
   *       console.log "0 managers"
   *       super
   *
   * and the JavaScript generated by the transpiler
   *
   *   Manager.total = function total() {
   *     return Manager.__super__.constructor.total.apply(this, arguments);
   *   };
   *
   * This fails with an error message:
   *   
   *    TypeError: this.allEmployees is undefined
   *
   * The problem here is that the `this` passed to total() via apply() refers to 
   * the Manager *class* rather than a Manager instance. CoffeeScript's 
   * `__extends` method makes no attempt to determine where super is referenced,
   * assuming that all calls to super apply to this.  And because Manager 
   * does NOT inherit the static `allEmployees` array from Employee, passing 
   * `this` to the apply() call on total(), *rather than just calling total() 
   * directly*, is incorrect.
   
   Either of these calls works
   
      return Manager.__super__.constructor.total.apply(Employee, arguments);
      return Manager.__super__.constructor.total.apply(Manager.__super__.constructor, arguments);
      
   But if the method is a no arg, then what we are doing using apply()? Just 
   call it
   
      return Manager.__super__.constructor.total();

   * In the case of Constructor.js, you can call the desired method directly, 
   * as below:
   */
  Manager.total = function total() {
    return this.__super__.constructor.total();
  };

  /*
   * But now see that when verifying Manager creation, we're actually 
   * reaching for the wrong scope - which is on the Employee, rather than the 
   * Manager.  At the static level - the previously created Employee count 
   * will be incremented, rather than specific to the Manager constructor.
   */
  
  var employeeCount = Employee.total();
  var managerCount = 4;
  t.strictEquals(employeeCount, managerCount, 'should have 4 employees initially');
  
  // create 4 Managers
  for (var i = 0; i < managerCount; i += 1) {
    new Manager();
  }
  
  t.strictEquals(Employee.total(), managerCount + employeeCount, 'should have 8 employees');

  // passes!  Manager.total() already gets the initial total from employee because
  // employee.total does not check for
  t.strictEquals(Manager.total(), Employee.total());
  
  t.end();
});

test('brute force instanceof static inheritance', function (t) {

  /*
   *  We could try to fix this by checking object types in the __super__'s 
   * employees collection...
   */
  Manager.total = function total() {
  
    var employees = this.__super__.prototype.constructor.employees;
    var total = 0;

    for (var i = 0; i < employees.length; i += 1) {
  
      if (employees[i] instanceof Manager || employees[i].type == 'Manager') {
        total += 1;
      }            
    }
    
    return total;
  };
  
  /*
   * ...but in fact, by passing the instance handling to the __super__ class, 
   * the instance that is stored has not finished processing by the subclass 
   * constructor ~ unbelievable ~ so the instanceof check for Manager - and 
   * even the prototype 'type' attribute check - ALWAYS fails!
   */
  t.equal(Manager.total(), 0, 'no managers');
  t.end();
});

/*
 *  So what is the correct solution?
 *
 *  1) store instances in something like an instance store, such as 
 *     EmployeeList, ManagerList, Payroll.
 *
 *  2) don't do actual work like that in the constructor.
 *  
 */
test('fix this reference', function (t) {

  /*
   * It turns out the culprit is simply in the Employee constructor, which takes
   * NO data, and passes its current scope (whatever this refers to) along to 
   * the static hire() method:
   *
      function Employee() {
        Employee.hire(this);
      };

   * That means the object being sent to Employee.hire() is a bare reference, 
   * with no inherited properties.
   *
   * When we specified a call to super from the Manager instance, we were no 
   * longer referring to the instanceof a Manager, but to an Employee. Adding 
   * some logging to each constructor reveals the problem:
   *
   *    Manager() {
   *      console.log(this.constructor.name) // Manager
   *      this.__super__();
   *    }
   *
   * But the call to this.__super__() in Manager always resolves to the super 
   * instance of Employee:
   *
   *    Employee() {
   *      console.log(this.constructor.name) // Employee
   *      Employee.hire(this);
   *    }
   * 
   * Instead of doing that work in the constructor, we can make a prototype 
   *  method hire() in Employer that makes this call:
   *
   *    Employee.prototype.hire = function() {
   *      Employee.hire(this);
   *    }
   *
   * ...and in Manager, we can override that method and access the Manager 
   * instance's __super__ object and call hire.apply() passing the Manager
   * instance as the scope object to set the this reference properly:
   *
   *    Manager.prototype.hire = function() {
   *      this.__super__.hire.apply(this);
   *    }   
   */
  
  function Employee() {   
    //Employee.hire(this);
  };
  
  Employee.prototype.hire = function() {
    Employee.hire(this);
  };
  
  Employee.hire = function hire(employee) {
    this.employees || (this.employees = []);
    return this.employees.push(employee);
  };

  Employee.total = function total() {
    return this.employees.length;
  };
    
  var Manager = Constructor.extend(Employee, {
    constructor: function Manager() {    
      this.__super__();
    },
    hire: function () {
      // have to apply to the super instance
      this.__super__.hire.apply(this);
    }
  });
  
  Manager.total = function total() {
    return this.__super__.constructor.total();
  };
  
  (new Employee()).hire();
  (new Manager()).hire();
  
  t.strictEqual(Employee.total(), 2, 'should be 2 employees');
  t.strictEqual(Employee.employees[1].constructor, Manager, 'should be Manager');
  t.strictEqual(Manager.total(), Employee.total(), 'should inherit total()');
  t.end();
});