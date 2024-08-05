function createYearOptions(){
    const years = [];
    for (let year = 1900 ; year <= 2024 ; year++) {
      years.push(String(year));
    }
    return years.sort((a, b) => {
      if (a > b) return -1;
      if (a < b) return 1;
      return 0;
    });
}

function calculateDaysOptions(month, year, setDaysOptions){
    if (month === "February"){
      if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)){
        setDaysOptions(createRange(29));
      }
      else{
        setDaysOptions(createRange(28));
      }
    }
    else if (["January", "March", "May", "July", "August", "October", "December"].includes(month)){
      setDaysOptions(createRange(31));
    }
    else{
      setDaysOptions(createRange(30));
    }
}

function createRange(n) {
    return Array.from({ length: n }, (_, i) => String(i + 1));
}

module.exports={createYearOptions, calculateDaysOptions, createRange}