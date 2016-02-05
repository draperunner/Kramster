/**
 * Created by mats on 1/20/16.
 */

var express = require('express');
var router = express.Router();

var Report = require('../models/report');

// Return aggregated statistics for all reports
router.get('/', function(req, res) {
    Report.find({}, function(err, reports) {
        buildStats(err, reports, res);
    });
});

// Return aggregated statistics for a given school
router.get('/:school', function(req, res) {
    Report.find({"document.school": req.params.school.replace(/_/g, " ")}, function(err, reports) {
        buildStats(err, reports, res);
    });
});

// Return aggregated statistics for a given course
router.get('/:school/:course', function(req, res) {
    Report.find({
            "document.school": req.params.school.replace(/_/g, " "),
            "document.course": req.params.course.replace(/_/g, " "),
        },
        function(err, reports) {
            buildStats(err, reports, res);
        }
    );
});

// Return aggregated statistics for a given document
router.get('/:school/:course/:document', function(req, res) {
    Report.find({
            "document.school": req.params.school.replace(/_/g, " "),
            "document.course": req.params.course.replace(/_/g, " "),
            "document.documentName": req.params.document.replace(/_/g, " ")
        },
        function(err, reports) {
            buildStats(err, reports, res);
        }
    );
});

// Function for building stats from an array of reports
var buildStats = function(err, reports, res) {
    if (err) res.status(500).send("Something went wrong.");

    var grades = {A: 0, B: 0, C: 0, D: 0, E: 0, F: 0};
    var totalScore = 0;

    for (var i = 0; i < reports.length; i++) {
        var doc = reports[i].toObject();
        grades[doc.grade]++;
        totalScore += doc.score;
    }

    // Resulting JSON stats object to return
    var stats = {
        numReports: reports.length,
        grades: grades,
        totalScore: totalScore,
        averageScore: totalScore / reports.length
    };
    res.json(stats);
};

module.exports = router;