'use strict'

var storageSync = require('cloud-storage-sync'),
    AzureContainer = storageSync.Containers.AzureBlobContainer,
    S3Container = storageSync.Containers.S3Container;

class ContainerFactory {
    static create(initString) {
        var matches = initString.match(/(s3|azure-blob):\/\/(.+):(.+)@([^\/]+)\//);
        if (!matches) {
            throw new Error(`Invalid container string: ${initString}`);
        }
        switch (matches[1]) {
        case 's3':
            return new S3Container(matches[4], matches[2], matches[3]);
            break;
        case 'azure-blob':
            return new AzureContainer(matches[4], matches[2], matches[3]);
            break;
        default:
            throw new Error(`Unknown container type: ${matches[1]}`);
        }
    }
}

module.exports = ContainerFactory;