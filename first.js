'use strict';
const excelToJson = require('convert-excel-to-json');
 
const table = excelToJson({
    sourceFile: './nov.xlsx'
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
console.log(`Общее кол-во часов: ${totalHours} \n
            Зп брутто: ${salaryBrutto.toFixed(2)}\n
            Ставка в час: ${rateArr[0]}, 125%: ${rateArr[1]}, 150% ${rateArr[2]}`)


