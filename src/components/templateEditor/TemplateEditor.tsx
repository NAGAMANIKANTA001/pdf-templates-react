import { TagData } from "@yaireo/tagify";
import Tagify from "@yaireo/tagify";
import { Dispatch, SetStateAction, useCallback, useEffect, useRef } from "react";
import styles from "./TemplateEditor.module.scss";
import { IVariable } from "../../models/template";

interface ITemplateEditor {
	template: string;
	setTemplate: Dispatch<SetStateAction<string>>;
	setVariables: Dispatch<SetStateAction<IVariable[]>>;
	removeList: string[];
	setRemoveList: Dispatch<SetStateAction<string[]>>;
}

const TemplateEditor: React.FC<ITemplateEditor> = ({ setVariables, template, setTemplate, removeList, setRemoveList }) => {
	const inputRef = useRef<HTMLTextAreaElement | null>(null);
	const tagifyRef = useRef<Tagify<TagData> | null>(null);

	const addVariable = useCallback(
		(variable: string) => {
			if (tagifyRef.current) {
				const newValue = tagifyRef.current.getMixedTagsAsString();
				console.log(newValue);
			}
			setVariables((existingVariables) => {
				const isNewVariable = existingVariables.every((v) => v.name !== variable);
				if (isNewVariable) {
					return [...existingVariables, { name: variable, value: "" }];
				} else {
					return [...existingVariables];
				}
			});
		},
		[setVariables]
	);

	const removeTag = (name: string) => {
		if (tagifyRef.current) {
			tagifyRef.current.removeTags(name, false, 0);
		}
	};
	const convertToText = useCallback((tag: HTMLElement, name: string) => {
		if (tagifyRef.current) {
			tagifyRef.current.insertAfterTag(tag, name);
			removeTag(name);
		}
	}, []);
	const getTag = (name: string) => {
		if (tagifyRef.current) {
			return tagifyRef.current.getTagElmByValue(name);
		}
	};
	const handleDeleteVariable = useCallback(
		(name: string) => {
			if (tagifyRef.current) {
				const tag = getTag(name);
				if (tag) {
					convertToText(tag, name);
					setTimeout(() => {
						handleDeleteVariable(name);
					}, 10);
				}
			}
		},
		[convertToText]
	);

	useEffect(() => {
		if (removeList.length > 0) {
			removeList.forEach((value) => {
				handleDeleteVariable(value);
			});
			setRemoveList([]);
		}
	}, [handleDeleteVariable, removeList, setRemoveList]);

	useEffect(() => {
		const input = inputRef.current;
		if (input) {
			tagifyRef.current = new Tagify<TagData>(input, {
				mode: "mix",
				pattern: /@/,
				whitelist: [],
				editTags: false,
				dropdown: {
					enabled: 1,
					position: "text",
					highlightFirst: true,
				},
				callbacks: {
					add: (e) => {
						const data = e.detail.data?.value;
						if (data) {
							addVariable(data);
							console.log(data);
						}
					},
					remove: console.log,
				},
			});
			tagifyRef.current.on("change", (e) => {
				setTemplate(e.detail.value);
			});
			return () => {
				if (tagifyRef.current) {
					tagifyRef.current.destroy();
				}
			};
		}
	}, [addVariable, setTemplate]);

	return (
		<>
			<textarea
				ref={inputRef}
				defaultValue={template}
				className={styles.textEditor}
				onSelectCapture={(e) => {
					console.log(e.currentTarget);
				}}
			></textarea>
		</>
	);
};

export default TemplateEditor;
