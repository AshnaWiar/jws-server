import {Command, program} from "commander";
import {createCLIProgram, parseProgramOptions} from "./program.js";
import {jest} from '@jest/globals';

describe('createCLIProgram', () => {
    let SUT: Command

    beforeEach(() => {
        SUT = createCLIProgram()
    })
    it('should have name', () => {
        expect(SUT.name()).toEqual('jws-server');
    });

    [
        {
            name: 'version', flag: '-v, --version', description: 'print version', default: undefined,
        },
        {
            name: 'host', flag: '-H, --host <hostname>', description: 'Websocket server hostname', default: 'localhost',
        },
        {
            name: 'port', flag: '-p, --port <port>', description: 'Websocket server port', default: 3000,
        }
    ].forEach((expectedOption) => {
        it(`should have option for ${expectedOption.name}`, () => {

            const option = SUT.options.find(o => o.name() === expectedOption.name)

            expect(option).not.toBeUndefined()
            expect(option!.name()).toEqual(expectedOption.name)
            expect(option!.flags).toEqual(expectedOption.flag)
            expect(option!.description).toEqual(expectedOption.description)
            expect(option!.defaultValue).toEqual(expectedOption.default)
        });
    });
})

describe('parseProgramOptions', () => {

    let opts = jest.fn();
    let parse = jest.fn();
    let logSpy: jest.SpiedFunction<any>;

    beforeEach(() => {
        logSpy = jest.spyOn(console, 'log');
        opts.mockReturnValue({
            host: 'test_host',
            port: 'test_port',
        })
        parse.mockReturnValue({
            args: [],
            opts,
        })
    })

    afterEach(() => {
        logSpy.mockReset();
    })

    it('should call parse on command', () => {
        parseProgramOptions({
            parse,
            opts,
        } as unknown as Command);

        expect(parse).toHaveBeenCalled();
    })


    it('should display help when argument is help', () => {
        const help = jest.fn();

        parseProgramOptions({
            parse: parse.mockReturnValue({
                args: ['help'],
                opts,
                help
            }),
            opts,
        } as unknown as Command);

        expect(help).toHaveBeenCalled();
    })

    it('should display version when argument is version', () => {
        const version = jest.fn();
        const exitSpy = jest.spyOn(process, 'exit').mockImplementation((code): never => {
            throw new Error(`process.exit called with code ${code}`);
        });
        try {
        parseProgramOptions({
            parse: parse.mockReturnValue({
                args: ['version'],
                opts,
                version
            }),
            opts,
        } as unknown as Command);
        } catch (e: any) {
            expect(e.message).toBe('process.exit called with code 0');
        }
        expect(version).toHaveBeenCalled();
        expect(exitSpy).toHaveBeenCalledWith(0);
        exitSpy.mockReset()
    })
})
