//다음
//https://movie.daum.net/api/premovie?page=3&size=20&flag=Y 현재
//https://movie.daum.net/api/premovie?page=2&size=20&flag=C 예정
//네이버
//ul.lst_detail_t1 > li:nth-child(118) > dl > dt > a

import queryselector, { tokenize, DomNode, getTokens, parse } from '../queryselector'

describe('parsing Test', () => {
    test('Tokenize Node', () => {
        const token = tokenize(`<dl class="lst_dsc">`);
        expect(token.tag).toEqual("dl");
        expect(token.className).toEqual("lst_dsc");
    })
    test('Tokenize text', () => {
        const token = tokenize(`test`);
        expect(token.tag).toEqual("text");
        expect(token.text).toEqual("test");
    })
    test("getTokens", () => {
        const tokens = getTokens(`      <dt class="tit">
						
							
							
							
							
							
        <span class="ico_rating_15">15세 관람가</span>
    
    
    

<a href="/movie/bi/mi/basic.naver?code=190320">  보이스  </a>
<!-- N=a:nol.title,r:1,i:190320 -->
</dt>    `);
        const token = tokenize(`<dt class="tit">`);
        expect(tokens.length).toEqual(9);
    })
    test("parse", () => {
        const result = parse(`      <dt class="tit">
						
							
							
							
							
							
        <span class="ico_rating_15">15세 관람가</span>
    
    
    

<a href="/movie/bi/mi/basic.naver?code=190320">  보이스  </a>
<!-- N=a:nol.title,r:1,i:190320 -->
</dt>    `);
        expect(result).toEqual(3);
    })
});