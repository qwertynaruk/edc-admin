import moment from 'moment';
import toBuddhistYear from './toBuddhistYear';

describe('toBuddhistYear', () => {
  it('return 2562 for 2019', () => {
    expect(toBuddhistYear(moment('2019-06-27'), 'YYYY')).toBe('2562');
  });
  it('Should return corrent date and time in LLLL format', () => {
    expect(toBuddhistYear(moment('2019-06-27T02:15:07+07:00'), 'LLLL')).toBe('Thursday, June 27, 2562 2:15 AM');
  });
  it('Should return correct date without time in LLLL format', () => {
    expect(toBuddhistYear(moment('2019-06-27'), 'LLLL')).toBe('Thursday, June 27, 2562 12:00 AM');
  });
  it('Should return corrent date and time in llll format', () => {
    expect(toBuddhistYear(moment('2019-06-27T02:15:07+07:00'), 'llll')).toBe('Thu, Jun 27, 2562 2:15 AM');
  });
  it('Should return correct date without time in llll format', () => {
    expect(toBuddhistYear(moment('2019-06-27'), 'llll')).toBe('Thu, Jun 27, 2562 12:00 AM');
  });
  it('Should return corrent date and time in LLL format', () => {
    expect(toBuddhistYear(moment('2019-06-27T02:15:07+07:00'), 'LLL')).toBe('June 27, 2562 2:15 AM');
  });
  it('Should return corrent date and time in lll format', () => {
    expect(toBuddhistYear(moment('2019-06-27T02:15:07+07:00'), 'lll')).toBe('Jun 27, 2562 2:15 AM');
  });
  it('Should return correct date without time in lll format', () => {
    expect(toBuddhistYear(moment('2019-06-27'), 'lll')).toBe('Jun 27, 2562 12:00 AM');
  });
  it('Should return corrent date and time with LL format', () => {
    expect(toBuddhistYear(moment('2019-06-27T02:15:07+07:00'), 'LL')).toBe('June 27, 2562');
  });
  it('Should return correct date without time in LL format', () => {
    expect(toBuddhistYear(moment('2019-06-27'), 'LL')).toBe('June 27, 2562');
  });
  it('Should return corrent date and time in ll format', () => {
    expect(toBuddhistYear(moment('2019-06-27T02:15:07+07:00'), 'll')).toBe('Jun 27, 2562');
  });
  it('Should return correct date without time in ll format', () => {
    expect(toBuddhistYear(moment('2019-06-27'), 'll')).toBe('Jun 27, 2562');
  });
  it('Should return corrent date and time in L format', () => {
    expect(toBuddhistYear(moment('2019-06-27T02:15:07+07:00'), 'L')).toBe('06/27/2562');
  });
  it('Should return correct date without time in L format', () => {
    expect(toBuddhistYear(moment('2019-06-27'), 'L')).toBe('06/27/2562');
  });
  it('Should return corrent date and time in l format', () => {
    expect(toBuddhistYear(moment('2019-06-27T02:15:07+07:00'), 'l')).toBe('6/27/2562');
  });
  it('Should return correct date without time in l format', () => {
    expect(toBuddhistYear(moment('2019-06-27'), 'l')).toBe('6/27/2562');
  });
  it('Should return corrent date and time in MM/DD/YYYY format', () => {
    expect(toBuddhistYear(moment('2019-06-27T02:15:07+07:00'), 'MM/DD/YYYY')).toBe('06/27/2562');
  });
  it('Should return correct date without time in MM/DD/YYYY format', () => {
    expect(toBuddhistYear(moment('2019-06-27'), 'MM/DD/YYYY')).toBe('06/27/2562');
  });
  it('Should return corrent date and time in MM/DD/YY format', () => {
    expect(toBuddhistYear(moment('2019-06-27T02:15:07+07:00'), 'MM/DD/YY')).toBe('06/27/62');
  });
  it('Should return correct date without time in MM/DD/YY format', () => {
    expect(toBuddhistYear(moment('2019-06-27'), 'MM/DD/YY')).toBe('06/27/62');
  });
  it('Should return corrent date and time in MM/DD/Y format', () => {
    expect(toBuddhistYear(moment('2019-06-27T02:15:07+07:00'), 'MM/DD/Y')).toBe('06/27/2562');
  });
  it('Should return correct date without time in MM/DD/Y format', () => {
    expect(toBuddhistYear(moment('2019-06-27'), 'MM/DD/Y')).toBe('06/27/2562');
  });
  it('Should return correct date without time in YYYY-MM-DDTHH:mm:ss.sssZ format', () => {
    expect(toBuddhistYear(moment('2019-06-27T02:15:07+07:00'), 'YYYY-MM-DDTHH:mm:ss.sssZ')).toBe(
      '2562-06-27T02:15:07.077+07:00'
    );
  });
  it('Should return corrent date and time in MM/DD/Y format and leap day', () => {
    expect(toBuddhistYear(moment('2020-02-29:15:07+07:00'), 'MM/DD/Y')).toBe('02/29/2563');
  });
  it('Should return correct date without time in MM/DD/Y format and leap day', () => {
    expect(toBuddhistYear(moment('2020-02-29'), 'MM/DD/Y')).toBe('02/29/2563');
  });
  it('Should return correct date without time in YYYY-MM-DDTHH:mm:ss.sssZ format and leap day', () => {
    expect(toBuddhistYear(moment('2020-02-29T02:15:07+07:00'), 'YYYY-MM-DDTHH:mm:ss.sssZ')).toBe(
      '2563-02-29T02:15:07.077+07:00'
    );
  });
});
