import styles from "./TemplateComponent.module.scss";
import TemplateEditor from "../templateEditor/TemplateEditor";
import { useEffect, useState } from "react";
import { IVariable } from "../../models/template";
import {
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from "@mui/material";
import { DeleteForeverOutlined, DeleteOutline, EditRounded, FileDownload, Save } from "@mui/icons-material";
import jsPDF from "jspdf";
import { VARIABLES_FROM_TEMPLATE_RE } from "../../constants";
import Pages, { PageMode } from "../../enums/pages";
import { createTemplate, deleteTemplate, getAllTemplates, updateTemplate } from "../../services/TemplateService";
import Grid2 from "@mui/material/Unstable_Grid2";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

interface ITemplateComponentProps {
	mode: PageMode;
	defaultTemplate: string;
	defaultName?: string;
	defaultVariables?: IVariable[];
	templateId?: string;
}

const TemplateComponent: React.FC<ITemplateComponentProps> = ({ defaultTemplate, mode, defaultName, defaultVariables, templateId }) => {
	const navigate = useNavigate();
	const [variables, setVariables] = useState<IVariable[]>(defaultVariables ?? []);
	const [templateString, setTemplateString] = useState<string>(defaultTemplate);
	const [templateName, setTemplateName] = useState<string>(defaultName ?? "Create New Template");
	const [isEditingName, setIsEditingName] = useState(false);
	const [removeList, setRemoveList] = useState<string[]>([]);
	const [renameInput, setRenameInput] = useState<string>(templateName);
	const [isRenaming, setIsRenaming] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isDeletePopupVisible, setIsDeletePopupVisible] = useState(false);
	const { enqueueSnackbar } = useSnackbar();

	const getTemplateVariables = (template: string): IVariable[] => {
		const regex = VARIABLES_FROM_TEMPLATE_RE;
		const matches = [...template.matchAll(regex)];
		const uniqueVars = [...new Set(matches.map((match) => match[1]))];
		return uniqueVars.map((variable) => ({ name: variable, value: "" }));
	};

	useEffect(() => {
		setTemplateString(defaultTemplate);
		if (!defaultVariables) {
			console.log(getTemplateVariables(defaultTemplate));
			setVariables([...new Set(getTemplateVariables(defaultTemplate))]);
		}
		getAllTemplates();
	}, [defaultTemplate, defaultVariables]);

	const handleChangeVariableValue = (newValue: string, name: string) => {
		setVariables((prevVariables) => prevVariables.map((variable) => (variable.name === name ? { ...variable, value: newValue } : variable)));
	};

	const deleteVariable = (name: string) => {
		setVariables((prevVariables) => prevVariables.filter((variable) => variable.name !== name));
		setRemoveList((prev) => [...prev, name]);
		enqueueSnackbar("Variable deleted", { variant: "info" });
	};

	const replaceVariablesWithValues = () => {
		let result = templateString;
		variables.forEach(({ name, value }) => {
			const placeholder = new RegExp(`\\[\\[{"value":"${name}".*?}]]`, "g");
			result = result.replace(placeholder, value);
		});
		return result;
	};
	const downloadPdf = (content: string) => {
		const pdf = new jsPDF();
		pdf.text(content, 10, 10);
		pdf.save("download.pdf");
	};

	const handleExportToPDF = () => {
		const pdfContent = replaceVariablesWithValues();
		downloadPdf(pdfContent);
		enqueueSnackbar("File downloaded successfully", { variant: "success" });
	};

	const handleSaveTemplate = async () => {
		if (mode === PageMode.New) {
			try {
				const res = await createTemplate({
					name: "New Template",
					templateString: templateString,
				});
				if (res) {
					enqueueSnackbar("Template created successfully", { variant: "success" });
					navigate(`/edit/${res._id}`, {
						state: {
							variables,
						},
					});
				}
			} catch (err) {
				enqueueSnackbar("Error", { variant: "error" });
				console.log(err);
			}
		} else if (templateId) {
			try {
				const res = await updateTemplate(templateId, {
					templateString: templateString,
				});
				if (res) {
					enqueueSnackbar("Template updated successfully", { variant: "success" });
				}
			} catch (err) {
				console.log(err);
			}
		}
	};
	const handleRename = async () => {
		if (templateId) {
			setIsRenaming(true);
			try {
				const res = await updateTemplate(templateId, {
					name: renameInput,
				});
				if (res) {
					setTemplateName(renameInput);
					enqueueSnackbar("Rename successful", { variant: "success" });
				}
			} catch (err) {
				console.log(err);
				enqueueSnackbar("Rename failed", { variant: "error" });
			}
			setIsRenaming(false);
			setIsEditingName(false);
		}
	};

	const handleDelete = async () => {
		if (templateId) {
			setIsDeleting(true);
			try {
				const res = await deleteTemplate(templateId);
				if (res) {
					enqueueSnackbar("Template Deleted", { variant: "success" });
					navigate(Pages.Dashboard);
				}
			} catch (err) {
				console.log(err);
			}
			setIsDeleting(false);
		}
	};

	return (
		<div className={styles.componentContainer}>
			<Grid2 container spacing={2} sx={{ mt: 0 }}>
				<Grid2 xs={12}>
					<div className={styles.titleRow}>
						{mode === PageMode.Edit && (
							<IconButton
								onClick={() => {
									setIsEditingName(true);
									setRenameInput(templateName);
								}}
								sx={{ border: "1px solid #1976D2" }}
							>
								<EditRounded color='primary' />
							</IconButton>
						)}
						<Typography variant='h4'>{templateName}</Typography>
					</div>
				</Grid2>
				<Grid2 xs={6}>
					<Typography sx={{ color: "#0047AB", fontStyle: "italic" }} variant='subtitle2'>
						Instruction : Type '@' followed by any character. Then select from dropdown to add a variable.
					</Typography>
				</Grid2>
				<Grid2 xs={6}>
					<div className={styles.buttonsWrapper}>
						<Button variant='contained' onClick={handleSaveTemplate} startIcon={<Save />}>
							Save Template
						</Button>
						<Button variant='contained' onClick={handleExportToPDF} disabled={variables.some((variable) => variable.value.length < 1)} startIcon={<FileDownload />}>
							Export to PDF
						</Button>
						{mode === PageMode.Edit && templateId && (
							<Button color='error' sx={{ ml: "auto" }} onClick={() => setIsDeletePopupVisible(true)} variant='contained' startIcon={<DeleteForeverOutlined />}>
								Delete Template
							</Button>
						)}
					</div>
				</Grid2>
			</Grid2>

			<Grid2 className={styles.componentContainer} container xs={12} spacing={2}>
				<Grid2 xs={6}>
					<TemplateEditor setVariables={setVariables} template={templateString} setTemplate={setTemplateString} removeList={removeList} setRemoveList={setRemoveList} />
				</Grid2>
				<Grid2 xs={6}>
					<div>
						{variables.length > 0 ? (
							<TableContainer className={styles.tableContainer} sx={{ maxHeight: 600 }}>
								<Table stickyHeader>
									<TableHead>
										<TableRow>
											<TableCell>
												<Typography variant='h6'>Variable Name</Typography>
											</TableCell>
											<TableCell align='center' sx={{ width: "200px" }}>
												<Typography variant='h6'>Value</Typography>
											</TableCell>
											<TableCell align='center' sx={{ width: "100px" }}>
												<Typography variant='h6'>Delete</Typography>
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{variables.map((variable) => (
											<TableRow key={variable.name}>
												<TableCell>{variable.name}</TableCell>
												<TableCell align='center' sx={{ width: "200px" }}>
													<TextField value={variable.value} onChange={(e) => handleChangeVariableValue(e.target.value, variable.name)} />
												</TableCell>
												<TableCell align='center' sx={{ width: "100px" }}>
													<Button sx={{ width: "100%" }} variant='outlined' color='error' onClick={() => deleteVariable(variable.name)} startIcon={<DeleteOutline />}>
														Delete
													</Button>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						) : (
							<Typography variant='subtitle1' align='center'>
								No Variables found
							</Typography>
						)}
					</div>
				</Grid2>
			</Grid2>
			<Dialog onClose={() => setIsEditingName(false)} open={isEditingName}>
				<DialogTitle>Rename Template</DialogTitle>
				<DialogContent sx={{ p: 3, pt: "16px !important" }}>
					<TextField
						onChange={(e) => {
							setRenameInput(e.target.value);
						}}
						label='Rename'
						value={renameInput}
						disabled={isRenaming}
					/>
				</DialogContent>
				<DialogActions>
					<Button variant='contained' disabled={isRenaming || renameInput === templateName || renameInput.length === 0} onClick={() => handleRename()}>
						{isRenaming ? <CircularProgress /> : "Done"}
					</Button>
					<Button variant='outlined' onClick={() => setIsEditingName(false)} disabled={isRenaming}>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog onClose={() => setIsDeletePopupVisible(false)} open={isDeletePopupVisible}>
				<DialogTitle color='error'>Delete Template</DialogTitle>
				<DialogContent sx={{ p: 3, pt: "16px !important" }}>
					<Typography variant='body1'>Are you sure you want delete the template? This operation is irreversible.</Typography>
				</DialogContent>
				<DialogActions>
					<Button variant='contained' color='error' onClick={() => handleDelete()} disabled={isDeleting}>
						{isRenaming ? <CircularProgress /> : "DELETE"}
					</Button>
					<Button variant='outlined' onClick={() => setIsDeletePopupVisible(false)} disabled={isDeleting}>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default TemplateComponent;
