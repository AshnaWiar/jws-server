describe('index.ts', () => {
    it("logs 'Happy developing ✨' to the console", async () => {
        const logSpy = import.meta.jest.spyOn(console, 'log').mockImplementation(() => {
        });

        await import('./index.js');
        expect(logSpy).toHaveBeenCalledWith('Happy developing ✨');

        logSpy.mockRestore();
    });
})