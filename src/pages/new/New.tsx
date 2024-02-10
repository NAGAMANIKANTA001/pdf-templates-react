import { Container } from "@mui/material";
import TemplateComponent from "../../components/templateComponent/TemplateComponent";
import { DEFAULT_TEMPLATE } from "../../constants";
import styles from "./New.module.scss";
import { PageMode } from "../../enums/pages";

const New = () => {
	return (
		<Container className={styles.pageContainer} maxWidth='xl'>
			<TemplateComponent defaultTemplate={DEFAULT_TEMPLATE} mode={PageMode.New} />
		</Container>
	);
};

export default New;
