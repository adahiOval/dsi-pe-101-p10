import 'mocha';
import {expect} from 'chai';
import {placeholder} from '../src/PlaceHolder.js'

describe('PlaceHolder', () => {

  it("PlaceHolder", () => {
    expect(placeholder()).to.be.true;
  });

});