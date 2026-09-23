import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MegaMenuWrapper } from './MegaMenus/MegaMenuWrapper';
import { SareeMegaMenu } from './MegaMenus/SareeMegaMenu';
import { CollectionMegaMenu } from './MegaMenus/CollectionMegaMenu';
import { SilkWeaveMegaMenu } from './MegaMenus/SilkWeaveMegaMenu';
import { JournalMegaMenu } from './MegaMenus/JournalMegaMenu';

type MenuType = 'sarees' | 'collections' | 'silk-weaves' | 'journal' | null;

export const DesktopNavigation = () => {
  const [activeMenu, setActiveMenu] = useState<MenuType>(null);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);

  const handleMouseEnter = (menu: MenuType) => {
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    // Small delay to prevent flickering when moving from link to menu
    setTimeout(() => {
      if (!isHoveringMenu) {
        setActiveMenu(null);
      }
    }, 100);
  };

  const navItems = [
    { name: 'Home', path: '/', hasMenu: false },
    { name: 'Sarees', menuType: 'sarees' as MenuType, hasMenu: true },
    { name: 'Collections', menuType: 'collections' as MenuType, hasMenu: true },
    { name: 'Silk & Weaves', menuType: 'silk-weaves' as MenuType, hasMenu: true },
    { name: 'New Arrivals', path: '/shop?collection=new-arrivals', hasMenu: false, badge: 'New' },
    { name: 'Wedding', path: '/shop?collection=wedding', hasMenu: false },
    { name: 'Journal', menuType: 'journal' as MenuType, hasMenu: true },
    { name: 'About', path: '/about-us', hasMenu: false },
  ];

  return (
    <div className="hidden lg:flex items-center justify-center flex-1 h-full px-8 relative" onMouseLeave={handleMouseLeave}>
      <nav className="flex items-center space-x-6 xl:space-x-8 h-full">
        {navItems.map((item) => (
          item.hasMenu ? (
            <button
              key={item.name}
              onMouseEnter={() => handleMouseEnter(item.menuType!)}
              onClick={() => setActiveMenu(activeMenu === item.menuType ? null : item.menuType!)}
              className={`relative h-full flex items-center text-sm font-medium tracking-wide transition-colors ${
                activeMenu === item.menuType ? 'text-primary' : 'text-secondary hover:text-primary'
              }`}
              aria-expanded={activeMenu === item.menuType}
            >
              {item.name}
              {activeMenu === item.menuType && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-accent transform origin-left transition-transform duration-300 ease-out" />
              )}
            </button>
          ) : (
            <Link
              key={item.name}
              to={item.path!}
              onMouseEnter={() => setActiveMenu(null)}
              className="relative h-full flex items-center text-sm font-medium tracking-wide text-secondary hover:text-primary transition-colors group"
            >
              {item.name}
              {item.badge && (
                <span className="absolute -top-1 -right-4 text-[9px] font-bold uppercase tracking-wider text-accent">
                  {item.badge}
                </span>
              )}
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-accent transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out" />
            </Link>
          )
        ))}
      </nav>

      <div 
        onMouseEnter={() => setIsHoveringMenu(true)} 
        onMouseLeave={() => { setIsHoveringMenu(false); setActiveMenu(null); }}
      >
        <MegaMenuWrapper isOpen={activeMenu === 'sarees'} onClose={() => setActiveMenu(null)}>
          <SareeMegaMenu />
        </MegaMenuWrapper>

        <MegaMenuWrapper isOpen={activeMenu === 'collections'} onClose={() => setActiveMenu(null)}>
          <CollectionMegaMenu />
        </MegaMenuWrapper>

        <MegaMenuWrapper isOpen={activeMenu === 'silk-weaves'} onClose={() => setActiveMenu(null)}>
          <SilkWeaveMegaMenu />
        </MegaMenuWrapper>

        <MegaMenuWrapper isOpen={activeMenu === 'journal'} onClose={() => setActiveMenu(null)}>
          <JournalMegaMenu />
        </MegaMenuWrapper>
      </div>
    </div>
  );
};
