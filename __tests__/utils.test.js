const {convertTimestampToDate, createLookupObject} = require('../db/seeds/utils');


describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    //arrange
    const input = { key: "value" };
    //act
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    //assert
    expect(result).toEqual(expected);
  });
});

describe('createLookupObject function', () => {
  test('Returns an empty object when passed an empty array', () => {
    //arrange
    const input = []
    //act
    const action = createLookupObject(input)
    //assert
    expect(action).toEqual({})
  })
   test('Returns an object with the correct key and value reference when passed an array with one object', () => {
    //arrange
    const input = [{snackName : 'chocolate', id: 1}]
    const expected = {chocolate : 1}
    //act
    const action = createLookupObject(input, 'snackName', 'id')
    //assert
    expect(action).toEqual(expected)
  })
   test('Returns an object with correct keys and values when passed an array of multiple objects', () => {
    //arrange
    const input = [{snackName : 'chocolate', id: 1},{snackName : 'crisps', id: 2}]
    const expected = {chocolate : 1, crisps: 2}
    //act
    const action = createLookupObject(input, 'snackName', 'id')
    //assert
    expect(action).toEqual(expected)
  })
   test('Original array is unmutated after function has returned the object', () => {
    //arrange
    const input = [{snackName : 'chocolate', id: 1},{snackName : 'crisps', id: 2}]
    //act
    const action = createLookupObject(input, 'snackName', 'id')
    //assert
    expect(input).toEqual([{snackName : 'chocolate', id: 1},{snackName : 'crisps', id: 2}])
  })
})

