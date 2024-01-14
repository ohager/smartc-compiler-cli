import {SmartC} from "smartc-signum-compiler";
import {Command} from "commander";
import * as fs from "node:fs/promises";

async function main()
{
    const program = new Command();
    program.name("smartc-compiler-cli")
        .description("CLI SmartC compiler")
        .version('0.1.0', '-v, --version', 'output the current version');
    program.requiredOption("-f, --file <filepath>", "path to a file to compile")
        .option("--format [asm|byte]", "specify output format", "asm");
    program.parse();

    const filePath = program.opts().file;
    const fileContent = (await fs.readFile(filePath, "utf-8")).toString();

    const code = new SmartC({ language: "C", sourceCode: fileContent });

    try
    {
        code.compile();
    }
    catch (e: any)
    {
        throw new Error("Compilation error: " + e.message);
    }

    var output = "";

    switch (program.opts().format)
    {
    case "a":
    case "asm":
        output = code.getAssemblyCode();
        break;
    case "b":
    case "byte":
    case "bytecode":
        output = code.getMachineCode().ByteCode;
        break;
    default:
        throw new Error("Unsupported output format: " + program.opts().format);
    }

    console.log(output);
}

main();