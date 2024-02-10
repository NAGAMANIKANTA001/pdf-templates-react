import React, { ReactNode, useState } from "react";
import { AppBar, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Toolbar, Typography } from "@mui/material";
import styles from "./Layout.module.scss";
import { SnackbarProvider } from "notistack";
import { Link, useLocation } from "react-router-dom";
import Pages from "../enums/pages";
import { Help } from "@mui/icons-material";

interface ILayoutProps {
	children: ReactNode;
}

const Layout: React.FC<ILayoutProps> = ({ children }) => {
	const location = useLocation();
	const currentRoute = location.pathname;
	const [isInstructionsPanelOpen, setIsInstructionsPanelOpen] = useState(false);

	const handleInstructionsClose = () => {
		setIsInstructionsPanelOpen(false);
	};

	return (
		<SnackbarProvider maxSnack={3}>
			<div className={styles.pageroot}>
				<header className={styles.header}>
					<AppBar position='static'>
						<Toolbar>
							<img height={50} src='/equipLogo.png' alt='logo' />
							<Typography variant='h5'>PDF Template Maker</Typography>

							{currentRoute !== Pages.Dashboard && (
								<Link to={Pages.Dashboard} style={{ color: "white", textDecoration: "none" }}>
									<Typography sx={{ ml: 3 }} variant='h6'>
										Dashboard
									</Typography>
								</Link>
							)}
							<IconButton sx={{ ml: "auto" }} onClick={() => setIsInstructionsPanelOpen(true)}>
								<Help sx={{ color: "white" }} />
							</IconButton>
						</Toolbar>
					</AppBar>
				</header>
				<main className={styles.main}>{children}</main>
				<Dialog maxWidth={"lg"} open={isInstructionsPanelOpen} onClose={handleInstructionsClose} scroll='paper'>
					<DialogTitle>Instructions</DialogTitle>
					<DialogContent dividers>
						<Typography variant='h4'>Hello There...</Typography>
						<br />
						<Typography variant='body1'>This app has 3 Pages, They are : </Typography>
						<ol>
							<li>
								<Typography variant='body2'>Dashboard at route "/"</Typography>
							</li>
							<li>
								<Typography variant='body2'>New at route "/new"</Typography>
							</li>
							<li>
								<Typography variant='body2'>Edit at route "/edit/:id"</Typography>
							</li>
						</ol>
						<Typography variant='h6'>The Dashboard:</Typography>
						<br />
						<Typography variant='body1'>
							This is the landing page. Here, you'll be able to see all the Templates that are already created in a table view. Ofcourse you can use them just by clicking "Import" button
							for the corresponding template.
						</Typography>
						<br />
						<Typography variant='body1'>
							You can also delete the Templates that are not needed anymore just by clicking "Delete" button for the corresponding template. Please note that no confirmation prompts are
							present in the dashboard for faster deletion operations.
						</Typography>
						<br />
						<Typography variant='body1'>
							If you want to create any new Template, Just Click on the "New Template" button at the top of the page. It will take you to "New" page where you can create a new template.
						</Typography>
						<br />
						<br />
						<Typography variant='h6'>New Page:</Typography>
						<br />
						<Typography variant='body1'>In this Page, you will have a text editor. This text editor support having variables along with the normal text.</Typography>
						<br />
						<Typography variant='body1'>
							To add a variable, just type '@' symbol and type any character, then you will see a dropdown with the tag value at the cursor. Just simply click 'Enter' or click on the
							dropdown option with mouse then the variable will added in the text editor
						</Typography>
						<br />
						<Typography variant='body1'>
							If you started typing with '@' symbol and you are seeing dropdown, but you just want it as text now. In that case, just Type 'Esc' in your keyboard which will keep it as
							text.
						</Typography>
						<br />
						<Typography variant='body1'>You can add the same variable any number of times you want. please keep in mind that the variables are "case-insensitive"</Typography>
						<br />
						<Typography variant='body1'>
							Whenever you add a new variable, we add that variable into our variables table on the right side of the page. Using this table, you can provide values to your variables and
							you can also Delete the variables. If you delete any variable from the table, we replace it's place in the text editor with it's name. But if you delete a variable in the
							editor, we will not delete it from our variables table
						</Typography>
						<br />
						<Typography variant='body1'>
							If you don't have any unfilled values in your variables table, you can export the template as pdf just by clicking on "Export to PDF" button. This will replace all the
							variable names with the values you provided in the variables table and will download it as pdf into your device.(If you keep the editor blank and try this. you will get an
							empty PDF).
						</Typography>
						<br />
						<Typography>
							After Typing the template, if you want to save it Just click on "Save Template" button. this will save your template and will Take you to "Edit" page. Don't worry, your
							data will not be lost including any filled variables. You can save your templates even without filling any variables or just as blank, no Restrictions.
						</Typography>
						<br />
						<br />
						<Typography variant='h6'>Edit Page:</Typography>
						<br />
						<Typography variant='body1'>This page is almost the same as "New" page with just 2 additions.</Typography>
						<br />
						<Typography variant='body1'>If you are in this page, then a template is already created. In this page, you use that template and can update it as well if you want.</Typography>
						<br />
						<Typography variant='body1'>
							The First new thing you will see here is, "Rename"(Pen Icon beside the template title) Button. If you click on it, you will be presented with a small popup to change the
							template name.
						</Typography>
						<br />
						<Typography variant='body1'>
							Another new thing you will find is the "Delete" button. Unlike the dashboard, you will need confirm your deletion operation here to avoid any accidental deletions.
						</Typography>
						<br />
						<br />
						<Typography variant='h6'>NOTE : This works by leveraging the APIs of a Express.js Server which performs the Read/Write operations on a Mongo DB Cluster</Typography>
						<br />
						<br />
						<Typography variant='h6'>I think that's all I have to inform. Thank you!!!</Typography>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleInstructionsClose} variant='contained'>
							Got it
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		</SnackbarProvider>
	);
};

export default Layout;
