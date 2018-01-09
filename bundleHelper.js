import { DigilentS3Js } from './dist/digilent-s3-js';
if (typeof window !== 'undefined') {
    window.DigilentS3Js = DigilentS3Js;
}
else {
    exports.DigilentS3Js = DigilentS3Js;
}
