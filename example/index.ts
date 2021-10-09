import { bold, magenta } from "chalk";
import { cold, log } from "termx";
import { REPLCli } from "../index";

const style_name = cold;
const style_command = (s: string) => bold(magenta(s));
const repl = new REPLCli({
    name: "REPL-Example",
    symbol: "example>",
    commands: {
        hello () {
            console.log("Hello World!");
        },

        sum ([a, b]) {
            return +a + +b;
        }
    },

    commandMeta: {
        hello: {
            description: "Just say hello!",
            args: {}
        },

        sum: {
            description: "Returns the sum of 2 numbers!",
            args: {
                A: { type: "string", description: "Number #1" },
                B: { type: "string", description: "Number #2" }
            }
        }
    },

    events: {
        onStart () {
            console.log(`Welcome to the ${style_name("REPL-Example")}, type ${style_command("/help")} to start.`)
        },

        onExit () {
            console.log(`Good bye!`)
        }
    }
});

repl.start()