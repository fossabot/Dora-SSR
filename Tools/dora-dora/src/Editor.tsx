import * as monaco from 'monaco-editor';
import * as yuescript from './languages/yuescript';
import * as teal from './languages/teal';
import * as lua from './languages/lua';
import * as Service from './Service';

monaco.editor.defineTheme("dora-dark", {
	base: "vs-dark",
	inherit: true,
	rules: [
		{
			token: "invalid",
			foreground: "f44747",
			fontStyle: 'italic',
		},
		{
			token: "self.call",
			foreground: "dcdcaa",
		},
		{
			token: "operator",
			foreground: "cc76d1",
		}
	],
	colors: {},
})

type DoraLang = "tl" | "lua" | "yue";
const completionItemProvider = (triggerCharacters: string[], lang: DoraLang) => {
	return {
		triggerCharacters,
		provideCompletionItems: function(model, position) {
			const line: string = model.getValueInRange({
				startLineNumber: position.lineNumber,
				startColumn: 1,
				endLineNumber: position.lineNumber,
				endColumn: position.column,
			});
			const word = model.getWordUntilPosition(position);
			const range: monaco.IRange = {
				startLineNumber: position.lineNumber,
				endLineNumber: position.lineNumber,
				startColumn: word.startColumn,
				endColumn: word.endColumn,
			};
			let content: string;
			if (lang === "yue") {
				if (position.lineNumber > 1) {
					content = model.getValueInRange({
						startLineNumber: 1,
						startColumn: 1,
						endLineNumber: position.lineNumber - 1,
						endColumn: model.getLineLastNonWhitespaceColumn(position.lineNumber - 1),
					});
				} else {
					content = "";
				}
				content += "\n" + "\t".repeat(model.getLineFirstNonWhitespaceColumn(position.lineNumber) - 1) + "print()\n" + model.getValueInRange({
					startLineNumber: position.lineNumber + 1,
					startColumn: 1,
					endLineNumber: model.getLineCount(),
					endColumn: model.getLineLastNonWhitespaceColumn(model.getLineCount()),
				});
				console.log(content);
			} else {
				content = model.getValue();
			}
			return Service.complete({
				lang, line,
				row: position.lineNumber,
				content
			}).then((res) => {
				if (!res.success) return {suggestions:[]};
				if (res.suggestions === undefined) return {suggestions:[]};
				return {
					suggestions: res.suggestions.map((item) => {
						const [label, desc, itemType] = item;
						let kind = monaco.languages.CompletionItemKind.Variable;
						switch (itemType) {
							case "variable": kind = monaco.languages.CompletionItemKind.Variable; break;
							case "function": kind = monaco.languages.CompletionItemKind.Function; break;
							case "method": kind = monaco.languages.CompletionItemKind.Method; break;
							case "field": kind = monaco.languages.CompletionItemKind.Field; break;
							case "keyword": kind = monaco.languages.CompletionItemKind.Keyword; break;
						}
						return {
							label,
							kind,
							document: desc,
							detail: desc,
							insertText: label,
							range: range,
						};
					}),
				};
			}).catch(() => {
				console.error("failed to complete codes");
			});
		},
	} as monaco.languages.CompletionItemProvider;
};

const hoverProvider = (lang: DoraLang) => {
	return {
		provideHover: function(model, position) {
			const word = model.getWordAtPosition(position);
			if (word === null) return {contents:[]};
			const line: string = model.getValueInRange({
				startLineNumber: position.lineNumber,
				startColumn: 1,
				endLineNumber: position.lineNumber,
				endColumn: word.endColumn,
			});
			return Service.infer({
				lang, line,
				row: position.lineNumber,
				content: model.getValue()
			}).then(function (res) {
				if (!res.success) return {contents:[]};
				if (res.infered === undefined) return {contents:[]};
				const polyText = "polymorphic function (with types ";
				let desc = res.infered.desc;
				if (desc === "<invalid type>") return {contents:[]};
				if (desc.startsWith(polyText)) {
					desc = desc.substring(polyText.length);
					desc = desc.substring(0, desc.length - 1);
					desc = "polymorphic:\n" + desc.split(" and ").join("\n")
					res.infered.desc = desc;
				}
				const contents = [
					{
						value: "```tl\n" + res.infered.desc + "\n```",
					},
				];
				if (res.infered.row !== 0 && res.infered.col !== 0) {
					if (res.infered.file === "") {
						res.infered.file = "current file";
					}
					contents.push({
						value: `${res.infered.file}:${res.infered.row}:${res.infered.col}`
					});
				} else {
					contents.push({
						value: "Lua built-in",
					});
				}
				return {
					range: new monaco.Range(
						position.lineNumber,
						word.startColumn,
						position.lineNumber,
						word.endColumn
					),
					contents,
				};
			}).catch(() => {
				console.error("failed to infer codes");
			});
		},
	} as monaco.languages.HoverProvider;
};

monaco.languages.register({id: 'tl'});
monaco.languages.setLanguageConfiguration("tl", teal.config);
monaco.languages.setMonarchTokensProvider("tl", teal.language);
const tlComplete = completionItemProvider([".", ":"], "tl");
monaco.languages.registerCompletionItemProvider("tl", tlComplete);
monaco.languages.registerHoverProvider("tl", hoverProvider("tl"));

const luaComplete = completionItemProvider([".", ":"], "lua");
monaco.languages.setLanguageConfiguration("lua", lua.config);
monaco.languages.setMonarchTokensProvider("lua", lua.language);
monaco.languages.registerCompletionItemProvider("lua", luaComplete);
monaco.languages.registerHoverProvider("lua", hoverProvider("lua"));

monaco.languages.register({id: 'yue'});
monaco.languages.setLanguageConfiguration("yue", yuescript.config);
monaco.languages.setMonarchTokensProvider("yue", yuescript.language);
const yueComplete = completionItemProvider([".", "::", "\\"], "yue");
monaco.languages.registerCompletionItemProvider("yue", yueComplete);
monaco.languages.registerHoverProvider("yue", hoverProvider("yue"));