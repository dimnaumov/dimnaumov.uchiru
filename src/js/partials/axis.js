(function () {
    "use strict";

    var Axis = function (selectorContainer) {
        var self = this;

        self.imagePath = 'images/sprite.png';
        self.imageHeight = '83px';
        self.imageMarginTop = -2.2; // in percent

        self.offsetLeft = 4.12; // in percent
        self.offsetRight = 6.76; // in percent

        self.items = [];

        self.stepWidth = 5; // in percent 
        self.$axisWrapper = $('<div/>', {
            'class': 'axis-wrapper'
        });
        self.$axisItemsWrapper = $('<div/>', {
            'class': 'axis-items-wrapper',
            'css': {
                'margin-left': self.offsetLeft + '%',
                'margin-right': self.offsetRight + '%',
                'position': 'relative'
            }
        });
        self.$image = $('<img>', {
            'class': 'axis-image',
            'src': self.imagePath,
            'css': {
                'marginTop': self.imageMarginTop + '%'
            }
        });

        self.$axisWrapper.append(self.$axisItemsWrapper);
        self.$axisWrapper.append(self.$image);
        $(selectorContainer).append(self.$axisWrapper);
    };

    var axisPrototype = Axis.prototype;

    axisPrototype.addAxisItem = function(start, end) {
        if(isNaN(start) || isNaN(end)) return;
        var
            self = this,
            $axisItem = $('<div/>', {
                'class': 'axis-item',
            }),
            axisItemOffsetLeft = start * self.stepWidth,
            axisItemWidth = (end - start) * self.stepWidth,

            $svg = null,
            svgOpts = {},

            $inputContainer = null,
            $input = null;

        $axisItem.css({
            'left': axisItemOffsetLeft + '%',
            'width': axisItemWidth + '%'
        });

        self.$axisItemsWrapper.append($axisItem);

        svgOpts.prop = 0.35;
        svgOpts.width = $axisItem.width();
        svgOpts.height = $axisItem.width() * svgOpts.prop;
        svgOpts.stroke = '#c700ff';
        svgOpts.strokeWidth = '2px';
        svgOpts.arrowWidth = 10;
        svgOpts.arrowHeight = 10;

        $inputContainer = $('<div class="input-container text-center">' + 
                                '<input name="value" class="axis-input text-center">' + 
                            '</div>');

        $svg = makeSVG('svg', {
            'viewBox': '0 0 ' + svgOpts.width + ' ' + svgOpts.height
        });

        $(makeSVG('path', {
            'class': 'svg-arrow-base',
            'd': 'M0 ' + svgOpts.height + ' C 0 5, ' + svgOpts.width + ' 5, ' + svgOpts.width + ' ' + svgOpts.height,
            'stroke': svgOpts.stroke,
            'stroke-width': svgOpts.strokeWidth,
            'fill': 'transparent'
        })).appendTo($svg);

        $(makeSVG('polyline', {
            'class': 'svg-arrow',
            'points': (svgOpts.width - svgOpts.arrowWidth/2) + ',' + (svgOpts.height - svgOpts.arrowHeight) + ' ' + (svgOpts.width) + ',' + (svgOpts.height) + ' ' + (svgOpts.width + svgOpts.arrowWidth/2) + ',' + (svgOpts.height - svgOpts.arrowHeight),
            'stroke': svgOpts.stroke,
            'stroke-width': svgOpts.strokeWidth,
            'transform': 'rotate(-5, ' + svgOpts.width + ', ' + svgOpts.height + ')',
            'fill': 'transparent'
        })).appendTo($svg);

        $axisItem.append($inputContainer);
        self.items.push($axisItem);
        $axisItem.append($svg);

        $input = $inputContainer.find('input');

        // Events
        $input
            .mask('0', {
                onChange: function(value) {
                    $(window).trigger({
                        type:"appAxis.enterStepValue",
                        value: parseInt(value)
                    });
                },
            })
            .on('keyup', function(event) {
                if(event.which === 46 || event.which === 8) {
                    $(window).trigger({
                        type:"appAxis.enterStepValue",
                        value: parseInt($input.cleanVal())
                    });
                }
            })
            .focus();
    }

    axisPrototype.showError = function(index) {
        var 
            self = this;

        if(typeof self.items[index] !== 'undefined') {
            self.items[index].find('input').addClass('error');
        } 
    }

    axisPrototype.hideError = function(index) {
        var 
            self = this;

        if(typeof self.items[index] !== 'undefined') {
            self.items[index].find('input').removeClass('error');
        } 
    }

    axisPrototype.showResultItem = function(index, value) {
        var 
            self = this,
            $item = self.items[index];

        if(typeof $item !== 'undefined') {
            $item
                .find('input')
                .replaceWith('<span class="axis-item-result">' + value + '</span>')
        }
    }

    axisPrototype = null;

    window.Axis = Axis;

    function makeSVG(tag, attrs) {
        var 
            el = document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (var k in attrs)
            el.setAttribute(k, attrs[k]);
        return el;
    }
} ());