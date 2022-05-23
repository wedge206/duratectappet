function PartGenerator() {
    var result = [];
    var partCounter = 169;

    for(var i = 0; i < 35; i++) {
        var num = i +1;
        var size = 0;

        if (num % 4 == 1 && i > 1) {
            partCounter += 13;
        }
        else {
            partCounter += 1;
        }
        
        //var partNumber = ("CP9Z-6500-" + partCounter.toString(16).toUpperCase() + "B").replace("10", "G").replace("11", "H").replace("12", "J");
        var partNumber = (partCounter.toString(16).toUpperCase() + "B").replace("10", "G").replace("11", "H").replace("12", "J");

        if (num < 6) {
            size = (i * 25);
        }
        else if (num > 30) {
            size = 600 + ((i - 29) * 25);
        }
        else {
            size = 2 + (num * 20);
        }

        result[i] = { Number: num, PartNumber: partNumber, Size: size};
    }

    return result;
};

var parts = PartGenerator();

function GetTappetSize(tappetNum) {
    var size = 0;
    parts.forEach(part => {
        if (part.Number == tappetNum) {
            size = part.Size;
        }
    });

    return size;
}

function GetPart(targetClearance, currentClearance, currentTappet) {
    var perfectSize = GetTappetSize(Number(currentTappet())) + (Number(currentClearance()) * 1000) - (Number(targetClearance()) * 1000);
    var closestSize = parts.reduce((a, b) => {
        return Math.abs(b.Size - perfectSize) < Math.abs(a.Size - perfectSize) ? b : a;
    });

    if (Math.abs(perfectSize - closestSize.Size) > 20 ) {
        return { Number: -1, PartNumber: "N/A", Size: -1};
    }

    return closestSize;
}

function CalculateNewTappet(targetClearance, currentClearance, currentTappet) {
    return function() {
        return Number(GetPart(targetClearance, currentClearance, currentTappet).Number);
    }
}

function CalculateNewSize(targetClearance, currentClearance, currentTappet) {
    return function() {
        try {
            return Number(GetPart(targetClearance, currentClearance, currentTappet).Size);
        }
        catch (error) {
            return 0;
        }
    }
}

function CalculateNewPart(targetClearance, currentClearance, currentTappet) {
    return function() {
        return GetPart(targetClearance, currentClearance, currentTappet).PartNumber;
    }
}

var dataModel = function() {
    this.exhaustTarget = ko.observable(0.27);
    this.intakeTarget = ko.observable(0.22);

    this.exhaustClearance1 = ko.observable(0);
    this.exhaustClearance2 = ko.observable(0);
    this.exhaustClearance3 = ko.observable(0);
    this.exhaustClearance4 = ko.observable(0);
    this.exhaustClearance5 = ko.observable(0);
    this.exhaustClearance6 = ko.observable(0);
    this.exhaustClearance7 = ko.observable(0);
    this.exhaustClearance8 = ko.observable(0);

    this.exhaustTappet1 = ko.observable(0);
    this.exhaustTappet2 = ko.observable(0);
    this.exhaustTappet3 = ko.observable(0);
    this.exhaustTappet4 = ko.observable(0);
    this.exhaustTappet5 = ko.observable(0);
    this.exhaustTappet6 = ko.observable(0);
    this.exhaustTappet7 = ko.observable(0);
    this.exhaustTappet8 = ko.observable(0);

    this.exhaustNewSize1 = ko.computed(CalculateNewSize(this.exhaustTarget, this.exhaustClearance1, this.exhaustTappet1), this);
    this.exhaustNewSize2 = ko.computed(CalculateNewSize(this.exhaustTarget, this.exhaustClearance2, this.exhaustTappet2), this);
    this.exhaustNewSize3 = ko.computed(CalculateNewSize(this.exhaustTarget, this.exhaustClearance3, this.exhaustTappet3), this);
    this.exhaustNewSize4 = ko.computed(CalculateNewSize(this.exhaustTarget, this.exhaustClearance4, this.exhaustTappet4), this);
    this.exhaustNewSize5 = ko.computed(CalculateNewSize(this.exhaustTarget, this.exhaustClearance5, this.exhaustTappet5), this);
    this.exhaustNewSize6 = ko.computed(CalculateNewSize(this.exhaustTarget, this.exhaustClearance6, this.exhaustTappet6), this);
    this.exhaustNewSize7 = ko.computed(CalculateNewSize(this.exhaustTarget, this.exhaustClearance7, this.exhaustTappet7), this);
    this.exhaustNewSize8 = ko.computed(CalculateNewSize(this.exhaustTarget, this.exhaustClearance8, this.exhaustTappet8), this);

    this.exhaustNewTappet1 = ko.computed(CalculateNewTappet(this.exhaustTarget, this.exhaustClearance1, this.exhaustTappet1), this);
    this.exhaustNewTappet2 = ko.computed(CalculateNewTappet(this.exhaustTarget, this.exhaustClearance2, this.exhaustTappet2), this);
    this.exhaustNewTappet3 = ko.computed(CalculateNewTappet(this.exhaustTarget, this.exhaustClearance3, this.exhaustTappet3), this);
    this.exhaustNewTappet4 = ko.computed(CalculateNewTappet(this.exhaustTarget, this.exhaustClearance4, this.exhaustTappet4), this);
    this.exhaustNewTappet5 = ko.computed(CalculateNewTappet(this.exhaustTarget, this.exhaustClearance5, this.exhaustTappet5), this);
    this.exhaustNewTappet6 = ko.computed(CalculateNewTappet(this.exhaustTarget, this.exhaustClearance6, this.exhaustTappet6), this);
    this.exhaustNewTappet7 = ko.computed(CalculateNewTappet(this.exhaustTarget, this.exhaustClearance7, this.exhaustTappet7), this);
    this.exhaustNewTappet8 = ko.computed(CalculateNewTappet(this.exhaustTarget, this.exhaustClearance8, this.exhaustTappet8), this);
    
    this.exhaustNewPart1 = ko.computed(CalculateNewPart(this.exhaustTarget, this.exhaustClearance1, this.exhaustTappet1), this);
    this.exhaustNewPart2 = ko.computed(CalculateNewPart(this.exhaustTarget, this.exhaustClearance2, this.exhaustTappet2), this);
    this.exhaustNewPart3 = ko.computed(CalculateNewPart(this.exhaustTarget, this.exhaustClearance3, this.exhaustTappet3), this);
    this.exhaustNewPart4 = ko.computed(CalculateNewPart(this.exhaustTarget, this.exhaustClearance4, this.exhaustTappet4), this);
    this.exhaustNewPart5 = ko.computed(CalculateNewPart(this.exhaustTarget, this.exhaustClearance5, this.exhaustTappet5), this);
    this.exhaustNewPart6 = ko.computed(CalculateNewPart(this.exhaustTarget, this.exhaustClearance6, this.exhaustTappet6), this);
    this.exhaustNewPart7 = ko.computed(CalculateNewPart(this.exhaustTarget, this.exhaustClearance7, this.exhaustTappet7), this);
    this.exhaustNewPart8 = ko.computed(CalculateNewPart(this.exhaustTarget, this.exhaustClearance8, this.exhaustTappet8), this);

    this.intakeClearance1 = ko.observable(0);
    this.intakeClearance2 = ko.observable(0);
    this.intakeClearance3 = ko.observable(0);
    this.intakeClearance4 = ko.observable(0);
    this.intakeClearance5 = ko.observable(0);
    this.intakeClearance6 = ko.observable(0);
    this.intakeClearance7 = ko.observable(0);
    this.intakeClearance8 = ko.observable(0);

    this.intakeTappet1 = ko.observable(0);
    this.intakeTappet2 = ko.observable(0);
    this.intakeTappet3 = ko.observable(0);
    this.intakeTappet4 = ko.observable(0);
    this.intakeTappet5 = ko.observable(0);
    this.intakeTappet6 = ko.observable(0);
    this.intakeTappet7 = ko.observable(0);
    this.intakeTappet8 = ko.observable(0);

    this.intakeNewSize1 = ko.computed(CalculateNewSize(this.intakeTarget, this.intakeClearance1, this.intakeTappet1), this);
    this.intakeNewSize2 = ko.computed(CalculateNewSize(this.intakeTarget, this.intakeClearance2, this.intakeTappet2), this);
    this.intakeNewSize3 = ko.computed(CalculateNewSize(this.intakeTarget, this.intakeClearance3, this.intakeTappet3), this);
    this.intakeNewSize4 = ko.computed(CalculateNewSize(this.intakeTarget, this.intakeClearance4, this.intakeTappet4), this);
    this.intakeNewSize5 = ko.computed(CalculateNewSize(this.intakeTarget, this.intakeClearance5, this.intakeTappet5), this);
    this.intakeNewSize6 = ko.computed(CalculateNewSize(this.intakeTarget, this.intakeClearance6, this.intakeTappet6), this);
    this.intakeNewSize7 = ko.computed(CalculateNewSize(this.intakeTarget, this.intakeClearance7, this.intakeTappet7), this);
    this.intakeNewSize8 = ko.computed(CalculateNewSize(this.intakeTarget, this.intakeClearance8, this.intakeTappet8), this);

    this.intakeNewTappet1 = ko.computed(CalculateNewTappet(this.intakeTarget, this.intakeClearance1, this.intakeTappet1), this);
    this.intakeNewTappet2 = ko.computed(CalculateNewTappet(this.intakeTarget, this.intakeClearance2, this.intakeTappet2), this);
    this.intakeNewTappet3 = ko.computed(CalculateNewTappet(this.intakeTarget, this.intakeClearance3, this.intakeTappet3), this);
    this.intakeNewTappet4 = ko.computed(CalculateNewTappet(this.intakeTarget, this.intakeClearance4, this.intakeTappet4), this);
    this.intakeNewTappet5 = ko.computed(CalculateNewTappet(this.intakeTarget, this.intakeClearance5, this.intakeTappet5), this);
    this.intakeNewTappet6 = ko.computed(CalculateNewTappet(this.intakeTarget, this.intakeClearance6, this.intakeTappet6), this);
    this.intakeNewTappet7 = ko.computed(CalculateNewTappet(this.intakeTarget, this.intakeClearance7, this.intakeTappet7), this);
    this.intakeNewTappet8 = ko.computed(CalculateNewTappet(this.intakeTarget, this.intakeClearance8, this.intakeTappet8), this);

    this.intakeNewPart1 = ko.computed(CalculateNewPart(this.intakeTarget, this.intakeClearance1, this.intakeTappet1), this);
    this.intakeNewPart2 = ko.computed(CalculateNewPart(this.intakeTarget, this.intakeClearance2, this.intakeTappet2), this);
    this.intakeNewPart3 = ko.computed(CalculateNewPart(this.intakeTarget, this.intakeClearance3, this.intakeTappet3), this);
    this.intakeNewPart4 = ko.computed(CalculateNewPart(this.intakeTarget, this.intakeClearance4, this.intakeTappet4), this);
    this.intakeNewPart5 = ko.computed(CalculateNewPart(this.intakeTarget, this.intakeClearance5, this.intakeTappet5), this);
    this.intakeNewPart6 = ko.computed(CalculateNewPart(this.intakeTarget, this.intakeClearance6, this.intakeTappet6), this);
    this.intakeNewPart7 = ko.computed(CalculateNewPart(this.intakeTarget, this.intakeClearance7, this.intakeTappet7), this);
    this.intakeNewPart8 = ko.computed(CalculateNewPart(this.intakeTarget, this.intakeClearance8, this.intakeTappet8), this);

};

ko.applyBindings(new dataModel());