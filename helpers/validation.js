const { check } = require('express-validator');

const validation = {

        addPanelValidation: function() {
            var validation = [
                check('type', 'Type should not be empty.').notEmpty(),
                check('building', 'Building should not be empty.').notEmpty(),
                check('level', 'Floor level should be an integer.').notEmpty().isInt(),
                check('lowerRange', 'Lower range should be an integer.').notEmpty().isInt(),
                check('upperRange', 'Upper range should be an integer greater than or equal to lower range.').notEmpty().isInt().custom((upperRange, { req }) => {
                    var lower = parseInt(req.body.lowerRange);
                    var upper = parseInt(upperRange);

                    if (upper >= lower)
                        return true;
                    else return false;
                })
            ];
            return validation;
        },

        addOrUpdateEquipmentValidation: function () {
            var validation = [
                check('name', 'Equipment name should not be empty.').notEmpty(),
                check('count', 'Quantity should be an integer.').notEmpty().isInt()                
            ];
            return validation;
        }
        
}

module.exports = validation;