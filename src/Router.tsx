import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import Edit from "./pages/edit/Edit";
import New from "./pages/new/New";
import Pages from "./enums/pages";

const router = createBrowserRouter([
	{
		path: Pages.Dashboard,
		element: <Dashboard />,
	},
	{
		path: Pages.New,
		element: <New />,
	},
	{
		path: Pages.Edit,
		element: <Edit />,
	},
]);

const Router = () => <RouterProvider router={router} />;

export default Router;
