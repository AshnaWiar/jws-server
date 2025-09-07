import {jest} from '@jest/globals';


describe('bin.js', () => {

    let mockCreateCLIProgram: jest.Mock<any>;
    let mockParseProgramOptions: jest.Mock<any>;
    let logSpy: jest.SpiedFunction<any>;

    beforeEach(async () => {
        logSpy = jest.spyOn(console, 'log');
        mockCreateCLIProgram = jest.fn();
        mockParseProgramOptions = jest.fn();

        jest.unstable_mockModule('./cli/program.js', () => ({
            createCLIProgram: mockCreateCLIProgram,
            parseProgramOptions: mockParseProgramOptions
        }));

        await import('./cli/program.js');
    })

    afterEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    })

    it('should create a commander program', async () => {
        await import('./bin.js');

        expect(mockCreateCLIProgram).toHaveBeenCalled()
    })

    it('should parse commander options', async () => {
        const mockCommand = {
            parse: jest.fn(),
        };
        mockCreateCLIProgram.mockReturnValue(mockCommand);
        await import('./bin.js');

        expect(mockParseProgramOptions).toHaveBeenCalledWith(mockCommand)
    })

    it('log starting websocket server', async () => {
        const mockedConfig = {
            config: 'mocked'
        }

        mockParseProgramOptions.mockReturnValue(mockedConfig);

        await import('./bin.js');

        expect(logSpy).toHaveBeenCalledWith(
            'Starting webserver with the following options',
            mockedConfig
        );
    })
});
