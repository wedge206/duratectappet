function PartGenerator() {
    // Instead of hardcoding the Ford parts list like a normal person. I came up with an algorithm that generates it from scratch.  Because "NEEEERRRRDDD!!!"
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

        // Shortened to last 3 digits to save space on small phone screens.
        // TODO: Make it auto-adjust depending on available space.
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

function GetBestSize(perfectSize, rounding) {
    if (rounding() == "Round Up") {
        return parts.reduce((a, b) => { return (a.Size < b.Size && b.Size > perfectSize) ? a : b; });
    }
    else if (rounding() == "Round Down") {
        return parts.reduce((a, b) => { return (a.Size < b.Size && a.Size > perfectSize) ? a : b; });
    }
    else {
        return parts.reduce((a, b) => { return Math.abs(b.Size - perfectSize) < Math.abs(a.Size - perfectSize) ? b : a; });
    }
}

function GetPart(targetClearance, currentClearance, currentTappet, rounding, units) {
    var perfectSize = GetTappetSize(Number(currentTappet())) + (Number(ToMetric(currentClearance(), units)) * 1000) - (Number(targetClearance()) * 1000);
    var bestSize = GetBestSize(perfectSize, rounding);

    if (Math.abs(perfectSize - bestSize.Size) > 25 ) {
        return { Number: -1, PartNumber: "N/A", Size: -1};
    }

    return bestSize;
}

function CalculateNewTappet(targetClearance, currentClearance, currentTappet, rounding, units) {
    return function() {
        return Number(GetPart(targetClearance, currentClearance, currentTappet, rounding, units).Number);
    }
}

function CalculateNewSize(targetClearance, currentClearance, currentTappet, rounding, units) {
    return function() {
        try {
            return  Number(GetPart(targetClearance, currentClearance, currentTappet, rounding, units).Size);
        }
        catch (error) {
            return 0;
        }
    }
}

function ToMetric(size, units) {
    if (units() == "Metric") {
        return size;
    }
    else {
        return size * 25.4;
    }
}

function CalculateNewPart(targetClearance, currentClearance, currentTappet, rounding, units) {
    return function() {
        return GetPart(targetClearance, currentClearance, currentTappet, rounding, units).PartNumber;
    }
}

function CalculateNewClearance(newTappet, currentClearance, currentTappet, units) {
    return function() {
        return ToMetric((GetTappetSize(Number(currentTappet())) + (Number(ToMetric(currentClearance(), units)) * 1000) - GetTappetSize(Number(newTappet()))) / 1000, units);
    }
}

function SwitchUnits(changeTo, dataModel) {
    if (dataModel.selectedUnits() == changeTo) {
        return;
    }
    
    var multiplier = (changeTo == "Metric") ? 25.4 : 1/25.4;

    var oldExhaust = dataModel.exhaustDisplayTarget();
    var oldIntake = dataModel.intakeDisplayTarget();

    dataModel.selectedUnits(changeTo);
    dataModel.exhaustDisplayTarget(Math.round(oldExhaust * multiplier * 1000)/1000);
    dataModel.intakeDisplayTarget(Math.round(oldIntake * multiplier * 1000)/1000);
}

var dataModel = function() {
    this.selectedUnits = ko.observable("Metric");
    this.exhaustRounding= ko.observable("Round Nearest");
    this.exhaustDisplayTarget = ko.observable(0.27);
    this.intakeDisplayTarget = ko.observable(0.22);

    this.exhaustTarget = ko.pureComputed(function() { if (this.selectedUnits() == "Metric") { return this.exhaustDisplayTarget(); } else { return this.exhaustDisplayTarget() * 25.4; } }, this);
    this.intakeTarget = ko.pureComputed(function() { if (this.selectedUnits() == "Metric") { return this.intakeDisplayTarget(); } else { return this.intakeDisplayTarget() * 25.4; } }, this);

    this.exhaustRoundNearestClicked = function() { this.exhaustRounding("Round Nearest"); }
    this.exhaustRoundUpClicked = function() { this.exhaustRounding("Round Up"); }
    this.exhaustRoundDownClicked = function() { this.exhaustRounding("Round Down");}
    
    this.metricClicked = function() { SwitchUnits("Metric", this); }
    this.standardClicked = function() { SwitchUnits("Standard", this); }

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

    this.exhaustNewSize1 = ko.pureComputed(CalculateNewSize(this.exhaustTarget, this.exhaustClearance1, this.exhaustTappet1, this.exhaustRounding, this.selectedUnits), this);
    this.exhaustNewSize2 = ko.pureComputed(CalculateNewSize(this.exhaustTarget, this.exhaustClearance2, this.exhaustTappet2, this.exhaustRounding, this.selectedUnits), this);
    this.exhaustNewSize3 = ko.pureComputed(CalculateNewSize(this.exhaustTarget, this.exhaustClearance3, this.exhaustTappet3, this.exhaustRounding, this.selectedUnits), this);
    this.exhaustNewSize4 = ko.pureComputed(CalculateNewSize(this.exhaustTarget, this.exhaustClearance4, this.exhaustTappet4, this.exhaustRounding, this.selectedUnits), this);
    this.exhaustNewSize5 = ko.pureComputed(CalculateNewSize(this.exhaustTarget, this.exhaustClearance5, this.exhaustTappet5, this.exhaustRounding, this.selectedUnits), this);
    this.exhaustNewSize6 = ko.pureComputed(CalculateNewSize(this.exhaustTarget, this.exhaustClearance6, this.exhaustTappet6, this.exhaustRounding, this.selectedUnits), this);
    this.exhaustNewSize7 = ko.pureComputed(CalculateNewSize(this.exhaustTarget, this.exhaustClearance7, this.exhaustTappet7, this.exhaustRounding, this.selectedUnits), this);
    this.exhaustNewSize8 = ko.pureComputed(CalculateNewSize(this.exhaustTarget, this.exhaustClearance8, this.exhaustTappet8, this.exhaustRounding, this.selectedUnits), this);

    this.exhaustNewTappet1 = ko.pureComputed(CalculateNewTappet(this.exhaustTarget, this.exhaustClearance1, this.exhaustTappet1, this.exhaustRounding, this.selectedUnits), this);
    this.exhaustNewTappet2 = ko.pureComputed(CalculateNewTappet(this.exhaustTarget, this.exhaustClearance2, this.exhaustTappet2, this.exhaustRounding, this.selectedUnits), this);
    this.exhaustNewTappet3 = ko.pureComputed(CalculateNewTappet(this.exhaustTarget, this.exhaustClearance3, this.exhaustTappet3, this.exhaustRounding, this.selectedUnits), this);
    this.exhaustNewTappet4 = ko.pureComputed(CalculateNewTappet(this.exhaustTarget, this.exhaustClearance4, this.exhaustTappet4, this.exhaustRounding, this.selectedUnits), this);
    this.exhaustNewTappet5 = ko.pureComputed(CalculateNewTappet(this.exhaustTarget, this.exhaustClearance5, this.exhaustTappet5, this.exhaustRounding, this.selectedUnits), this);
    this.exhaustNewTappet6 = ko.pureComputed(CalculateNewTappet(this.exhaustTarget, this.exhaustClearance6, this.exhaustTappet6, this.exhaustRounding, this.selectedUnits), this);
    this.exhaustNewTappet7 = ko.pureComputed(CalculateNewTappet(this.exhaustTarget, this.exhaustClearance7, this.exhaustTappet7, this.exhaustRounding, this.selectedUnits), this);
    this.exhaustNewTappet8 = ko.pureComputed(CalculateNewTappet(this.exhaustTarget, this.exhaustClearance8, this.exhaustTappet8, this.exhaustRounding, this.selectedUnits), this);
    
    this.exhaustNewPart1 = ko.pureComputed(CalculateNewPart(this.exhaustTarget, this.exhaustClearance1, this.exhaustTappet1, this.exhaustRounding, this.selectedUnits), this);
    this.exhaustNewPart2 = ko.pureComputed(CalculateNewPart(this.exhaustTarget, this.exhaustClearance2, this.exhaustTappet2, this.exhaustRounding, this.selectedUnits), this);
    this.exhaustNewPart3 = ko.pureComputed(CalculateNewPart(this.exhaustTarget, this.exhaustClearance3, this.exhaustTappet3, this.exhaustRounding, this.selectedUnits), this);
    this.exhaustNewPart4 = ko.pureComputed(CalculateNewPart(this.exhaustTarget, this.exhaustClearance4, this.exhaustTappet4, this.exhaustRounding, this.selectedUnits), this);
    this.exhaustNewPart5 = ko.pureComputed(CalculateNewPart(this.exhaustTarget, this.exhaustClearance5, this.exhaustTappet5, this.exhaustRounding, this.selectedUnits), this);
    this.exhaustNewPart6 = ko.pureComputed(CalculateNewPart(this.exhaustTarget, this.exhaustClearance6, this.exhaustTappet6, this.exhaustRounding, this.selectedUnits), this);
    this.exhaustNewPart7 = ko.pureComputed(CalculateNewPart(this.exhaustTarget, this.exhaustClearance7, this.exhaustTappet7, this.exhaustRounding, this.selectedUnits), this);
    this.exhaustNewPart8 = ko.pureComputed(CalculateNewPart(this.exhaustTarget, this.exhaustClearance8, this.exhaustTappet8, this.exhaustRounding, this.selectedUnits), this);

    this.exhaustNewClearance1 = ko.pureComputed(CalculateNewClearance(this.exhaustNewTappet1, this.exhaustClearance1, this.exhaustTappet1, this.selectedUnits), this);
    this.exhaustNewClearance2 = ko.pureComputed(CalculateNewClearance(this.exhaustNewTappet2, this.exhaustClearance2, this.exhaustTappet2, this.selectedUnits), this);
    this.exhaustNewClearance3 = ko.pureComputed(CalculateNewClearance(this.exhaustNewTappet3, this.exhaustClearance3, this.exhaustTappet3, this.selectedUnits), this);
    this.exhaustNewClearance4 = ko.pureComputed(CalculateNewClearance(this.exhaustNewTappet4, this.exhaustClearance4, this.exhaustTappet4, this.selectedUnits), this);
    this.exhaustNewClearance5 = ko.pureComputed(CalculateNewClearance(this.exhaustNewTappet5, this.exhaustClearance5, this.exhaustTappet5, this.selectedUnits), this);
    this.exhaustNewClearance6 = ko.pureComputed(CalculateNewClearance(this.exhaustNewTappet6, this.exhaustClearance6, this.exhaustTappet6, this.selectedUnits), this);
    this.exhaustNewClearance7 = ko.pureComputed(CalculateNewClearance(this.exhaustNewTappet7, this.exhaustClearance7, this.exhaustTappet7, this.selectedUnits), this);
    this.exhaustNewClearance8 = ko.pureComputed(CalculateNewClearance(this.exhaustNewTappet8, this.exhaustClearance8, this.exhaustTappet8, this.selectedUnits), this);

    this.intakeRounding= ko.observable("Round Nearest");
    this.intakeRoundNearestClicked = function() { this.intakeRounding("Round Nearest"); }
    this.intakeRoundUpClicked = function() { this.intakeRounding("Round Up"); }
    this.intakeRoundDownClicked = function() { this.intakeRounding("Round Down");}

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

    this.intakeNewSize1 = ko.pureComputed(CalculateNewSize(this.intakeTarget, this.intakeClearance1, this.intakeTappet1, this.intakeRounding, this.selectedUnits), this);
    this.intakeNewSize2 = ko.pureComputed(CalculateNewSize(this.intakeTarget, this.intakeClearance2, this.intakeTappet2, this.intakeRounding, this.selectedUnits), this);
    this.intakeNewSize3 = ko.pureComputed(CalculateNewSize(this.intakeTarget, this.intakeClearance3, this.intakeTappet3, this.intakeRounding, this.selectedUnits), this);
    this.intakeNewSize4 = ko.pureComputed(CalculateNewSize(this.intakeTarget, this.intakeClearance4, this.intakeTappet4, this.intakeRounding, this.selectedUnits), this);
    this.intakeNewSize5 = ko.pureComputed(CalculateNewSize(this.intakeTarget, this.intakeClearance5, this.intakeTappet5, this.intakeRounding, this.selectedUnits), this);
    this.intakeNewSize6 = ko.pureComputed(CalculateNewSize(this.intakeTarget, this.intakeClearance6, this.intakeTappet6, this.intakeRounding, this.selectedUnits), this);
    this.intakeNewSize7 = ko.pureComputed(CalculateNewSize(this.intakeTarget, this.intakeClearance7, this.intakeTappet7, this.intakeRounding, this.selectedUnits), this);
    this.intakeNewSize8 = ko.pureComputed(CalculateNewSize(this.intakeTarget, this.intakeClearance8, this.intakeTappet8, this.intakeRounding, this.selectedUnits), this);

    this.intakeNewTappet1 = ko.pureComputed(CalculateNewTappet(this.intakeTarget, this.intakeClearance1, this.intakeTappet1, this.intakeRounding, this.selectedUnits), this);
    this.intakeNewTappet2 = ko.pureComputed(CalculateNewTappet(this.intakeTarget, this.intakeClearance2, this.intakeTappet2, this.intakeRounding, this.selectedUnits), this);
    this.intakeNewTappet3 = ko.pureComputed(CalculateNewTappet(this.intakeTarget, this.intakeClearance3, this.intakeTappet3, this.intakeRounding, this.selectedUnits), this);
    this.intakeNewTappet4 = ko.pureComputed(CalculateNewTappet(this.intakeTarget, this.intakeClearance4, this.intakeTappet4, this.intakeRounding, this.selectedUnits), this);
    this.intakeNewTappet5 = ko.pureComputed(CalculateNewTappet(this.intakeTarget, this.intakeClearance5, this.intakeTappet5, this.intakeRounding, this.selectedUnits), this);
    this.intakeNewTappet6 = ko.pureComputed(CalculateNewTappet(this.intakeTarget, this.intakeClearance6, this.intakeTappet6, this.intakeRounding, this.selectedUnits), this);
    this.intakeNewTappet7 = ko.pureComputed(CalculateNewTappet(this.intakeTarget, this.intakeClearance7, this.intakeTappet7, this.intakeRounding, this.selectedUnits), this);
    this.intakeNewTappet8 = ko.pureComputed(CalculateNewTappet(this.intakeTarget, this.intakeClearance8, this.intakeTappet8, this.intakeRounding, this.selectedUnits), this);

    this.intakeNewPart1 = ko.pureComputed(CalculateNewPart(this.intakeTarget, this.intakeClearance1, this.intakeTappet1, this.intakeRounding, this.selectedUnits), this);
    this.intakeNewPart2 = ko.pureComputed(CalculateNewPart(this.intakeTarget, this.intakeClearance2, this.intakeTappet2, this.intakeRounding, this.selectedUnits), this);
    this.intakeNewPart3 = ko.pureComputed(CalculateNewPart(this.intakeTarget, this.intakeClearance3, this.intakeTappet3, this.intakeRounding, this.selectedUnits), this);
    this.intakeNewPart4 = ko.pureComputed(CalculateNewPart(this.intakeTarget, this.intakeClearance4, this.intakeTappet4, this.intakeRounding, this.selectedUnits), this);
    this.intakeNewPart5 = ko.pureComputed(CalculateNewPart(this.intakeTarget, this.intakeClearance5, this.intakeTappet5, this.intakeRounding, this.selectedUnits), this);
    this.intakeNewPart6 = ko.pureComputed(CalculateNewPart(this.intakeTarget, this.intakeClearance6, this.intakeTappet6, this.intakeRounding, this.selectedUnits), this);
    this.intakeNewPart7 = ko.pureComputed(CalculateNewPart(this.intakeTarget, this.intakeClearance7, this.intakeTappet7, this.intakeRounding, this.selectedUnits), this);
    this.intakeNewPart8 = ko.pureComputed(CalculateNewPart(this.intakeTarget, this.intakeClearance8, this.intakeTappet8, this.intakeRounding, this.selectedUnits), this);

    this.intakeNewClearance1 = ko.pureComputed(CalculateNewClearance(this.intakeNewTappet1, this.intakeClearance1, this.intakeTappet1, this.selectedUnits), this);
    this.intakeNewClearance2 = ko.pureComputed(CalculateNewClearance(this.intakeNewTappet2, this.intakeClearance2, this.intakeTappet2, this.selectedUnits), this);
    this.intakeNewClearance3 = ko.pureComputed(CalculateNewClearance(this.intakeNewTappet3, this.intakeClearance3, this.intakeTappet3, this.selectedUnits), this);
    this.intakeNewClearance4 = ko.pureComputed(CalculateNewClearance(this.intakeNewTappet4, this.intakeClearance4, this.intakeTappet4, this.selectedUnits), this);
    this.intakeNewClearance5 = ko.pureComputed(CalculateNewClearance(this.intakeNewTappet5, this.intakeClearance5, this.intakeTappet5, this.selectedUnits), this);
    this.intakeNewClearance6 = ko.pureComputed(CalculateNewClearance(this.intakeNewTappet6, this.intakeClearance6, this.intakeTappet6, this.selectedUnits), this);
    this.intakeNewClearance7 = ko.pureComputed(CalculateNewClearance(this.intakeNewTappet7, this.intakeClearance7, this.intakeTappet7, this.selectedUnits), this);
    this.intakeNewClearance8 = ko.pureComputed(CalculateNewClearance(this.intakeNewTappet8, this.intakeClearance8, this.intakeTappet8, this.selectedUnits), this);
};

ko.applyBindings(new dataModel());