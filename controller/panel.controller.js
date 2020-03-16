const Panel = require('../model/panel.model');

exports.panel_create = function (req, res) {
    var locker_array = [];

    for (var i = req.body.lowRange; i <= req.body.highRange; i++) {
        locker_array.push({number: i, status: 'vacant'});
    }

    let panel = new Panel({
            type: req.body.panelType,
            building: req.body.panelBldg,
            level: req.body.panelFloor,
            lockers: locker_array
        }
    );

    panel.save(function (err) {
        if (err) return next(err);
        res.send('Panel created successfully.')
    })
};

exports.panel_details = function(req, res) {
    // Show the panels
    if (req.query.bldg != null && req.query.flr != null) {
        Panel.find({building: req.query.bldg, level: req.query.flr}, function(err, panel) {
            if (err) return next(err);
            
            Panel.find({building: req.query.bldg}).distinct('level', function(err, panel_floor) {
                if (err) return next(err);
    
                Panel.find().distinct('building', function(err, panel_building) {
                    if (err) return next(err);
                    res.render('manage-lockers-page', {
                        active: { active_manage_lockers: true },
                        sidebarData: { 
                            dp: req.session.passport.user.profile.photos[0].value,
                            name: req.session.passport.user.profile.displayName
                        },
                        panel_buildings: panel_building,
                        panel_floors: panel_floor,
                        panels: panel
                    });
                });
            });
        });
    }
    // Show list of floors in the building (and also list of buildings)
    else if (req.query.bldg != null) {
        Panel.find({building: req.query.bldg}).distinct('level', function(err, panel_floor) {
            if (err) return next(err);

            Panel.find().distinct('building', function(err, panel_building) {
                if (err) return next(err);
                res.render('manage-lockers-page', {
                    active: { active_manage_lockers: true },
                    sidebarData: { 
                        dp: req.session.passport.user.profile.photos[0].value,
                        name: req.session.passport.user.profile.displayName
                    },
                    panel_buildings: panel_building,
                    panel_floors: panel_floor
                });
            });
        });
    }
    // Show the list of buildings in the dropdown
    else {
        Panel.find().distinct('building', function(err, panel_building) {
            if (err) return next(err);
            res.render('manage-lockers-page', {
                active: { active_manage_lockers: true },
                sidebarData: { 
                    dp: req.session.passport.user.profile.photos[0].value,
                    name: req.session.passport.user.profile.displayName
                },
                panel_buildings: panel_building
            });
        });
    }
};

exports.panel_update = function(req, res) {
    //await removed in line 41
    const targetPanel = Panel.findOne({
        building: req.params.bldg, 
        level: req.params.flr, 
        panel: req.params.panelid
    });

    (targetPanel.lockers.find(obj => {return obj.number == lockernumber})).status = req.params.status;

    targetPanel.save(function(err) {
        if (err) return next(err);
        res.send('Locker status updated successfully.');
    });
};

exports.panel_delete = function(req, res) {
    Panel.findByIdAndRemove(req.params.panelid, function(err) {
        if (err) return next(err);
        res.send('Panel deleted successfully.')
    });
};
