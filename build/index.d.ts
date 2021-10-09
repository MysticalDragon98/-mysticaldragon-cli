interface REPLOptions {
    name: string;
    symbol?: string;
    styles?: {
        cli: string;
    };
    commands?: {
        [name: string]: (args: string[]) => any;
    };
    commandMeta?: {
        [name: string]: {
            description: string;
            args: {
                [name: string]: {
                    type: string;
                    description: string;
                };
            };
        };
    };
    events?: {
        onStart?: () => any;
        onExit?: () => any;
        onCommandNotFound?: (context: CommandContext) => any;
    };
}
interface CommandContext {
    command: string;
    args: string[];
}
export declare class REPLCli {
    private options;
    constructor(options: REPLOptions);
    start(): void;
    displayHelp(context: CommandContext): void;
    displayCommandHelp(cmdName: string, extended: boolean): void;
    log(...data: any): void;
}
export {};
