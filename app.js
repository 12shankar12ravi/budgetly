//IIFE we are using for data encapsulation

//BUDGET CONTROLLER
var budgetController = (function(){
   
    //some code
    var Expense = function (id, description , value) {
         this.id = id;   
         this.description = description;   
         this.value = value; 
         this.percentage = -1;
    };
    
    Expense.prototype.calcPercentages = function (totalIncome) {
         if(totalIncome > 0){
            this.percentage = Math.round((this.value/totalIncome)*100);
         }else {
            this.percentage = -1; 
         }
    };
    
    Expense.prototype.getPercentage = function () {
        return this.percentage;        
    }
    
    var Income = function (id, description,value) {
         this.id = id;   
         this.description = description;   
         this.value = value;   
    };
    
    var calculateTotal = function (type) {
          var sum = 0;  
          
          data.allItems[type].forEach (function (cur){
            sum += cur.value;
          })
            
          /*
          0,
          [200,400,100]
          sum = 0+200 = 200;
          sum = 200+400=600;
          sum = 600+100 = 700
          */ 
          data.totals[type] = sum;
        
    };
    
    //wrapping data into a object! 
    var data = {
        allItems : {
            exp : [],
            inc : []
        },
        totals:{
            inc : 0,
            exp: 0
        },
        budget :0,
        percentage : -1
    };
    
    
    return {  
        addItem : function (type,desc,val) {
            var newItem ,ID;
            
            //create new ID
            if(data.allItems[type].length >0)
                ID = data.allItems[type][data.allItems[type].length -1].id +1;
            else
                ID = 0;
            
            //create new item based upon 'inc' or 'exp' type
            if(type === 'exp'){
                newItem =new Expense (ID,desc,val);
            }else if (type === 'inc'){
                newItem =new Income (ID,desc,val);
            }
            
            //push it into data structure
            data.allItems[type].push(newItem);
            
            //return the new element
            return newItem;
        },
        
        deleteItem : function (type, id){
            var ids, index ; 
            
            // id = 3
            // data.allItems[type][id] 
            // [1 2 4 6 8 9 11]
            
            //map : looping through the array and adding return value 
            //to a brand new array and after completing looping return 
            //the new araay.
            ids = data.allItems[type].map(function(current){
                return current.id;
            });
        
            
            index = ids.indexOf(id);
            console.log(index);
            
            if(index !== -1){
                //splice method to remove the element from an array
                data.allItems[type].splice(index,1);
            }
              
        },
        
        calculateBudget: function() {
          
            //calculate total income & expenses
            calculateTotal('exp');
            calculateTotal('inc');
    
            //calculate the budget : income -expense
            data.budget = data.totals.inc - data.totals.exp;
    
            //calculate the % of income that we spent
            if(data.totals.inc >0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }else{
                data.percentage = -1;   
            }
        },
        
        calculatePercentages : function () {
            data.allItems.exp.forEach(function(curr){
                curr.calcPercentages(data.totals.inc);
            })
        },
        
        getPercentages : function () {
             var allPercents=data.allItems.exp.map(function(curr){
                return curr.getPercentage();
             });     
             return allPercents;
        },
            
        getBudget: function (){
            return {
                budget : data.budget,
                totalInc : data.totals.inc,
                totalExp : data.totals.exp,
                percentage: data.percentage
            };
        },
        
        testing : function () {
            console.log(data);   
        }
        
    };
    
})();


// User interface controller 

var UIController = (function(){
    
    //This object contains all css classes or ids used in the project
    var DOMStrings = {
       inputType : '.add__type',
       inputDescription: '.add__description',
       inputValue : '.add__value',
       inputBtn :'.add__btn',
       incomeContainer:'.income__list',
       expenseContainer:'.expenses__list',
       budgetLabel:'.budget__value',
       incomeLabel : '.budget__income--value',
       expenseLabel: '.budget__expenses--value',
       expensePercentageLabel: '.budget__expenses--percentage',
       //it consist of income list and expense list divs
       container: '.container',
       expensesPercentLabel : '.item__percentage',
       dateLabel : '.budget__title--month'
    };
        
    var nodeListForEach = function (list , callback){
         for(var i =0 ; i< list.length; i++){
            callback(list.item(i),i)
         }
    };
    
    var formatNumber = function (num , type){
            var numSplit , int , dec , type;
            /*
            * '+' or '-' before number
            * exactly two decimal points
            * comma separating the thousands
            * 
                2310.4567 -> + 2310.46
            *   2000      -> + 2000.00
            
            */
            num = Math.abs(num);
            num = num.toFixed(2);
            numSplit = num.split('.');
            int = numSplit[0]; 
            dec = numSplit[1];
            if(int.length > 3){
                int = int.substr(0,int.length-3) + ',' + int.substr(int.length-3,3);  
            }
            
            return (type === 'exp' ? '-' : '+') + ' ' + int +'.'+ dec;
    };
    
    
    //some code
    return {
        getInput: function() {
            //Will be either inc or exp   
             return {
                  "type" :document.querySelector(DOMStrings.inputType).value,  
                 "description":document.querySelector(DOMStrings.inputDescription).value,  
                  "value" :parseFloat(document.querySelector(DOMStrings.inputValue).value)
              };
        },
        
        addListItem: function (obj ,type) {
               
            // create HTML string with placeholder text
             var html, newHtml,element;
             
             if(type === 'inc'){
                element = DOMStrings.incomeContainer;
                html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
             }else if(type === 'exp'){
                element = DOMStrings.expenseContainer;
                html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
             }
            
            // Replace the placeholder text with some actual data 
            newHtml = html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%',formatNumber(obj.value,type));
            
            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);  
             
        },
        
        deleteListItem : function (selectorId) {
            //my method to remove the element
            document.getElementById(selectorId).remove();
            
            //teacher way to delete an element
//            var el = document.getElementById(selectorId);
//            el.parentNode.removeChild(el);
            
        },
        
        clearFields: function () {
            var fields,fieldsArr;
            fields = document.querySelectorAll(DOMStrings.inputDescription + ',' +DOMStrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(function(current,index,array){
                current.value = "";
            });
            
            fieldsArr[0].focus();
 
        },
        
        getDOMString : function (){
            return DOMStrings;   
        },
        
        displayPercentages : function (percents) { 
            var fields = document.querySelectorAll(DOMStrings.expensesPercentLabel);
            
            console.log(fields);
            
            nodeListForEach(fields , function (current,index){   
                if(percents[index]>0)
                    current.textContent = percents[index] + '%';
                else
                    current.textContent = '---';
            });
            
        },
        
        displayMonth : function () {
            var now , year,month,months;
            now = new Date();   
            
            months = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sep','Oct','Nov','Dec'];
            //var chrismas = new Date (2016 , 11 ,25);
            year = now.getFullYear();
            month = now.getMonth();
            
            document.querySelector(DOMStrings.dateLabel).textContent = months[month] +' '+year;
            
        },
        
        displayBudget : function (obj){
             document.querySelector(DOMStrings.incomeLabel).innerHTML = formatNumber(obj.totalInc);  
             document.querySelector(DOMStrings.expenseLabel).innerHTML = formatNumber(obj.totalExp,'exp');  
             
             if(obj.budget>0){
                document.querySelector(DOMStrings.budgetLabel).innerHTML = formatNumber(obj.budget);
             }else {
                document.querySelector(DOMStrings.budgetLabel).innerHTML = formatNumber(obj.budget,'exp');   
             }
            
             if(obj.percentage>0){
                document.querySelector(DOMStrings.expensePercentageLabel).innerHTML = obj.percentage+'%';
             }else {
                document.querySelector(DOMStrings.expensePercentageLabel).innerHTML = '----';   
             }
        },
        
        changedType : function (){
             var fields = document.querySelectorAll(
                DOMStrings.inputType + ','+DOMStrings.inputDescription + ',' + DOMStrings.inputValue
             );
             
            nodeListForEach(fields , function (curr) {
                curr.classList.toggle('red-focus');
            });
            
            document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
             
        }
    }

})();




// Global APP controller - connect UI & budget controller

var controller = (function(budgetCtrl,UICtrl){
    
    //set up event listeners
    var setupEventListeners = function () {
        var DOM = UICtrl.getDOMString();
        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);
        //for whole webpage , anywhere if user presses enter key this function
        //will execute , so adding in global document object
        document.addEventListener('keypress' , function(event) {
           if(event.keyCode === 13 || event.which ===13){
              ctrlAddItem();  
           }
        });
        
        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
        
        document.querySelector(DOM.inputType).addEventListener('change',UICtrl.changedType);
    }
    
    //calculation of budget is done multiple times (while deleting item ,adding item..)
    //So , we created separate method to follow DON'T REPEAT YOURSELF PRINCIPLE
    var updateBudget = function () {
        
        //1. Calculate the budget 
        budgetCtrl.calculateBudget();
        
        //2 . Return the budget
        var budget = budgetCtrl.getBudget();
        
        //3. Display budget on the UI
        console.log(budget);
        UICtrl.displayBudget(budget);
    }
    
    
    var updatePercentages = function () {
        
        //1 . calculate %s
        budgetCtrl.calculatePercentages();
        
        //2 . Read % from the budget controller
        var percents = budgetCtrl.getPercentages();
        
        //3. Update the UI with the new percentages 
        console.log(percents);
        UICtrl.displayPercentages(percents);
    }
    
    var ctrlAddItem = function() {
        var input , newItem;
        
        //1. Get the field input data
        input = UICtrl.getInput();
        console.log(input);

        if(input.description!== "" && !isNaN(input.value) && input.value > 0){
            //2. Add the item to the budget controller
            newItem =budgetCtrl.addItem(input.type,input.description,input.value);
            console.log(newItem);
            //3. Add the item to the UI
            UICtrl.addListItem(newItem,input.type);

            //Clear the fields
            UICtrl.clearFields();

            //calculate and update budget
            updateBudget();
            
            //calculate and update Percentages
            updatePercentages();
        }
        
    };
    
    var ctrlDeleteItem = function(event){
        var itemId , splitId , type ,id;
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        console.log(itemId);
        
        if(itemId){
            //inc-1
            splitId = itemId.split('-');
            type = splitId[0];
            id = parseInt(splitId[1]);
            
            // 1 . delete the item from the data structure 
            budgetCtrl.deleteItem(type , id);
            
            // 2 . delete the item from the UI
            UICtrl.deleteListItem(itemId);
            
            // 3 . Update and show the new budget
            updateBudget();
               
            // 4 . update percentages
            updatePercentages();
        }   
    };
    
    return {
        init : function () {
            console.log('Application has started');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget : 0,
                totalInc : 0,
                totalExp : 0,
                percentage: 0
            });
            setupEventListeners();
        }
    
    }

})(budgetController,UIController);


controller.init();
























