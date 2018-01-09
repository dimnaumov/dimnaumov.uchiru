(function () {
    "use strict";

    var AppAxis = function () {
        var 
            self = this;

        self.aRange = [6, 9],
        self.resultRange = [11, 14];

        self.axis = null;
        self.equal = null;

        self.steps = null;
        self.currentStep = 0;
    };

    var AppAxisPrototype = AppAxis.prototype;

    AppAxisPrototype.init = function() {
        var 
            self = this;

        self.a = getRandomInt(self.aRange[0], self.aRange[1]);
        self.result = getRandomInt(self.resultRange[0], self.resultRange[1]);
        self.b = self.result - self.a;

        self.steps = [
            {
                range: [0, self.a],
                value: self.a
            },
            {
                range: [self.a, self.a + self.b],
                value: self.b
            }
        ];

        // init axis
        self.axis = new window.Axis('.jumbotron');

        // init equal
        self.equal = new window.Equal({
            terms: [self.a, self.b],
            operation: 'addition'
        });

        // Events
        $(window).on('appAxis.enterStepValue', function(event) {
            if(isNaN(event.value)) {
                self.axis.hideError(self.currentStep);
                self.equal.hideError(self.currentStep);
            } else {
                if(self.validStep(event.value)) {
                    self.axis.showResultItem(self.currentStep, self.steps[self.currentStep].value);
                    self.nextStep();
                } else {
                    self.axis.showError(self.currentStep);
                    self.equal.showError(self.currentStep);
                }
            }
        });

        $(window).on('appAxis.enterResultValue', function(event) {
            if(isNaN(event.value)) {
                self.equal.hideErrorResult();
            } else {
                if(self.validResult(parseInt(event.value))) {
                    self.equal.showResult(event.value);
                } else {
                    if(event.value.toString().length == self.result.toString().length) {
                        self.equal.showErrorResult();
                    } else {
                        self.equal.hideErrorResult();
                    }
                }
            }
        });

        self.equal.init();
        self.step();
    }

    AppAxisPrototype.step = function() {
        var 
            self = this,
            startStep = 0,
            endStep = 0;

        startStep = self.steps[self.currentStep].range[0];
        endStep = self.steps[self.currentStep].range[1];
        self.axis.addAxisItem(startStep, endStep);
    }

    AppAxisPrototype.nextStep = function() {
        var
            self = this;
        self.currentStep++;

        if(self.currentStep < self.steps.length) {
            self.step();
        } else {
            self.resultStep()
        }
    }

    AppAxisPrototype.validStep = function(value) {
        var 
            self = this,
            currentValue = self.steps[self.currentStep].value,
            result = false;

        if(value === currentValue) {
            result = true;
        }

        return result;
    }

    AppAxisPrototype.validResult = function(value) {
        var 
            self = this,
            result = false;

        if(value === self.result) {
            result = true;
        }

        return result;
    }

    AppAxisPrototype.resultStep = function() {
        var 
            self = this;
        self.equal.requestResult();
    }

    AppAxisPrototype = null;

    window.AppAxis = AppAxis;

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
} ());