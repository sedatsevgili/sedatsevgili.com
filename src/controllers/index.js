var fs = require('fs');
var path = require('path');

exports.getIndex = function(req, res) {
    var jsonContent = fs.readFileSync(path.join(__dirname, '../../', 'webpack-assets.json'));
    var jsonData = JSON.parse(jsonContent);
    return res.render('pages/index', {
        'bundle_file_name': jsonData['main']['js']
    });
}
