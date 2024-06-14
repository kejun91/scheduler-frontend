import './App.scss';
import PageNavigation from './components/navigation-bar/NavigationBar';
import * as awsui from '@cloudscape-design/design-tokens';
import { I18nProvider } from '@cloudscape-design/components/i18n';
import enMessages from '@cloudscape-design/components/i18n/messages/all.en';
import Scheduler from './components/scheduler/Scheduler';

function App() {
    document.body.style.backgroundColor = awsui.colorBackgroundLayoutMain;

    return (
        <I18nProvider messages={[enMessages]}>
            <div className="Sticked-Navigation">
                <PageNavigation />
            </div>
            <div className="App">
                <Scheduler />
            </div>
        </I18nProvider>
    );
}

export default App;