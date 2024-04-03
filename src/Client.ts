import net from 'net';

const client = net.connect({port: 60300}, () => {
    console.log('Connection established.')
});

let wholeData = '';

if (process.argv.length !== 3) {
    throw new Error('Please provide a filename');
} else {
    const fileName = process.argv[2];
    client.write(fileName);
}

client.on('data', (dataChunk) => {
    wholeData += dataChunk;
});

client.on('end', () => {
    console.log(JSON.parse(wholeData));
});