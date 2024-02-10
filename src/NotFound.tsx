import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Pages from "./enums/pages";

const NotFound = () => {
	const navigate = useNavigate();
	return (
		<Box sx={{ width: "100vw", height: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px" }}>
			<Typography variant='h3'>404 - Page Not Found</Typography>
			<Button size='large' onClick={() => navigate(Pages.Dashboard)} variant='contained'>
				Go to dashboard
			</Button>
		</Box>
	);
};

export default NotFound;
