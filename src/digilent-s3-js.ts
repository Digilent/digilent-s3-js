//import { S3 } from 'aws-sdk';
declare var AWS: any;

export class DigilentS3Js {

    public s3: any;
    public bucketName: string = 'digilent-test';
    public awsRootUrl: string = 'https://s3-us-west-2.amazonaws.com/';

    constructor(
    ) {
        this.s3 = new AWS.S3({
            apiVersion: '2006-03-01',
            params: { Bucket: this.bucketName }
        });
        console.log('DigilentS3Js Constructor Complete');
    }

    //List all objects in the specified folder
    public listFolder(path: string): Promise<Array<string>> {
        return new Promise((resolve, reject) => {
            let params = {
                Bucket: this.bucketName,
                Prefix: path,
            };
            this.s3.listObjects(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    let objectNames = [];
                    data.Contents.forEach((object) => {
                        let name = object.Key.substring(path.length);
                        if (name.length > 0) {
                            objectNames.push(name);
                        }
                    });
                    resolve(objectNames);
                }
            });
        });
    }

}