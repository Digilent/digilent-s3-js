declare var AWS: any;

export class DigilentS3Js {

    private s3: any;
    private bucketName: string = '';
    private awsRootUrl: string = '';

    constructor(
        region: string = 'us-west-2',
        bucketName: string = ''
    ) {
        this.initialize(region, bucketName);
    }

    /********************************************************************************
     * Initialize the S3 object configuration options.
     * @param region The AWS region.
     * @param bucketName The name of the AWS S3 bucket to set as the default ('active') bucket.
     ********************************************************************************/
    public initialize(region: string = 'us-west-2', bucketName: string = '') {
        this.awsRootUrl = 'https://s3-' + region + '.amazonaws.com/';
        this.bucketName = bucketName;

        //Create internal S3 Object
        this.s3 = new AWS.S3({
            apiVersion: '2006-03-01',
            params: { Bucket: this.bucketName }
        });
    }

    /********************************************************************************
     * List all objects in the specified bucket with the specified prefix.  This function returns a promise that resolves with an array of string object paths.  The prefix is stripped from all object paths before returning.  If no bucketname is provided the active bucket is used.  If no prefix is provided all objects are returned.
     * @param prefix An object prefix (path) filter to apply.  Only objects with the specified prefix will be returned.
     * @param bucketName The name of the S3 bucket to list. Defaults to the 'active' bucket if not specified.
     ********************************************************************************/
    public listObjects(prefix: string = '', bucketName: string = ''): Promise<Array<string>> {
        return new Promise((resolve, reject) => {

            let params = {
                Bucket: bucketName == '' ? this.bucketName : bucketName,
                Prefix: prefix,
            };
            this.s3.listObjects(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    let objectNames = [];
                    data.Contents.forEach((object) => {
                        let name = object.Key.substring(prefix.length);
                        if (name.length > 0) {
                            objectNames.push(name);
                        }
                    });
                    resolve(objectNames);
                }
            });
        });
    }

    /********************************************************************************
     * Retrieve an object from S3.  This function returns a promise that resolves with the binary object.
     * @param key The full object name including the prefix/path.
     * @param bucketName The name of the S3 bucket containing the object. Defaults to the 'active' bucket if not specified.
     ********************************************************************************/
    public getObject(objectName: string, bucketName: string = ''): Promise<string> {
        return new Promise((resolve, reject) => {
            let params = {
                Bucket: bucketName == '' ? this.bucketName : bucketName,
                ResponseContentEncoding: 'null',
                Key: objectName
            };
            this.s3.getObject(params, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.Body);
                }
            });
        });
    }

}
