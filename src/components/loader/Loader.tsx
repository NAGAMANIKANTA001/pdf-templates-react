import { Box, CircularProgress } from "@mui/material";

const Loader = () => {
	return (
		<Box sx={{ position: "absolute", height: "100dvh", width: "100vw", top: 0, zIndex: 2, backgroundColor: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
			<CircularProgress />
		</Box>
	);
};

export default Loader;
