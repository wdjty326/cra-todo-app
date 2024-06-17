require('@testing-library/jest-dom');

const { server } = require('./src/mocks/node');
beforeAll(() => {
    server.listen({ onUnhandledRequest: 'bypass' });
});

afterEach(() => {
    server.resetHandlers();
});

afterAll(() => {
    server.close();
});