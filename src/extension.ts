'use strict';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('pascalcase-camelcase-to-snake_case-converter started!');

	let disposable = vscode.commands.registerCommand('pascalCamel2Snake', () => {

		// get active TextEditor, to change the text later on
		let editor = vscode.window.activeTextEditor;
		if (!editor) {
			return; // No open text editor
		}

		// Create the editBuilder, to modify the texr
		editor.edit((editBuilder) => {

			// Again, get the current editor, to get the selected text
			let editor = vscode.window.activeTextEditor;
			if (!editor) {
				return; // No open text editor
			}

			for (const selection of editor.selections) {
				let text = editor.document.getText(selection);

				if (!text || text == null)
					return;

				// No WhiteSpaces Allowed
				if (text.match(/\s/g)) {
					vscode.window.showErrorMessage(`Cant't parse '${text}', no Whitespaces allowed`);
					return
				}

				// Check if two capital Letters other than ID are next to each other, in that case no auto convertion possible!
				if (!text.match(/^(((?![A-Z][A-Z]).)|ID)*$/g)) {
					vscode.window.showErrorMessage(`Cant't parse '${text}', because there are 2 or more capital letters - other than 'ID' - next to each other`);
					return;
				}

				// Get the Pascal Case Parts of the original String
				const PascalCaseParts = text.match(/((?:^[a-z]|ID|[A-Z]+)[^A-Z]*)/g)
				if (!PascalCaseParts)
					return;

				// lowercase everything and join it with _underscores_
				const postgresFormatString = PascalCaseParts.join('_').toLowerCase();
				editBuilder.replace(selection, postgresFormatString);
			}
		});
	});

	context.subscriptions.push(disposable);
}
export function deactivate() {
	// empty
}