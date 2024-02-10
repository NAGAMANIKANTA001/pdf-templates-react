import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import Edit from "./pages/edit/Edit";
import New from "./pages/new/New";
import Pages from "./enums/pages";
import Layout from "./layout/Layout";
import NotFound from "./NotFound";

const router = createBrowserRouter([
	{
		path: Pages.Dashboard,
		element: (
			<Layout>
				<Dashboard />
			</Layout>
		),
	},
	{
		path: Pages.New,
		element: (
			<Layout>
				<New />
			</Layout>
		),
	},
	{
		path: Pages.Edit,
		element: (
			<Layout>
				<Edit />
			</Layout>
		),
	},
	{
		path: "*",
		element: <NotFound />,
	},
]);

const Router = () => <RouterProvider router={router} />;

export default Router;
