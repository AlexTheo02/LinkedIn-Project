function string_workingArrangmement(wa){
    if (wa === 0){
        return "On-Site";
    }
    else if (wa === 1){
        return "Remote";
    }
    else{
        return "Hybrid";
    }
};

function string_employmentType(et){
    if (et === 0){
        return "Full-Time";
    }
    else{
        return "Part-Time";
    }
};

function calculate_employeesRange(er){
    if (er === 0){
        return "1-10";
    }
    else if (er === 1){
        return "11-50";
    }
    else if (er === 2){
        return "51-100";
    }
    else if (er === 3){
        return "101-200";
    }
    else if (er === 4){
        return "201-500";
    }
    else if (er === 5){
        return "501-1000";
    }
    else if (er === 6){
        return "1001-2000";
    }
    else if (er === 7){
        return "2001-5000";
    }
    else if (er === 8){
        return "5001-10000";
    }
    else{
        return "10000+";
    }
};

module.exports={string_workingArrangmement, string_employmentType, calculate_employeesRange};