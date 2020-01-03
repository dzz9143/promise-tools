import { getMessage } from '../src/index';

describe('getMessage', () => {
    it('should return hello + name', () => {
        expect(getMessage('ts')).toEqual('hello ts');
    });
});