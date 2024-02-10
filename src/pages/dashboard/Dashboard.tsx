import { Button, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import styles from "./Dashboard.module.scss";
import { Template } from "../../models/template";
import { useEffect, useState } from "react";
import { deleteTemplate, getAllTemplates } from "../../services/TemplateService";
import { AddCircleOutline, DeleteOutlined, OpenInBrowserOutlined } from "@mui/icons-material";
import Loader from "../../components/loader/Loader";
import { useNavigate } from "react-router-dom";
import Pages from "../../enums/pages";
import { useSnackbar } from "notistack";

const Dashboard = () => {
	const [templates, setTemplates] = useState<Template[]>([]);
	const [isLoadingData, setIsLoadingData] = useState(true);
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();
	useEffect(() => {
		const getData = async () => {
			try {
				const res = await getAllTemplates();
				if (res) {
					setTemplates(res);
					setIsLoadingData(false);
				}
			} catch (err) {
				console.error(err);
			}
		};
		getData();
	}, []);

	const handleNewTemplate = () => {
		navigate(Pages.New);
	};

	const handleOpen = (id: string) => {
		navigate(`/edit/${id}`);
	};

	const handleDelete = async (id: string) => {
		try {
			const res = await deleteTemplate(id);
			if (res) {
				enqueueSnackbar("Template Deleted", { variant: "success" });
			}
			setTemplates((prev) => prev.filter((template) => template._id !== id));
		} catch (err) {
			enqueueSnackbar("Error", { variant: "error" });
		}
	};

	if (isLoadingData) {
		return <Loader />;
	}
	return (
		<Container className={styles.pageContainer} maxWidth='lg'>
			<div className={styles.section}>
				<Typography variant='h4'>Dashboard</Typography>
				<Button startIcon={<AddCircleOutline />} variant='contained' sx={{ ml: "auto" }} onClick={handleNewTemplate}>
					New Template
				</Button>

				<div className={styles.tableContainer}>
					<TableContainer className={styles.tableContainer} sx={{ maxWidth: 1000, maxHeight: 600 }}>
						{templates.length > 0 ? (
							<Table stickyHeader>
								<TableHead>
									<TableRow>
										<TableCell>
											<Typography variant='h6'>Id</Typography>
										</TableCell>
										<TableCell align='left'>
											<Typography variant='h6'>Name</Typography>
										</TableCell>
										<TableCell align='center' sx={{ width: "300px" }}>
											<Typography variant='h6'>Actions</Typography>
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{templates.map((template) => (
										<TableRow key={template._id}>
											<TableCell>{template._id}</TableCell>
											<TableCell align='left'>{template.name}</TableCell>
											<TableCell align='center' sx={{ width: "300px" }}>
												<div className={styles.actions}>
													<Button variant='contained' color='primary' startIcon={<OpenInBrowserOutlined />} onClick={() => handleOpen(template._id)}>
														Import
													</Button>
													<Button variant='contained' color='error' startIcon={<DeleteOutlined />} onClick={() => handleDelete(template._id)}>
														Delete
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						) : (
							<Typography>No Templates were found.</Typography>
						)}
					</TableContainer>
				</div>
			</div>
		</Container>
	);
};

export default Dashboard;
