import { NodeType as Node } from "dora";

declare module 'Button' {

interface Param {
	text: string;
	x?: number;
	y?: number;
	width: number;
	height: number;
	fontName?: string;
	fontSize?: number;
}

class Button extends Node {
	private constructor();
	text: string;
}

interface ButtonClass {
	(this: void, param: Param): Button;
}

const buttonClass: ButtonClass;
export = buttonClass;

} // module 'Button'