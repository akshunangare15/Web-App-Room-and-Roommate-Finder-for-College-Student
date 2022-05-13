/*
Server startup

 */
const path = require('path');
const fs = require('fs');

const app = require('./index');
const debugPrinter = require('./utils/debug_printer');
const constants = require('./config/constants');

const PORT = process.env.PORT || 3000;

const DIR_TEMP_UPLOAD = path.join(__dirname, '/temp/upload');

if (!fs.existsSync(DIR_TEMP_UPLOAD)) {
    if (process.env.NODE_ENV === 'development') {
        debugPrinter.printBackendGreen(`Making Dir: ${DIR_TEMP_UPLOAD}`);
    }

    fs.mkdirSync(DIR_TEMP_UPLOAD, { recursive: true });
}

app.listen(PORT, (err) => {
    if (err) {
        if (process.env.NODE_ENV === 'development') {
            debugPrinter.printBackendRed(err);
        }

        console.log(err);
        return;
    }

    console.log(`Server listening on ${PORT}`);
});
