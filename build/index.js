"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.REPLCli = void 0;
var utils_1 = require("@mysticaldragon/utils");
var termx_1 = require("termx");
var repl_1 = __importDefault(require("repl"));
var chalk_1 = require("chalk");
var Chalk = require("chalk");
var style_error = chalk_1.red;
var style_args = termx_1.highlight;
var style_command = function (s) { return (0, chalk_1.bold)((0, chalk_1.magenta)(s)); };
var REPLCli = /** @class */ (function () {
    function REPLCli(options) {
        this.options = options;
        utils_1.ObjectUtils.setDefaults(options, {
            "symbol": "$>",
            "styles": {},
            "events": {},
            "commands": {},
            "commandMeta": {}
        });
        utils_1.ObjectUtils.setDefaults(options.styles, {
            cli: "cyan"
        });
        utils_1.ObjectUtils.setDefaults(options.events, {
            onStart: function () { },
            onExit: function () { },
            onCommandNotFound: function (context) {
                console.log(style_error("Command not found:"), style_command(context.command));
            }
        });
    }
    REPLCli.prototype.start = function () {
        var _this = this;
        this.options.events.onStart();
        repl_1.default.start({
            prompt: (0, chalk_1.bold)(Chalk[this.options.styles.cli](this.options.symbol)) + " ",
            eval: function (cmd, $, filename, cb) {
                cmd = cmd.trim();
                if (cmd === "exit" || cmd === "q" || cmd === "quit") {
                    _this.options.events.onExit();
                    process.exit(0);
                }
                if (cmd.startsWith("/")) {
                    var _a = cmd.substring(1).split(" ").map(function (x) { return x.trim(); }).filter(function (x) { return !!x; }), command = _a[0], args = _a.slice(1);
                    var context = { command: command, args: args };
                    if (command === "help") {
                        _this.displayHelp(context);
                        return cb(null, undefined);
                    }
                    if (!_this.options.commands[command]) {
                        _this.options.events.onCommandNotFound(context);
                        return cb(null, undefined);
                    }
                    try {
                        var result = _this.options.commands[command](args);
                        cb(null, result);
                    }
                    catch (exc) {
                        cb(exc, null);
                    }
                }
            }
        });
    };
    REPLCli.prototype.displayHelp = function (context) {
        console.log("Welcome to the help menu!");
        if (context.args.length) {
            for (var _i = 0, _a = context.args; _i < _a.length; _i++) {
                var cmdName = _a[_i];
                this.displayCommandHelp(cmdName, true);
            }
        }
        else {
            for (var cmdName in this.options.commands) {
                this.displayCommandHelp(cmdName, false);
            }
        }
    };
    REPLCli.prototype.displayCommandHelp = function (cmdName, extended) {
        var meta = this.options.commandMeta[cmdName];
        if (!meta)
            console.log((0, chalk_1.bold)("-"), style_command("/" + cmdName));
        var paramNames = Object.keys(meta.args);
        var paramNamesText = paramNames.length ? " " + paramNames.map(style_args).join(" ") : "";
        console.log((0, chalk_1.bold)("-"), style_command("/" + cmdName) + paramNamesText + ":", meta.description);
        if (extended) {
            for (var argName in meta.args) {
                var argMeta = meta.args[argName];
                if (!argMeta)
                    continue;
                console.log(" ", (0, chalk_1.bold)("-"), style_args(argName), "(" + argMeta.type + "):", argMeta.description);
            }
        }
    };
    REPLCli.prototype.log = function () {
        var data = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            data[_i] = arguments[_i];
        }
        termx_1.log.apply(void 0, data);
    };
    return REPLCli;
}());
exports.REPLCli = REPLCli;
//# sourceMappingURL=index.js.map