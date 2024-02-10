import { Container } from "@mui/material";
import TemplateComponent from "../../components/templateComponent/TemplateComponent";
import Pages, { PageMode } from "../../enums/pages";
import styles from "./Edit.module.scss";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Template } from "../../models/template";
import { getTemplateById } from "../../services/TemplateService";
import Loader from "../../components/loader/Loader";

const Edit: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const localtion = useLocation();
	const { variables } = localtion.state || {};
	const [template, setTemplate] = useState<Template | null>(null);

	useEffect(() => {
		const getTemplate = async () => {
			if (id) {
				try {
					const res = await getTemplateById(id);
					if (res) {
						setTemplate(res);
					} else {
						navigate(Pages.Dashboard);
					}
				} catch (err) {
					console.log(err);
					navigate(Pages.Dashboard);
				}
			} else {
				navigate(Pages.Dashboard);
			}
		};
		getTemplate();
	}, [id, navigate]);

	if (!template) {
		return <Loader />;
	}

	return (
		<Container className={styles.pageContainer} maxWidth='xl'>
			<TemplateComponent defaultName={template.name} defaultTemplate={template?.templateString} mode={PageMode.Edit} defaultVariables={variables} templateId={template._id} />
		</Container>
	);
};

export default Edit;
