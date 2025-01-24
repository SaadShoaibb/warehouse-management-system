import { Route, Routes } from "react-router-dom";

import Sidebar from "./components/common/Sidebar";

import OverviewPage from "./pages/OverviewPage";
import ProductsPage from "./pages/ProductsPage";
import ClientsPage from "./pages/ClientsPage";
import SalesPage from "./pages/SalesPage";
import OrdersPage from "./pages/OrdersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import SignUp from "./pages/auth/Sign-up";
import SignIn from "./pages/auth/Sign-in";

function App() {

	const ProtectedRoute = ({ children }) => {
		const token = localStorage.getItem("token");
		return token ? children : <Navigate to="/signin" />;
	  };

	return (

		<div className='flex h-screen bg-gray-900 text-gray-100 overflow-hidden'>
			{/* BG */}
			<div className='fixed inset-0 z-0'>
				<div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80' />
				<div className='absolute inset-0 backdrop-blur-sm' />
			</div>

			<Routes>
				<Route path="signin" element={<SignIn />} />
				<Route path="signup" element={<SignUp/>} />
				<Route
					path="/*"
					element={
						<ProtectedRoute>
								<Sidebar />
								<Routes>
									<Route path="overview" element={<OverviewPage />} />
									<Route path="products" element={<ProductsPage />} />
									<Route path="clients" element={<ClientsPage />} />
									<Route path="sales" element={<SalesPage />} />
									<Route path="orders" element={<OrdersPage />} />
									<Route path="analytics" element={<AnalyticsPage />} />
									<Route path="settings" element={<SettingsPage />} />
								</Routes>
						</ProtectedRoute>
					}
				/>
			</Routes>
		</div>
	);
}

export default App;
