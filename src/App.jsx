import "./App.css";
import IconWrapper from "./components/IconWrapper";
import { icons } from './data/icons';

const iconsMap = icons.reduce((acc, iconObj) => {
  acc[iconObj.label] = iconObj;
  return acc;
}, {});

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-gray-100">
      <div className="mb-6">
        <p className="flex items-center gap-2 text-4xl text-blue-800 mb-2">
          Tomorrow dev chat
          <IconWrapper icon={iconsMap.bot.icon} onClick={iconsMap.bot.onClick} />
        </p>
      </div>
      <div className="text-center">
        <p className="text-4xl text-blue-800 mb-2">
          Building projects
          <IconWrapper icon={iconsMap.rocket.icon} onClick={iconsMap.rocket.onClick} />
        </p>
      </div>
    </div>
  );
}

export default App;
