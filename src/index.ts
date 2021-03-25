import cli from 'cli';
import { ImportTrimer } from './ImportTrimer';

interface TTIArgs {
    file: string
}

let args = cli.parse({
    file: ['f', 'The file to process', 'file', '']
}) as TTIArgs;

if(!args.file) {
    cli.error('-f or --file is requred.')
    cli.exit(1);
}

let trimer = new ImportTrimer();
trimer.trimFile(args.file);

export default trimer;