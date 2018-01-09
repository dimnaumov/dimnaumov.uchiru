(function () {
    "use strict";

    var Equal = function (options) {
        var self = this;

        self.terms = options.terms;
        self.operation = options.operation;
        self.$inputResult = null;
        self.items = [];
    };

    var equalPrototype = Equal.prototype;

    equalPrototype.init = function() {
        var 
            self = this,
            $equalWrapper = $('<div/>', {
                'class': 'equal-wrapper text-center'
            });

        // render
        self.terms.forEach(function(item, i) {
            var 
                $item = null;
            if(i) {
                $equalWrapper.append(getEqualItem(getSymbolOperation(self.operation)));
            }
            $item = getEqualItem(item, 'equal-item-' + i);
            $equalWrapper.append($item);
            self.items.push($item);
        });
        
        $equalWrapper.append(getEqualItem('='));

        $equalWrapper.append(getEqualItem('?', 'equal-item-result'));

        $('.jumbotron').prepend($equalWrapper);
    }

    equalPrototype.requestResult = function() {
        var 
            self = this;

        self.$inputResult = $('<input>', {
            'class': 'equal-input text-center'
        });
        $('.equal-item-result')
            .empty()
            .append(self.$inputResult);
        initEventsInput(self.$inputResult);
    }

    equalPrototype.showResult = function(value) {
        var
            self = this;

        $('.equal-item-result')
            .empty()
            .append(value);
    }

    equalPrototype.showError = function(index) {
        var 
            self = this;

        if(typeof self.items[index] !== 'undefined') {
            self.items[index].addClass('error');
        } 
    }

    equalPrototype.hideError = function(index) {
        var 
            self = this;

        if(typeof self.items[index] !== 'undefined') {
            self.items[index].removeClass('error');
        } 
    }

    equalPrototype.showErrorResult = function(index) {
        var 
            self = this;

        self.$inputResult.addClass('error');
    }

    equalPrototype.hideErrorResult = function(index) {
        var 
            self = this;

        self.$inputResult.removeClass('error');
    }

    equalPrototype = null;

    window.Equal = Equal;

    function getEqualItem(text, className) {
        return $('<span/>', {
            'class': typeof className !== 'undefined' ? 'equal-item ' + className : 'equal-item',
            'text': text
        });
    }

    function getSymbolOperation(operation) {
        var 
            symbols = {
                'addition': '+',
                'subtraction': '-'
            };
        return typeof symbols[operation] !== 'undefined' ? symbols[operation] : '?';
    }

    function initEventsInput($input) {
        var $input = $input;

        $input
            .focus()
            .mask('00', {
                onChange: function(value) {
                    $(window).trigger({
                        type:"appAxis.enterResultValue",
                        value: parseInt(value)
                    });
                }                
            })
            .on('keyup', function(event) {
                if(event.which === 46 || event.which === 8) {
                    $(window).trigger({
                        type:"appAxis.enterResultValue",
                        value: parseInt($input.cleanVal())
                    });
                }
            });
    }
} ());