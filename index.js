var cli = require('cli'),
    factory = require('./lib/containerFactory'),
    storageSync = require('cloud-storage-sync');

cli.parse({
});

cli.main((args, options) => {
    if (args.length !== 2) {
        throw new Error('You must specify 2 arguments: source container, destination container');
    }
    var sourceStr = args[0];
    var destStr = args[1];
    var sourceContainer = factory.create(sourceStr);
    var destinationContainer = factory.create(destStr);
    var containerSync = new storageSync.ContainerSync(sourceContainer, destinationContainer);
    var filesCopied = 0;
    var filesSkipped = 0;
    var totalFiles = 0;
    containerSync.on('file', (filePath) => {
        process.stdout.write(`Processing "${filePath}"...`);
    });

    containerSync.on('fileDone', (data) => {
        totalFiles++;
        switch (data.action) {
        case 'copy':
            process.stdout.write("copied.\n");
            filesCopied++;
            break;
        case 'skip':
            process.stdout.write("skipped.\n");
            filesSkipped++;
            break;
        default:
            process.stdout.write("done.\n");
        }
    });

    containerSync.on('syncDone', (data) => {
        console.log(`Done. Total files ${totalFiles}. ${filesCopied} files copied. ${filesSkipped} files skipped.`);
    });

    containerSync.sync().catch((e) => {
        console.log(e);
        console.log(e.stack);
    });
});