module.exports = {
    // preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel'
    "roots": [
        "<rootDir>/tests"
    ],
    "testMatch": [
        "**/__tests__/**/*.+(ts|tsx|js)",
        "**/?(*.)+(spec|test).+(ts|tsx|js)"
    ],
    "transform": {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    "testEnvironment": "node"
}
