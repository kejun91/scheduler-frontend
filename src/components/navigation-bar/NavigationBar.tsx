import TopNavigation from "@cloudscape-design/components/top-navigation";
import "./NavigationBar.scss";

function NavigationBar() {
    return (
        <>
            <div className="top-navigation-container">
                <TopNavigation
                    identity={{
                        href: "/home",
                        title: "Scheduler"
                    }}
                />
            </div>
        </>
    );
}

export default NavigationBar;