export default function queryselector(html: string): string {
    return "abc";
}
export class DomNode {
    tag: string;
    className: string;
    text: string;
    childs: DomNode[];
    constructor(tag: string, className: string = "", text: string = "") {
        this.tag = tag;
        this.childs = [];
        this.className = className;
        this.text = text;
    }
}
export function tokenize(str: string): DomNode {
    str = str.trim();

    const words = str.split(" ");

    let tagName: string = "";
    let className: string = "";
    let text: string = "";
    if (str[0] !== "<") {
        tagName = 'text';
        text = str;
    } else {
        tagName = words[0].slice(1);
        if (tagName[tagName.length - 1] == ">") tagName = tagName.slice(0, -1);
        for (let i = 1; i < words.length; i++) {
            if (words[i].length < 1) continue;
            if (words[i].slice(0, 5) === 'class') {
                let strarr: string[] = words[i].split(`"`);
                className = strarr[1];
            }
        }
    }

    return new DomNode(tagName, className, text);
}
export function getTokens(html: string): DomNode[] {
    function getTagPos(start: number): number[] {
        if (html[start] !== "<") throw Error(`시작 위치 : ${start}~ 태그 아님`);
        let end: number = start + 1;
        while (end < html.length && html[end] !== ">") {
            end++;
        }
        if (html[end] !== ">") throw Error(`끝 위치 : ~${end} 태그 아님`);
        return [start, end];
    }
    function getTextPos(start: number): number[] {
        if (html[start] === "<" && html[start] === ">") throw Error(`시작 위치 : ${start}~ 텍스트 아님`);
        let end: number = start + 1;
        while (end < html.length && html[end] !== "<") {
            end++;
        }
        return [start, end - 1];
    }
    html = html.trim();
    const size = html.length;
    let tokens: DomNode[] = new Array<DomNode>();
    for (let i = 0; i < size;) {
        const s_e: number[] = (html[i] === '<') ? getTagPos(i) : getTextPos(i);
        const curtoken: DomNode = tokenize(html.slice(s_e[0], s_e[1] + 1));
        if (curtoken.tag !== 'text' || curtoken.text.length > 0) tokens.push(curtoken);
        i = s_e[1] + 1;
    }
    return tokens;
}

export function parse(html: string): DomNode {
    if (html.length <= 0) return new DomNode('text', "", "");
    const tokens: DomNode[] = getTokens(html);
    let stack: DomNode[] = [];
    if (tokens.length < 0 || tokens[0].tag === 'text') throw new Error("잘못된 HTML");
    stack.push(tokens[0]);
    for (let i = 1; i < tokens.length; i++) {
        if (tokens[i].tag === 'text') stack[stack.length - 1].childs.push(tokens[i]);
        else if (tokens[i].tag[0] === '/') {
            if (tokens[i].tag === '/' + stack[stack.length - 1].tag) {
                stack.pop();
            } else {
                throw new Error("잘못된 HTML");
            }
        } else {
            stack[stack.length - 1].childs.push(tokens[i]);
            stack.push(tokens[i]);
        }
    }
    return tokens[0];
}