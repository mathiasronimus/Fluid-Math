define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    /**
     * Strategy allowing only one layout to be
     * selected.
     */
    var OneOnlySelectionStrategy = (function () {
        function OneOnlySelectionStrategy() {
        }
        OneOnlySelectionStrategy.prototype.onSelect = function (currSelected, newSelected) {
            currSelected.splice(0, currSelected.length);
            currSelected.push(newSelected);
        };
        return OneOnlySelectionStrategy;
    }());
    exports.OneOnlySelectionStrategy = OneOnlySelectionStrategy;
});
