var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    name: String,
    lessthan3equity1percent: {
        type: Number,
        default: 0
    },
    lessthan3equity1fund: {
        type: Schema.Types.ObjectId,
        ref: 'Funds',
        index: true
    },
    lessthan3equity2percent: {
        type: Number,
        default: 0
    },
    lessthan3equity2fund: {
        type: Schema.Types.ObjectId,
        ref: 'Funds',
        index: true
    },
    lessthan3debt1percent: {
        type: Number,
        default: 0
    },
    lessthan3debt1fund: {
        type: Schema.Types.ObjectId,
        ref: 'Funds',
        index: true
    },
    lessthan3debt2percent: {
        type: Number,
        default: 0
    },
    lessthan3debt2fund: {
        type: Schema.Types.ObjectId,
        ref: 'Funds',
        index: true
    },
    morethan3equity1percent: {
        type: Number,
        default: 0
    },
    morethan3equity1fund: {
        type: Schema.Types.ObjectId,
        ref: 'Funds',
        index: true
    },
    morethan3equity2percent: {
        type: Number,
        default: 0
    },
    morethan3equity2fund: {
        type: Schema.Types.ObjectId,
        ref: 'Funds',
        index: true
    },
    morethan3debt1percent: {
        type: Number,
        default: 0
    },
    morethan3debt1fund: {
        type: Schema.Types.ObjectId,
        ref: 'Funds',
        index: true
    },
    morethan3debt2percent: {
        type: Number,
        default: 0
    },
    morethan3debt2fund: {
        type: Schema.Types.ObjectId,
        ref: 'Funds',
        index: true
    },
    equitypercent: String
});

module.exports = mongoose.model('InvestmentType', schema);

var models = {
    saveData: function(data, callback) {
        var investmenttype = this(data);
        investmenttype.timestamp = new Date();
        if (data._id) {
            this.findOneAndUpdate({
                _id: data._id
            }, data).exec(function(err, updated) {
                if (err) {
                    console.log(err);
                    callback(err, null);
                } else if (updated) {
                    callback(null, updated);
                } else {
                    callback(null, {});
                }
            });
        } else {
            investmenttype.save(function(err, created) {
                if (err) {
                    callback(err, null);
                } else if (created) {
                    callback(null, created);
                } else {
                    callback(null, {});
                }
            });
        }
    },
    deleteData: function(data, callback) {
        this.findOneAndRemove({
            _id: data._id
        }, function(err, deleted) {
            if (err) {
                callback(err, null);
            } else if (deleted) {
                callback(null, deleted);
            } else {
                callback(null, {});
            }
        });
    },
    getAll: function(data, callback) {
        this.find({}).exec(function(err, found) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else if (found && found.length > 0) {
                callback(null, found);
            } else {
                callback(null, []);
            }
        });
    },
    getOne: function(data, callback) {
        this.findOne({
            "_id": data._id
        }).exec(function(err, found) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else if (found && Object.keys(found).length > 0) {
                callback(null, found);
            } else {
                callback(null, {});
            }
        });
    },
    getPlanFunds: function(data, callback) {
      this.findOne({
          "name": data.name
      }).populate("lessthan3equity1fund").populate("lessthan3equity2fund").populate("lessthan3debt1fund").populate("lessthan3debt2fund").populate("morethan3equity1fund").populate("morethan3equity2fund").populate("morethan3debt1fund").populate("morethan3debt2fund").exec(function(err, found) {
          if (err) {
              console.log(err);
              callback(err, null);
          } else if (found && Object.keys(found).length > 0) {
              callback(null, found);
          } else {
              callback(null, {
                "message":"No data found",
              });
          }
      });
    },
    findLimited: function(data, callback) {
        var newreturns = {};
        newreturns.data = [];
        var check = new RegExp(data.search, "i");
        data.pagenumber = parseInt(data.pagenumber);
        data.pagesize = parseInt(data.pagesize);
        async.parallel([
                function(callback) {
                    InvestmentType.count({
                        name: {
                            '$regex': check
                        }
                    }).exec(function(err, number) {
                        if (err) {
                            console.log(err);
                            callback(err, null);
                        } else if (number && number !== "") {
                            newreturns.total = number;
                            newreturns.totalpages = Math.ceil(number / data.pagesize);
                            callback(null, newreturns);
                        } else {
                            callback(null, newreturns);
                        }
                    });
                },
                function(callback) {
                    InvestmentType.find({
                        name: {
                            '$regex': check
                        }
                    }).skip(data.pagesize * (data.pagenumber - 1)).limit(data.pagesize).exec(function(err, data2) {
                        if (err) {
                            console.log(err);
                            callback(err, null);
                        } else if (data2 && data2.length > 0) {
                            newreturns.data = data2;
                            callback(null, newreturns);
                        } else {
                            callback(null, newreturns);
                        }
                    });
                }
            ],
            function(err, data4) {
                if (err) {
                    console.log(err);
                    callback(err, null);
                } else if (data4) {
                    callback(null, newreturns);
                } else {
                    callback(null, newreturns);
                }
            });
    }
};

module.exports = _.assign(module.exports, models);
