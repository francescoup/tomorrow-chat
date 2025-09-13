import "./App.css";
import Header from "./components/Header";
// import IconWrapper from "./components/IconWrapper";
// import { icons } from './data/icons';

// const iconsMap = icons.reduce((acc, iconObj) => {
//   acc[iconObj.label] = iconObj;
//   return acc;
// }, {});

// Icone commentate in attesa del merge con icon-button


function App() {
  return (
    <div className="flex flex-col min-h-screen w-screen bg-gray-100">
      <Header />
      <main className="flex flex-col items-center justify-center flex-1">
        <div className="mb-6">
          <p className="flex items-center gap-2 text-4xl text-blue-800 mb-2">
            Tomorrow dev chat
            {/* <IconWrapper icon={iconsMap.bot.icon} onClick={iconsMap.bot.onClick} /> */}
          </p>
        </div>
        <div className="text-center">
          <p className="text-4xl text-blue-800 mb-2">
            Building projects
            {/* <IconWrapper icon={iconsMap.rocket.icon} onClick={iconsMap.rocket.onClick} /> */}
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;