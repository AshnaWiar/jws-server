import {createJsWithTsEsmPreset, type JestConfigWithTsJest} from 'ts-jest'

const presetConfig = createJsWithTsEsmPreset({
    tsconfig: 'tsconfig.test.json',
})

const jestConfig: JestConfigWithTsJest = {
    ...presetConfig,
    moduleNameMapper: {
        '(.+)\\.js': '$1'
    },
}

export default jestConfig