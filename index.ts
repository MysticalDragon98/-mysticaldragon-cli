import { ObjectUtils } from "@mysticaldragon/utils";
import { highlight, log } from "termx";
import REPL from "repl";
import { bold, magenta, red } from "chalk";

const Chalk = require("chalk");
const style_error = red;
const style_args = highlight;
const style_command = (s: string) => bold(magenta(s));

interface REPLOptions {
    name: string;
    symbol?: string,

    styles?: {
        cli: string
    }
    
    commands?: {
        [name: string]: (args: string[]) => any
    };

    commandMeta?: {
        [name: string]: {
            description: string;
            args: {
                [name: string]: {
                    type: string,
                    description: string
                }
            }
        }
    };

    events?: {
        onStart?: () => any,
        onExit?: () => any,
        onCommandNotFound?: (context: CommandContext) => any
    }
}

interface CommandContext {
    command: string;
    args: string[];
}

export class REPLCli {

    constructor (private options: REPLOptions) {
        ObjectUtils.setDefaults(options, {
            "symbol": "$>",
            "styles": {},
            "events": {},
            "commands": {},
            "commandMeta": {}
        });

        ObjectUtils.setDefaults(options.styles, {
            cli: "cyan"
        });

        ObjectUtils.setDefaults(options.events, {
            onStart () {},
            onExit  () {},
            onCommandNotFound (context: CommandContext) {
                console.log(style_error("Command not found:"), style_command(context.command))
            }
        });
    }

    start () {
        this.options.events!.onStart!();
        
        REPL.start({
            prompt: bold(Chalk[this.options.styles!.cli](this.options.symbol!)) + " ",

            eval: (cmd: string, $, filename, cb) => {
                cmd = cmd.trim();
                if (cmd === "exit" || cmd === "q" || cmd === "quit") {
                    this.options.events!.onExit!();
                    process.exit(0);
                }

                if (cmd.startsWith("/")) {
                    const [ command, ...args ] = cmd.substring(1).split(" ").map(x => x.trim()).filter(x => !!x);
                    const context = <CommandContext>{ command, args };
                    
                    if (command === "help") {
                        this.displayHelp(context);
                        return cb(null, undefined);
                    }

                    if (!this.options.commands![command]) {
                        this.options.events!.onCommandNotFound!(context)
                        return cb(null, undefined);
                    }

                    try {
                        const result = this.options.commands![command]!(args);
                        
                        cb(null, result);
                    } catch (exc) {
                        cb(exc as Error, null);
                    }
                }
            }
        })
    }

    displayHelp (context: CommandContext) {
        console.log("Welcome to the help menu!");

        if (context.args.length) {
            for (const cmdName of context.args) {
                this.displayCommandHelp(cmdName, true);
            }
        } else {
            for (const cmdName in this.options.commands!) {
                this.displayCommandHelp(cmdName, false);
            }
        }
    }

    displayCommandHelp (cmdName: string, extended: boolean) {
        const meta = this.options.commandMeta![cmdName];

        if (!meta) console.log(bold("-"), style_command("/" + cmdName));
        
        const paramNames = Object.keys(meta.args);
        const paramNamesText = paramNames.length? " " + paramNames.map(style_args).join(" ") : "";

        console.log(bold("-"), style_command("/" + cmdName) + paramNamesText  + ":", meta.description);

        if (extended) {
            for (let argName in meta.args) {
                const argMeta = meta.args[argName];

                if(!argMeta) continue;

                console.log(" ", bold("-"), style_args(argName), "(" + argMeta.type + "):", argMeta.description);
            }
        }
    }

    log (...data: any) {
        log(...data);
    }

}