// const otf2ttfobject = require('fonteditor-core').otf2ttfobject;
// const TTFWriter = require('fonteditor-core').TTFWriter;

// function otf2ttf() {
//   // replace ext
//   file.path = replaceExt(file.path, '.ttf');

//   // ttf info
//   var ttfBuffer;
//   var ttfObj;

//   // try otf2ttf
//   try {

//     ttfObj = otf2ttfobject(b2ab(file.contents), opts);

//     ttfBuffer = ab2b(new TTFWriter(opts).write(ttfObj));

//   }
//   catch (ex) {
//     cb(ex);
//   }

//   if (ttfBuffer) {
//     file.contents = ttfBuffer;
//     file.ttfObject = ttfObj;
//     cb(null, file);
//   }
// }
