import { Button } from "@/components/ui/button";
import { useIsLoggedIn } from "@/state/auth-store";
import { Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

const Layout = () => {
	const isLoggedIn = useIsLoggedIn();

	return (
		<div className="h-screen w-screen">
			<div className="p-2  flex gap-9 w-max h-max">
				{isLoggedIn || (
					<Link to="/login" className="[&.active]:font-bold">
						<Button>Login</Button>
					</Link>
				)}{" "}
			</div>
			<hr />
			<Outlet />
			<TanStackRouterDevtools />
		</div>
	);
};

export default Layout;
