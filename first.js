'use strict';
const excelToJson = require('convert-excel-to-json');
 
const table = excelToJson({
    sourceFile: './jan.xlsx'
});

let defaultRate = 45, key  = Object.keys(table)[0], salaryBrutto = 0, salaryNetto = 0;

let calculatingProcentRate = function(a){
    let arr = []
    for(let j = 100; j<=150; j+=25){
        arr.push (a/100 * j)
    }
    return(arr)
}

let takeTotalHours = function(){
    let a = table[key].length - 1 
    return(table[key][a]['I'])
}

let totalHours = takeTotalHours(),rateArr = calculatingProcentRate(defaultRate)

let fixingNumbers = function(){
    for(let i = 3; i< table[key].length - 2; i++){
        if (table[key][i]["I"] != undefined){
            let a = table[key][i]["I"].toFixed(2)
            table[key][i]["I"] = a
        } 
    }
}
fixingNumbers()

let calculateSalaryBrutto = function(index){
    if (table[key][index]["I"] >= 7.5){
      if(table[key][index]["A"].includes("ו'") && table[key][index]["I"] <=9){ // вечер пятницы
          salaryBrutto += table[key][index]["I"] * rateArr[2] 
      } else if(table[key][index]["I"] <= 9 && table[key][index]["A"].includes("ו'") == false){ // вечер
           salaryBrutto += table[key][index]["I"] * rateArr[0]
      } else if(table[key][index]["A"].includes("ש'") && table[key][index]["I"] >=9){ // шаббат дабл
           salaryBrutto += (((table[key][index]["I"]-2) * rateArr[2]) + (2 * rateArr[1]))
       }
        else if(table[key][index]["I"] >=9 && table[key][index]["A"].includes("ש'") == false){ // обычный дабл
            salaryBrutto += (((table[key][index]["I"]-10) * rateArr[2]) + (2 * rateArr[1]) + (8 * rateArr[0]))
        }
    }   
    if (table[key][index]["A"].includes("ש'") && table[key][index]["I"] <=7.5){ //шаббат утро
        salaryBrutto += table[key][index]["I"] * rateArr[2]
    }
    else if (table[key][index]["I"] <=7.5){ // утро
        salaryBrutto += table[key][index]["I"] *rateArr[0]
    }
}


for(let i = 3; i< table[key].length - 2; i++){
    if (table[key][i]["I"] != undefined){
    calculateSalaryBrutto(i)
    }
}

let calculateSalaryNetto = function(salary) {
    let tax =0;
    if(salary <= 6790){
        tax = 0.1 * salary
        salary *=0.9
    } else if(salary >6790 && salary <= 9730){
        tax = 0.14 * salary
        salary *=0.86
    }else if(salary <=15620 && salary > 9730 ){
        tax = 0.2 * salary
        salary*=0.8
    }else if(salary >15620 && salary <= 21710 ){
        tax = 0.31 * salary
        salary *=0.69
    }else if(salary <=45180 && salary > 21710 ){
        tax = 0.35 * salary
        salary *=0.65
    }else if(salary >45180 && salary <= 58190 ){
        tax = 0.47 * salary
        salary *=0.53
    } else {
        tax = 0.5 * salary
        salary*= 0.5
    }
    return{salary, tax}
}

let calculateVacationDays = function(hours){
    if(hours >= 200){
        return 1;
    } else if (hours <200){
       return(hours/100*0.5).toFixed(2)
    }

}

let calculateSickDays = function(hours){
    if(hours >= 200){
        return 1.5;
    } else if (hours <200){
       return(hours/100*0.9).toFixed(2)
    }
}

console.log(`Общее кол-во часов: ${totalHours} \n
            Зп брутто: ${salaryBrutto.toFixed(2)}\n
            Зп нетто: ${calculateSalaryNetto(salaryBrutto).salary} \n
            Налоги: ${calculateSalaryNetto(salaryBrutto).tax.toFixed(2)}
            Ставка в час: ${rateArr[0]}, 125%: ${rateArr[1]}, 150% ${rateArr[2]}\n
            Начисленные отпускные за месяц: ${calculateVacationDays(totalHours)}\n
            Начисленные больничные за месяц: ${calculateSickDays(totalHours)}`)


